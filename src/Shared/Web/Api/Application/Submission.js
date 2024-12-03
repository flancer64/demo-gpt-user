/**
 * Data Transfer Object (DTO) for submitting a user application request.
 * This structure defines the request and response formats for the application submission operation.
 * It serves as a bridge between the API and the calling application logic.
 * @namespace GptUser_Shared_Web_Api_Application_Submission
 */

// VARS
/**
 * Enum-like object defining possible result codes for the application submission operation.
 * @memberOf GptUser_Shared_Web_Api_Application_Submission
 */
const RESULT_CODE = {
    SERVICE_ERROR: 'SERVICE_ERROR', // Internal server error occurred during the application submission process.
    SUCCESS: 'SUCCESS', // Application was successfully submitted.
    UNAUTHENTICATED: 'UNAUTHENTICATED', // Authentication failed due to incorrect PIN or pass phrase.
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request DTO for the application submission service.
 * Defines the structure of the input data required for submitting an application.
 * @memberOf GptUser_Shared_Web_Api_Application_Submission
 */
class Request {
    /**
     * The body of the email message in English.
     * @type {string}
     * @example "Business: Tech, Integration: Yes, GPT Experience: No, Contact: email@example.com"
     */
    messageEn;

    /**
     * The body of the email message in Russian.
     * @type {string}
     * @example "Бизнес: Технологии, Интеграция: Да, Опыт с GPT: Нет, Контакт: email@example.com"
     */
    messageRu;

    /**
     * Passphrase used for user authentication.
     * @type {string}
     * @example "my_secure_passphrase"
     */
    passPhrase;

    /**
     * Unique PIN assigned to the user during registration.
     * @type {number}
     * @example 123456
     */
    pin;

    /**
     * Subject line for the email.
     * @type {string}
     * @example "Application Request for Web Application Development"
     */
    subject;
}

/**
 * Response DTO for the application submission service.
 * Defines the structure of the response data returned by the API.
 * @memberOf GptUser_Shared_Web_Api_Application_Submission
 */
class Response {
    /**
     * Human-readable status message describing the outcome of the application submission operation.
     * @type {string}
     * @example "The application has been successfully submitted. We will contact you shortly."
     */
    instructions;

    /**
     * Code representing the result of the application submission operation.
     * @type {string}
     * @see GptUser_Shared_Web_Api_Application_Submission.RESULT_CODE
     */
    resultCode;
}

/**
 * Service endpoint for the application submission feature.
 * Implements the core API logic for handling user application submissions.
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class GptUser_Shared_Web_Api_Application_Submission {
    /**
     * Initializes the service with necessary utilities for type casting.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for safe type conversion.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for the application submission.
         * @param {GptUser_Shared_Web_Api_Application_Submission.Request} [data] - User input data.
         * @returns {GptUser_Shared_Web_Api_Application_Submission.Request} - Structured request object.
         */
        this.createReq = function (data) {
            const req = new Request();
            req.messageEn = cast.string(data?.messageEn);
            req.messageRu = cast.string(data?.messageRu);
            req.passPhrase = cast.string(data?.passPhrase);
            req.pin = cast.int(data?.pin);
            req.subject = cast.string(data?.subject);
            return req;
        };

        /**
         * Creates a response DTO for the application submission operation.
         * @param {GptUser_Shared_Web_Api_Application_Submission.Response} [data] - API response data.
         * @returns {GptUser_Shared_Web_Api_Application_Submission.Response} - Parsed response object.
         */
        this.createRes = function (data) {
            const res = new Response();
            res.instructions = cast.string(data?.instructions);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            return res;
        };

        /**
         * Retrieves the available result codes for the application submission operation.
         * @returns {typeof GptUser_Shared_Web_Api_Application_Submission.RESULT_CODE} - Defined result codes.
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
