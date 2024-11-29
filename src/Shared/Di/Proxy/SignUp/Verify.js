/**
 * Proxy DTO for extending the email verification response with a name property.
 * @namespace GptUser_Shared_Di_Proxy_SignUp_Verify
 *
 * This namespace provides a proxy mechanism to enhance the response DTO of the
 * email verification API during user sign-up. It dynamically includes a `name`
 * property to personalize the response.
 */

/**
 * Extended response DTO for email verification.
 * Adds the `name` property to the base response structure for personalization.
 * @extends Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Response
 * @memberOf GptUser_Shared_Di_Proxy_SignUp_Verify
 */
class Response {
    /**
     * User's display name added to the response for personalization.
     * This property is not part of the original API response.
     *
     * @type {string}
     */
    name;
}

/**
 * Proxy class for extending the email verification response DTO.
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 * @extends Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify
 *
 * This proxy intercepts and modifies the behavior of the email verification DTO creation.
 * It dynamically adds the `name` property to the response DTO to provide a more
 * user-friendly and personalized output.
 */
export default class GptUser_Shared_Di_Proxy_SignUp_Verify {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast Utility for data casting.
     * @param {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify} dtoBase Base DTO class for email verification.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify$: dtoBase,
        }
    ) {
        const originalCreateRes = dtoBase.createRes;

        /**
         * Enhances the response DTO with a `name` property for personalized responses.
         * Overrides the default DTO creation logic of the base class.
         *
         * @param {GptUser_Shared_Di_Proxy_SignUp_Verify.Response} [data] Input data for creating the response DTO.
         * @returns {GptUser_Shared_Di_Proxy_SignUp_Verify.Response} Enhanced response DTO with the additional `name` property.
         */
        dtoBase.createRes = function (data) {
            const res = originalCreateRes.call(dtoBase, data);

            // Adds the user's name to the response DTO.
            res.name = cast.string(data?.name);
            return res;
        };

        return dtoBase;
    }
}
