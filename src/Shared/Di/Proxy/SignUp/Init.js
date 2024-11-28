/**
 * DTO for initiating the user sign-up process.
 * @namespace GptUser_Shared_Di_Proxy_SignUp_Init
 */
// VARS
// CLASSES
/**
 * Request structure for initiating user registration.
 * @extends Fl64_Gpt_User_Shared_Web_Api_SignUp_Init.Request
 * @memberOf GptUser_Shared_Di_Proxy_SignUp_Init
 */
class Request {
    /**
     * Display name for the user.
     *
     * @type {string}
     * @example "John Doe"
     */
    name;
}

/**
 * This constructor overrides the `createReq` method of the base DTO
 * to add processing for the `name` property.
 *
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 * @extends Fl64_Gpt_User_Shared_Web_Api_SignUp_Init
 */
export default class GptUser_Shared_Di_Proxy_SignUp_Init {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init} dtoBase
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Web_Api_SignUp_Init$: dtoBase,
        }
    ) {
        const originalCreateReq = dtoBase.createReq;
        /**
         * Overrides the `createReq` method of the base DTO.
         * Adds processing for the `name` property and ensures all properties are set to the correct type.
         *
         * @param {GptUser_Shared_Di_Proxy_SignUp_Init.Request} [data] - Input data for creating the request DTO.
         * @returns {GptUser_Shared_Di_Proxy_SignUp_Init.Request} - The created request DTO with the extended `name` property.
         */
        dtoBase.createReq = function (data) {
            const req = originalCreateReq.call(dtoBase, data);
            req.name = cast.string(data?.name);
            // noinspection JSValidateTypes
            return req;
        };

        return dtoBase;
    }
}

