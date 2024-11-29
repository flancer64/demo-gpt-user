/**
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 *
 * This proxy class extends the behavior of the email verification API during user sign-up.
 * It dynamically adds the user's name to the response object by retrieving additional
 * user details from application-specific and plugin-specific user modules.
 */
export default class GptUser_Back_Di_Proxy_Web_Api_SignUp_Verify {

    /**
     * Initializes the proxy for the sign-up verification API.
     *
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance for tracking errors and actions.
     * @param {Fl64_Gpt_User_Back_Mod_User} modUserPlugin - User data module from the plugin context.
     * @param {GptUser_Back_Mod_User} modUserApp - User data module from the application context.
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Back_Mod_User$: modUserPlugin,
            GptUser_Back_Mod_User$: modUserApp,
        }
    ) {
        /**
         * Wraps the original API endpoint with additional logic.
         * Enhances the response of the email verification process by appending the user's name.
         *
         * @param {Fl64_Gpt_User_Back_Web_Api_SignUp_Verify} origin - The original API endpoint instance.
         * @return {Fl64_Gpt_User_Back_Web_Api_SignUp_Verify} - The enhanced API endpoint.
         */
        this.wrapOrigin = function (origin) {
            const RES = origin.getEndpoint().getResultCodes();
            const originalProcess = origin.process.bind(origin);

            /**
             * Extends the response of the email verification process.
             * If the verification succeeds, retrieves the user's name and appends it to the response.
             *
             * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Request} req - Request object for email verification.
             * @param {GptUser_Shared_Di_Proxy_SignUp_Verify.Response} res - Response object for email verification.
             * @param context - Execution context for the request.
             * @return {Promise<Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Response>} - The modified response object.
             */
            origin.process = async function (req, res, context) {
                const result = await originalProcess(req, res, context);

                try {
                    if ((res?.resultCode === RES.SUCCESS) && (res?.pin)) {
                        const userPlugin = await modUserPlugin.read({pin: res.pin});
                        if (userPlugin) {
                            const userApp = await modUserApp.read({id: userPlugin.userRef});
                            res.name = userApp.name;
                        }
                    }
                } catch (e) {
                    logger.exception(e);
                }

                return result;
            };

            return origin;
        };
    }
}
