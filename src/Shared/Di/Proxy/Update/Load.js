/**
 * Proxy DTO for extending the user profile data retrieval response with a name property.
 * @namespace GptUser_Shared_Di_Proxy_Update_Load
 */

/**
 * Extended response DTO for user profile data retrieval.
 * Adds the `name` property to the base response structure.
 * @extends Fl64_Gpt_User_Shared_Web_Api_Update_Load.Response
 * @memberOf GptUser_Shared_Di_Proxy_Update_Load
 */
class Response {
    /**
     * User's display name.
     * @type {string}
     */
    name;
}

/**
 * Proxy class for extending the user profile data retrieval response DTO.
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 * @extends Fl64_Gpt_User_Shared_Web_Api_Update_Load
 */
export default class GptUser_Shared_Di_Proxy_Update_Load {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast Utility for data casting.
     * @param {Fl64_Gpt_User_Shared_Web_Api_Update_Load} dtoBase Base DTO class for profile data retrieval.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Web_Api_Update_Load$: dtoBase,
        }
    ) {
        const originalCreateRes = dtoBase.createRes;

        /**
         * Overrides the response DTO creation to include the `name` property.
         * @param {GptUser_Shared_Di_Proxy_Update_Load.Response} [data] Input data for creating the response DTO.
         * @returns {GptUser_Shared_Di_Proxy_Update_Load.Response} Extended response DTO with the `name` property.
         */
        dtoBase.createRes = function (data) {
            const res = originalCreateRes.call(dtoBase, data);
            res.name = cast.string(data?.name);
            return res;
        };

        return dtoBase;
    }
}
