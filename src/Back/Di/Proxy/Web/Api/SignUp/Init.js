/**
 * Proxy for wrapping the user sign-up initialization API.
 *
 * Enhances the API by adding logic to update application-specific user data
 * after successful registration.
 *
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 */
export default class GptUser_Back_Di_Proxy_Web_Api_SignUp_Init {

    /**
     * @param {Object} deps
     * @param {TeqFw_Core_Shared_Api_Logger} deps.TeqFw_Core_Shared_Api_Logger$$
     * @param {Fl64_Gpt_User_Back_Mod_User} deps.Fl64_Gpt_User_Back_Mod_User$
     * @param {GptUser_Back_Mod_User} deps.GptUser_Back_Mod_User$
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Back_Mod_User$: modUserPlugin,
            GptUser_Back_Mod_User$: modUserApp,
        }
    ) {
        /**
         * Wraps the original API object to inject custom behavior.
         *
         * @param {Fl64_Gpt_User_Back_Web_Api_SignUp_Init} origin
         * @return {Fl64_Gpt_User_Back_Web_Api_SignUp_Init}
         */
        this.wrapOrigin = function (origin) {
            const RES = origin.getEndpoint().getResultCodes();

            const originalProcess = origin.process.bind(origin);

            /**
             * Adds logic to update user data after successful registration.
             *
             * @param {GptUser_Shared_Di_Proxy_SignUp_Init.Request} req
             * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response} res
             * @param {Object} context
             * @return {Promise<Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response>}
             */
            origin.process = async function (req, res, context) {
                const result = await originalProcess(req, res, context);

                try {
                    if ((res?.resultCode === RES.SUCCESS) && (res?.pin)) {
                        const userPlugin = await modUserPlugin.read({pin: res.pin});

                        if (userPlugin) {
                            const userApp = await modUserApp.read({id: userPlugin.userRef});
                            userApp.name = req.name;
                            await modUserApp.update({dto: userApp});
                            logger.info(`Changed default username for app user to '${req.name}'.`);
                        } else {
                            logger.error(`Cannot load plugin user for PIN ${res.pin}.`);
                        }
                    } else {
                        logger.info(`Cannot update username (result/PIN): ${res?.resultCode}/${res?.pin}.`);
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
