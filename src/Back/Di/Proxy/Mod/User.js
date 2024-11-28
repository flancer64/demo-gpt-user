/**
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 */
export default class GptUser_Back_Di_Proxy_Mod_User {

    /**
     * @param {GptUser_Back_Mod_User} modUser
     */
    constructor(
        {
            GptUser_Back_Mod_User$: modUser,
        }
    ) {
        /**
         * Wraps the original model's create method to first call `modUser.create(params)`
         * before invoking the original `create(params)` on the `origin` model.
         *
         * @param {Fl64_Gpt_User_Back_Mod_User} origin - The original model instance.
         * @return {Fl64_Gpt_User_Back_Mod_User} - The modified origin with wrapped create.
         */
        this.wrapOrigin = function (origin) {
            // Save the original `create` method
            const originalCreate = origin.create.bind(origin);

            // Override `create` to include the `modUser` call first
            origin.create = async function ({trx, dto}) {
                if (!dto?.userRef) {
                    // Call `modUser.create(params)` before the original `create`
                    const dtoUserApp = modUser.composeEntity();
                    dtoUserApp.name = 'Jane Doe';
                    const created = await modUser.create({trx, dto: dtoUserApp});
                    dto.userRef = created.id;
                }
                // Now call the original `create` method
                return await originalCreate({trx, dto});
            };

            return origin;
        };
    }
}