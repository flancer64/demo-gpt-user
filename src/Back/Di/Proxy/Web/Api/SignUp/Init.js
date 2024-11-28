/**
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 */
export default class GptUser_Back_Di_Proxy_Web_Api_Update_Init {

    /**
     * @param {Fl64_Gpt_User_Back_Mod_User} modUserPlugin
     * @param {GptUser_Back_Mod_User} modUserApp
     */
    constructor(
        {
            Fl64_Gpt_User_Back_Mod_User$: modUserPlugin,
            GptUser_Back_Mod_User$: modUserApp,
        }
    ) {
        /**
         * @param {Fl64_Gpt_User_Back_Web_Api_SignUp_Init} origin
         * @return {Fl64_Gpt_User_Back_Web_Api_SignUp_Init}
         */
        this.wrapOrigin = function (origin) {
            const RES = origin.getEndpoint().getResultCodes();
            // Save the original method
            const originalProcess = origin.process.bind(origin);
            /**
             * @param {GptUser_Shared_Di_Proxy_SignUp_Init.Request} req
             * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response} res
             * @param context
             * @return {Promise<Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response>}
             */
            origin.process = async function (req, res, context) {
                /** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Response} */
                const result = await originalProcess(req, res, context);
                try {
                    if ((res?.resultCode === RES.SUCCESS) && (res?.pin)) {
                        const userPlugin = await modUserPlugin.read({pin: res.pin});
                        if (userPlugin) {
                            const userApp = await modUserApp.read({id: userPlugin.userRef});
                            userApp.name = req.name;
                            await modUserApp.update({dto: userApp});
                        }
                    }
                } catch (e) {

                }
                return result;
            };

            return origin;
        };
    }
}