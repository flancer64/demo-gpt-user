/**
 * Data Transfer Objects (DTOs) and supporting logic for sending user messages to the business owner.
 * This script provides:
 * - The request DTO defining the input structure for sending a user message.
 * - The response DTO defining the output structure returned by the API.
 * - Result codes indicating the operation's outcome.
 * - Factory functions to create and validate DTOs.
 *
 * The service allows authenticated users to send free-form messages directly to the business owner or support team.
 * Users formulate their message in their native language through the chat, which translates it into English and Russian
 * before delivering it to the business owner. English serves as the international communication language, while Russian
 * is used as the owner's native language.
 *
 * @namespace GptUser_Shared_Web_Api_Application_Submission
 */

// VARS
/**
 * Enum-like object defining possible result codes for the message submission operation.
 * @memberOf GptUser_Shared_Web_Api_Message_Submission
 */
const RESULT_CODE = {
    /**
     * Indicates an internal server error occurred during the message submission process.
     * The user should retry later.
     */
    SERVICE_ERROR: 'SERVICE_ERROR',

    /**
     * Indicates the message was successfully submitted to the service.
     */
    SUCCESS: 'SUCCESS',

    /**
     * Indicates authentication failed due to incorrect PIN or passphrase.
     * The user should verify their credentials and try again.
     */
    UNAUTHENTICATED: 'UNAUTHENTICATED',
};
Object.freeze(RESULT_CODE);

// CLASSES
/**
 * Request DTO for submitting a user message.
 * Defines the input structure required by the API for processing a user message submission.
 * The sender (chat) must obtain authentication details (PIN and passphrase) from the user, along with the message
 * text in any language, and send it translated into both English and Russian.
 *
 * @memberOf GptUser_Shared_Web_Api_Message_Submission
 */
class Request {
    /**
     * The body of the message in English.
     * Must clearly convey the user's message or request.
     *
     * @type {string}
     * @example "I would like to inquire about custom integrations. Contact: email@example.com"
     */
    messageEn;

    /**
     * The body of the message in Russian.
     * Must mirror the content of `messageEn` for Russian-speaking recipients.
     *
     * @type {string}
     * @example "Я хотел бы узнать о кастомных интеграциях. Контакт: email@example.com"
     */
    messageRu;

    /**
     * Passphrase used for authenticating the user.
     * Together with the PIN, this ensures the request originates from a valid user.
     *
     * @type {string}
     * @example "my_secure_passphrase"
     */
    passPhrase;

    /**
     * Unique PIN assigned to the user during registration.
     * Used to identify the user's account for the message submission process.
     *
     * @type {number}
     * @example 123456
     */
    pin;

    /**
     * Subject line for the message.
     * Provides a brief and meaningful description of the user's intent.
     * The subject is always specified by the chat in English.
     *
     * @type {string}
     * @example "Inquiry about Custom Integrations"
     */
    subject;
}

/**
 * Response DTO for the message submission operation.
 * Defines the output structure returned by the API after processing a user message.
 * Communicates the operation's result to the application and provides a human-readable message for the user.
 *
 * @memberOf GptUser_Shared_Web_Api_Message_Submission
 */
class Response {
    /**
     * A human-readable message describing the outcome of the message submission process.
     * This message provides clear feedback to the user regarding the request's status.
     * Instructions are provided in English and must be translated by the chat
     * into the language used by the specific user for communication.
     *
     * @type {string}
     * @example "The message has been successfully submitted. We will contact you shortly."
     */
    instructions;


    /**
     * A code representing the result of the message submission process.
     * Used programmatically to determine the success or failure of the operation.
     *
     * @type {string}
     * @see GptUser_Shared_Web_Api_Message_Submission.RESULT_CODE
     * @example "SUCCESS"
     */
    resultCode;
}

/**
 * Service endpoint for the message submission feature.
 * Implements the core API logic for handling user message submissions.
 * Contains methods for validating and structuring input data, processing API responses, and handling result codes.
 *
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class GptUser_Shared_Web_Api_Message_Submission {
    /**
     * Initializes the service with utilities for type casting and validation.
     *
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for safe type conversion.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a request DTO for the message submission process.
         * Validates and structures the user-provided data into a format understood by the API.
         *
         * @param {GptUser_Shared_Web_Api_Message_Submission.Request} [data]
         * @returns {GptUser_Shared_Web_Api_Message_Submission.Request}
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
         * Creates a response DTO for the message submission operation.
         * Parses the API response into a structured format for easy processing.
         *
         * @param {GptUser_Shared_Web_Api_Message_Submission.Response} [data]
         * @returns {GptUser_Shared_Web_Api_Message_Submission.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.instructions = cast.string(data?.instructions);
            res.resultCode = cast.enum(data?.resultCode, RESULT_CODE);
            return res;
        };

        /**
         * Retrieves the available result codes for the message submission process.
         * @returns {typeof GptUser_Shared_Web_Api_Message_Submission.RESULT_CODE}
         */
        this.getResultCodes = () => RESULT_CODE;
    }
}
