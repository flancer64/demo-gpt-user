/**
 * Service for submitting a user application request.
 *
 * The service allows authenticated users to send free-form messages directly to the business owner or support team.
 * Users formulate their message in their native language through the chat, which translates it into English and Russian
 * before delivering it to the business owner. English serves as the international communication language, while Russian
 * is used as the owner's native language.
 */
export default class GptUser_Back_Web_Api_Message_Submission {
    /**
     * @param {GptUser_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Web_Back_App_Server_Respond.respond403|function} respond403
     * @param {GptUser_Shared_Web_Api_Message_Submission} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {Fl64_Gpt_User_Back_Util_Log} utilLog
     * @param {Fl64_Gpt_User_Back_Mod_Auth} modAuth
     * @param {Fl64_Gpt_User_Back_Mod_Openai_User} modOaiUser
     * @param {TeqFw_Email_Back_Act_Send} actSend
     */
    constructor(
        {
            GptUser_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Web_Back_App_Server_Respond.respond403': respond403,
            GptUser_Shared_Web_Api_Message_Submission$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            Fl64_Gpt_User_Back_Util_Log$: utilLog,
            Fl64_Gpt_User_Back_Mod_Auth$: modAuth,
            Fl64_Gpt_User_Back_Mod_Openai_User$: modOaiUser,
            TeqFw_Email_Back_Act_Send$: actSend,
        }
    ) {
        // VARS
        const CODE = endpoint.getResultCodes();
        let EMAIL_SUPPORT;

        // MAIN
        /**
         * Returns the endpoint associated with this service.
         * @returns {GptUser_Shared_Web_Api_Message_Submission}
         */
        this.getEndpoint = () => endpoint;

        /**
         * Initializes the service. Add any setup steps here if required.
         * @returns {Promise<void>}
         */
        this.init = async function () {
            /** @type {GptUser_Back_Plugin_Dto_Config_Local.Dto} */
            const cfg = config.getLocal(DEF.NAME);
            EMAIL_SUPPORT = cfg.emailSupport;
        };

        /**
         * Processes the application submission request.
         * @param {GptUser_Shared_Web_Api_Message_Submission.Request} req
         * @param {GptUser_Shared_Web_Api_Message_Submission.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} [context]
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            utilLog.traceOpenAi(context?.request);
            // Ensure the request is authorized
            if (!modAuth.isValidRequest(context?.request)) {
                respond403(context?.response);
                return;
            }

            const rs = endpoint.createRes();
            let resultCode = CODE.SERVICE_ERROR;

            // Start a transaction for database operations
            const trx = await conn.startTransaction();

            try {
                // Retrieve user details by PIN
                const foundUser = await modAuth.loadUser({trx, pin: req.pin, passPhrase: req.passPhrase});
                if (!foundUser) {
                    // Handle unauthenticated or inactive user
                    resultCode = CODE.UNAUTHENTICATED;
                    rs.message = 'Authentication failed. Ensure your PIN and passphrase are correct, and your account is active.';
                } else {
                    // Prepare email subject and content
                    const emailSubject = req.subject || 'Application Submission'; // Default subject
                    const emailContent = `${req.messageEn}\n\n${req.messageRu}`; // Combining English and Russian messages

                    // Attempt to send the email
                    const emailSent = await actSend.act({
                        from: foundUser.email,
                        to: EMAIL_SUPPORT,
                        subject: emailSubject,
                        text: emailContent,
                    });

                    // Update the last date
                    const ephemeralId = context?.request?.headers[DEF.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID];
                    await modOaiUser.updateDateLast({trx, userRef: foundUser.userRef, ephemeralId});

                    resultCode = emailSent.success ? CODE.SUCCESS : CODE.SERVICE_ERROR;
                    rs.message = resultCode === CODE.SUCCESS
                        ? 'Thank you for your message. We appreciate your cooperation and will review it shortly.'
                        : 'The application could not be submitted due to an internal error. Please try again later.';
                }

                await trx.commit();
            } catch (error) {
                logger.exception(error);
                await trx.rollback();
                rs.message = 'An unexpected error occurred while processing your request. Please try again later.';
            }

            rs.resultCode = resultCode;
            Object.assign(res, rs);
        };
    }
}
