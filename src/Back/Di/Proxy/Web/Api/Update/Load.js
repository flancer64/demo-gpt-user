/**
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 */
export default class GptUser_Back_Di_Proxy_Web_Api_Update_Load {

    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance.
     * @param {Fl64_Gpt_User_Back_Mod_User} modUserPlugin
     * @param {GptUser_Back_Mod_User} modUserApp
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Back_Mod_User$: modUserPlugin,
            GptUser_Back_Mod_User$: modUserApp,
        }
    ) {
        /**
         * @param {Fl64_Gpt_User_Back_Web_Api_Update_Load} origin
         * @return {Fl64_Gpt_User_Back_Web_Api_Update_Load}
         */
        this.wrapOrigin = function (origin) {
            const RES = origin.getEndpoint().getResultCodes();
            // Save the original method
            const originalProcess = origin.process.bind(origin);
            /**
             * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Request} req
             * @param {GptUser_Shared_Di_Proxy_Update_Load.Response} res
             * @param context
             * @return {Promise<Fl64_Gpt_User_Shared_Web_Api_Update_Load.Response>}
             */
            origin.process = async function (req, res, context) {
                /** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Load.Response} */
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