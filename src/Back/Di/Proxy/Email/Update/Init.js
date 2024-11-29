/**
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 *
 * This proxy class modifies the behavior of the email verification logic. It dynamically adjusts
 * the format of verification links to align with the application's routing configuration and adds
 * additional user-specific information, such as the username, to email templates.
 */
export default class GptUser_Back_Di_Proxy_Email_SignUp_Init {

    /**
     * Creates an instance of the proxy for enhancing email verification functionality.
     *
     * @param {GptUser_Back_Defaults} DEF - Shared configuration constants for the application.
     * @param {GptUser_Back_Mod_User} modUser - Data model for accessing user details in the database.
     */
    constructor(
        {
            GptUser_Back_Defaults$: DEF,
            GptUser_Back_Mod_User$: modUser,
        }
    ) {
        const {SEARCH, REPLACE} = extractUrlParts();

        /**
         * Extracts patterns for replacing placeholders in verification links.
         * Removes query parameters from URLs to generate search and replace strings.
         *
         * @returns {{SEARCH: string, REPLACE: string}}
         */
        function extractUrlParts() {
            const plugin = DEF.SHARED.MOD_GPT_USER.ROUTE_UPDATE;
            const app = DEF.SHARED.ROUTE_UPDATE;

            const SEARCH = plugin.split('?')[0];
            const REPLACE = app.split('?')[0];

            return {SEARCH, REPLACE};
        }

        /**
         * Enhances the given instance of the email verification class.
         * Modifies its behavior to adjust verification links and enrich email variables.
         *
         * @param {Fl64_Gpt_User_Back_Email_SignUp_Init} origin - Instance of the email verification logic.
         * @return {Fl64_Gpt_User_Back_Email_SignUp_Init} - The enhanced instance.
         */
        this.wrapOrigin = function (origin) {
            const originalPrepareVars = origin.prepareVars.bind(origin);

            /**
             * Enriches email variables for verification emails.
             * Adjusts the verification link format and includes the username.
             *
             * @returns {Promise<{verify_link: string, username: string}>}
             */
            origin.prepareVars = async function (trx, user) {
                const res = await originalPrepareVars(trx, user);

                if (res.verify_link && typeof res.verify_link === 'string') {
                    res.verify_link = res.verify_link.replace(SEARCH, REPLACE);
                }

                if (user?.userRef) {
                    const found = await modUser.read({trx, id: user.userRef});
                    res.username = found?.name ?? 'User';
                }

                return res;
            };

            return origin;
        };
    }
}
