/**
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 */
export default class GptUser_Back_Di_Proxy_Web_Api_Update_Save {

    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance.
     * @param {Fl64_Gpt_User_Back_Mod_Token} modToken
     * @param {GptUser_Back_Mod_User} modUserApp
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Gpt_User_Back_Mod_Token$: modToken,
            GptUser_Back_Mod_User$: modUserApp,
        }
    ) {
        /**
         * @param {Fl64_Gpt_User_Back_Web_Api_Update_Save} origin
         * @return {Fl64_Gpt_User_Back_Web_Api_Update_Save}
         */
        this.wrapOrigin = function (origin) {
            const RES = origin.getEndpoint().getResultCodes();
            // Save the original method
            const originalProcess = origin.process.bind(origin);
            /**
             * @param {GptUser_Shared_Di_Proxy_Update_Save.Request} req
             * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Response} res
             * @param context
             * @return {Promise<Fl64_Gpt_User_Shared_Web_Api_Update_Save.Response>}
             */
            origin.process = async function (req, res, context) {
                // get token data before processing
                const token = await modToken.read({code: req.token});
                // make original processing
                /** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Save.Response} */
                const result = await originalProcess(req, res, context);
                try {
                    if (res?.resultCode === RES.SUCCESS) {
                        if (req.name) {
                            const userApp = await modUserApp.read({id: token.userRef});
                            userApp.name = req.name;
                            await modUserApp.update({dto: userApp});
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