/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class GptUser_Shared_Defaults {
    /**
     * The NPM package name representing the plugin.
     * This value is used as a unique identifier across the system
     * and for referencing the plugin in external configurations.
     *
     * @type {string}
     */
    NAME = '@flancer64/demo-gpt-user';

    /**
     * Initializes the shared defaults.
     *
     * This constructor freezes the object to prevent any runtime modifications
     * to its properties, ensuring the integrity of the shared configuration.
     */
    constructor() {
        Object.freeze(this);
    }
}
