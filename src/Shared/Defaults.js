/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class GptUser_Shared_Defaults {

    /** @type {Fl64_Gpt_User_Shared_Defaults} */
    MOD_GPT_USER;

    /**
     * The NPM package name representing the plugin.
     * This value is used as a unique identifier across the system
     * and for referencing the plugin in external configurations.
     *
     * @type {string}
     */
    NAME = '@flancer64/demo-gpt-user';

    ROUTE_UPDATE = '/user/profile.html?token=:code';
    ROUTE_VERIFY = '/user/signup.html?token=:code';

    /**
     * Initializes the shared defaults.
     *
     * @param {Fl64_Gpt_User_Shared_Defaults} MOD_GPT_USER
     *
     * This constructor freezes the object to prevent any runtime modifications
     * to its properties, ensuring the integrity of the shared configuration.
     */
    constructor(
        {
            Fl64_Gpt_User_Shared_Defaults$: MOD_GPT_USER,
        }
    ) {
        this.MOD_GPT_USER = MOD_GPT_USER;
        Object.freeze(this);
    }
}
