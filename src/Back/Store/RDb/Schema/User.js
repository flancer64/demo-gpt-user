/**
 * Persistent DTO with metadata for the RDB entity: Application User.
 * @namespace GptUser_Back_Store_RDb_Schema_User
 */

// MODULE'S VARS
/**
 * Path to the entity in the application's DEM.
 *
 * @type {string}
 */
const ENTITY = '/user';

/**
 * @memberOf GptUser_Back_Store_RDb_Schema_User
 * @type {Object}
 */
const ATTR = {
    ID: 'id',
    NAME: 'name',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf GptUser_Back_Store_RDb_Schema_User
 */
class Dto {
    /**
     * Unique identifier for the user. This field is auto-incremented.
     *
     * @type {number}
     */
    id;

    /**
     * The name of the user.
     *
     * @type {string}
     */
    name;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class GptUser_Back_Store_RDb_Schema_User {
    /**
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS
        /**
         * Creates a new DTO object with casted properties.
         *
         * @param {GptUser_Back_Store_RDb_Schema_User.Dto} [data]
         * @returns {GptUser_Back_Store_RDb_Schema_User.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.id = cast.int(data?.id);
            res.name = cast.string(data?.name);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         *
         * @returns {typeof GptUser_Back_Store_RDb_Schema_User.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            ENTITY,
            ATTR,
            [ATTR.ID],
            Dto
        );
    }
}
