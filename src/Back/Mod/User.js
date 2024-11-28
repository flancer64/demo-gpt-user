/**
 * Model for managing user data in the RDB.
 *
 * @implements TeqFw_Core_Shared_Api_Model
 */
export default class GptUser_Back_Mod_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance.
     * @param {TeqFw_Db_Back_RDb_IConnect} conn - Database connection instance.
     * @param {GptUser_Shared_Dto_User} dtoUser - Domain DTO factory.
     * @param {GptUser_Back_Convert_User} convUser - Converter between domain and persistent DTOs.
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud - CRUD engine instance.
     * @param {GptUser_Back_Store_RDb_Schema_User} rdbUser - RDB schema definition for the user entity.
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            GptUser_Shared_Dto_User$: dtoUser,
            GptUser_Back_Convert_User$: convUser,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            GptUser_Back_Store_RDb_Schema_User$: rdbUser,
        }
    ) {
        // VARS
        const ATTR = rdbUser.getAttributes();

        // FUNCS

        /**
         * Executes the creation of a new user in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - The transaction context.
         * @param {GptUser_Back_Store_RDb_Schema_User.Dto} dbUser - The user DTO containing data for the new record.
         * @returns {Promise<{id:number}>} - The ID of the newly created user record.
         */
        async function createEntity({trx, dbUser}) {
            const {[ATTR.ID]: id} = await crud.create(trx, rdbUser, dbUser);
            return {id};
        }

        /**
         * Deletes a user from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - Transaction context.
         * @param {GptUser_Back_Store_RDb_Schema_User.Dto} dbUser - User DTO containing the record to delete.
         * @returns {Promise<number>} - Number of deleted records.
         */
        async function deleteEntity({trx, dbUser}) {
            return await crud.deleteOne(trx, rdbUser, {[ATTR.ID]: dbUser.id});
        }

        /**
         * Reads a user from the database by ID or name.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - Transaction context.
         * @param {number} [id] - User ID.
         * @returns {Promise<{dbUser: GptUser_Back_Store_RDb_Schema_User.Dto}>} - Object containing the user data or an empty object if not found.
         */
        async function readEntity({trx, id}) {
            const dbUser = await crud.readOne(trx, rdbUser, id);
            return {dbUser};
        }

        /**
         * Updates a user record in the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - Transaction context.
         * @param {GptUser_Back_Store_RDb_Schema_User.Dto} dbUser - User DTO with updated data.
         * @returns {Promise<void>}
         */
        async function updateEntity({trx, dbUser}) {
            await crud.updateOne(trx, rdbUser, dbUser);
        }

        // MAIN

        /**
         * @type {function(GptUser_Shared_Dto_User.Dto=): GptUser_Shared_Dto_User.Dto}
         */
        this.composeEntity = dtoUser.createDto;

        /**
         * @type {function(GptUser_Shared_Dto_User.Dto=): GptUser_Shared_Dto_User.Dto}
         */
        this.composeItem = dtoUser.createDto;

        /**
         * @type {function(GptUser_Shared_Dto_User.Dto=): GptUser_Shared_Dto_User.Dto}
         */
        this.composeEntity = dtoUser.createDto;

        /**
         * Creates a new user in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Transaction context.
         * @param {GptUser_Shared_Dto_User.Dto} dto - Domain DTO for the new user.
         * @returns {Promise<GptUser_Shared_Dto_User.Dto>}
         */
        this.create = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                const {id} = await createEntity({trx: trxLocal, dbUser});
                const {dbUser: createdUser} = await readEntity({trx: trxLocal, id});
                const res = convUser.db2dom({dbUser: createdUser});
                if (!trx) await trxLocal.commit();
                logger.info(`User with ID ${createdUser.id} created successfully.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error creating user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Deletes a user record from the database.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Transaction context.
         * @param {GptUser_Shared_Dto_User.Dto} dto - Domain DTO for the user to delete.
         * @returns {Promise<number>}
         */
        this.delete = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = convUser.dom2db({user: dto});
                const res = await deleteEntity({trx: trxLocal, dbUser});
                if (!trx) await trxLocal.commit();
                logger.info(`User with ID ${dbUser.id} deleted successfully.`);
                return res;
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error deleting user: ${error.message}`);
                throw error;
            }
        };

        /**
         * Reads user data by ID or name.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Transaction context.
         * @param {number} id - User ID.
         * @returns {Promise<GptUser_Shared_Dto_User.Dto|null>}
         */
        this.read = async function ({trx, id}) {
            const trxLocal = trx ?? await conn.startTransaction();
            let result = null;

            try {
                const {dbUser} = await readEntity({trx: trxLocal, id});
                if (dbUser) {
                    result = convUser.db2dom({dbUser});
                    logger.info(`User read successfully with ID: ${result.id}`);
                } else {
                    logger.info(`User not found with ID: ${id ?? ''}`);
                }
                if (!trx) await trxLocal.commit();
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error reading user: ${error.message}`);
                throw error;
            }

            return result;
        };

        /**
         * Updates user data in the RDB.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx] - Transaction context.
         * @param {GptUser_Shared_Dto_User.Dto} dto - Domain DTO with updated data.
         * @returns {Promise<GptUser_Shared_Dto_User.Dto|null>}
         */
        this.update = async function ({trx, dto}) {
            const trxLocal = trx ?? await conn.startTransaction();
            try {
                const {dbUser} = await readEntity({trx: trxLocal, id: dto.id});
                if (dbUser) {
                    dbUser.name = dto.name;
                    await updateEntity({trx: trxLocal, dbUser});
                    logger.info(`User with ID ${dbUser.id} updated successfully.`);
                    const res = convUser.db2dom({dbUser});
                    if (!trx) await trxLocal.commit();
                    return res;
                } else {
                    logger.info(`User not found with ID: ${dto.id}`);
                    if (!trx) await trxLocal.commit();
                    return null;
                }
            } catch (error) {
                if (!trx) await trxLocal.rollback();
                logger.error(`Error updating user: ${error.message}`);
                throw error;
            }
        };
    }
}
