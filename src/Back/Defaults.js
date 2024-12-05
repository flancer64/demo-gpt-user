/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class GptUser_Back_Defaults {
    /**
     * Default locale for this app.
     * @type {string}
     */
    LOCALE = 'en';

    LOCALE_AVAILABLE = ['en', 'ru'];

    /**
     * NPM package name acts as the name.
     * @type {string}
     */
    NAME;

    /**
     * Shared defaults configuration for consistent behavior across modules.
     * @type {GptUser_Shared_Defaults}
     */
    SHARED;

    /**
     * @param {GptUser_Shared_Defaults} SHARED
     */
    constructor(
        {
            GptUser_Shared_Defaults$: SHARED,
        }
    ) {
        this.SHARED = SHARED;
        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
