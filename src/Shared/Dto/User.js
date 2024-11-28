/**
 * The user data structure for Business Logic (Domain DTO).
 */

// MODULE'S CLASSES
/**
 * @memberOf GptUser_Shared_Dto_User
 */
class Dto {
    /**
     * Unique identifier for the user.
     * @type {number}
     */
    id;
    /**
     * The name of the user.
     * @type {string}
     */
    name;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class GptUser_Shared_Dto_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Create a new DTO and populate it with initialization data.
         * @param {GptUser_Shared_Dto_User.Dto} [data]
         * @returns {GptUser_Shared_Dto_User.Dto}
         */
        this.createDto = function (data) {
            // Create new DTO and populate with initial data
            const res = Object.assign(new Dto(), data);

            // Cast known attributes
            res.id = cast.int(data?.id);
            res.name = cast.string(data?.name);

            return res;
        };
    }
}
