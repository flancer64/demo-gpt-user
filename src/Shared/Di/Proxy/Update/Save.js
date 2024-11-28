/**
 * Proxy wrapper for the profile update DTO to add the `name` property.
 * @namespace GptUser_Shared_Di_Proxy_Update_Save
 */

// CLASSES
/**
 * Request structure for saving user profile changes with an additional `name` property.
 * @extends Fl64_Gpt_User_Shared_Web_Api_Update_Save.Request
 * @memberOf GptUser_Shared_Di_Proxy_Update_Save
 */
class Request {
    /**
     * The display name of the user.
     * This field is added by the proxy for extended functionality.
     * @type {string}
     * @example "John Doe"
     */
    name;
}

/**
 * Proxy for extending functionality of the profile update DTO to include the `name` property.
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 * @extends Fl64_Gpt_User_Shared_Web_Api_Update_Save
 */
export default class GptUser_Shared_Di_Proxy_Update_Save {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast Utility for casting and validation.
     * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Save} dtoBase Base DTO object to be extended.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Web_Api_Update_Save$: dtoBase,
        }
    ) {
        const originalCreateReq = dtoBase.createReq;

        /**
         * Extends the `createReq` method of the base DTO to add the `name` property.
         *
         * @param {GptUser_Shared_Di_Proxy_Update_Save.Request} [data] - Input data for creating the request DTO.
         * @returns {GptUser_Shared_Di_Proxy_Update_Save.Request} - The extended request DTO.
         */
        dtoBase.createReq = function (data) {
            const req = originalCreateReq.call(dtoBase, data);
            req.name = cast.string(data?.name);
            return req;
        };

        return dtoBase;
    }
}
