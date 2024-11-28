/**
 * Converts Domain DTO to/from related DTOs (Persistent, etc.) for Application User.
 * @implements TeqFw_Core_Back_Api_Convert
 */
export default class GptUser_Back_Convert_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {GptUser_Shared_Dto_User} domDto
     * @param {GptUser_Back_Store_RDb_Schema_User} rdbDto
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            GptUser_Shared_Dto_User$: domDto,
            GptUser_Back_Store_RDb_Schema_User$: rdbDto,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Converts the persistent DTO (RDB) to the domain DTO.
         * @param {GptUser_Back_Store_RDb_Schema_User.Dto} dbUser
         * @returns {GptUser_Shared_Dto_User.Dto}
         */
        this.db2dom = function ({dbUser}) {
            const res = domDto.createDto();
            res.id = cast.int(dbUser?.id);
            res.name = cast.string(dbUser?.name);
            return res;
        };

        /**
         * The structure of the returned value.
         * @typedef {Object} Dom2RdbResult
         * @property {GptUser_Back_Store_RDb_Schema_User.Dto} dbUser
         * @memberof GptUser_Back_Convert_User
         */

        /**
         * Converts the domain DTO to the persistent DTO (RDB).
         * @param {GptUser_Shared_Dto_User.Dto} user
         * @returns {Dom2RdbResult}
         */
        this.dom2db = function ({user}) {
            const dbUser = rdbDto.createDto();
            dbUser.id = cast.int(user?.id);
            dbUser.name = cast.string(user?.name);
            return {dbUser};
        };
    }
}
