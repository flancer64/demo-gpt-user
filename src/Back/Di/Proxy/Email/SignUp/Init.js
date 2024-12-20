/**
 * @implements TeqFw_Core_Shared_Api_Di_Proxy
 *
 * This proxy class modifies the behavior of the email update logic. It dynamically adjusts
 * the format of profile edit links to align with the application's routing configuration
 * and adds additional user-specific information, such as the username, to email templates.
 */
export default class GptUser_Back_Di_Proxy_Email_Update_Init {

    /**
     * Creates an instance of the proxy for enhancing email update functionality.
     *
     * @param {GptUser_Back_Defaults} DEF - Shared configuration constants for the application.
     */
    constructor(
        {
            GptUser_Back_Defaults$: DEF,
        }
    ) {
        const {SEARCH, REPLACE} = extractUrlParts();
        const LOCALES = DEF.LOCALE_AVAILABLE;

        /**
         * Extracts patterns for replacing placeholders in verification links.
         * Removes query parameters from URLs to generate search and replace strings.
         *
         * @returns {{SEARCH: string, REPLACE: string}}
         */
        function extractUrlParts() {
            const plugin = DEF.SHARED.MOD_GPT_USER.ROUTE_VERIFY;
            const app = DEF.SHARED.ROUTE_VERIFY;

            const SEARCH = plugin.split('?')[0];
            const REPLACE = app.split('?')[0];

            return {SEARCH, REPLACE};
        }

        /**
         * Enhances the given instance of the email update class.
         * Modifies its behavior to adjust profile edit links and enrich email variables.
         *
         * @param {Fl64_Gpt_User_Back_Email_Update_Init} origin - Instance of the email update logic.
         * @return {Fl64_Gpt_User_Back_Email_Update_Init} - The enhanced instance.
         */
        this.wrapOrigin = function (origin) {
            const originalPrepareVars = origin.prepareVars.bind(origin);

            /**
             * Enriches email variables for profile update emails.
             * Adjusts the edit link format and includes the username.
             *
             * @returns {Promise<{verify_link: string, username: string}>}
             */
            origin.prepareVars = async function (trx, user) {
                const res = await originalPrepareVars(trx, user);

                if (res.verify_link && typeof res.verify_link === 'string') {
                    const locale = (LOCALES.includes(user?.locale)) ? user.locale : DEF.LOCALE;
                    const replace = `/${locale}${REPLACE}`;
                    res.verify_link = res.verify_link.replace(SEARCH, replace);
                }
                // The 'username' cannot be used here because the email is sent before the username is updated.
                return res;
            };

            return origin;
        };
    }
}
