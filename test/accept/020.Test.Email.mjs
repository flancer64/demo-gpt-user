import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from './common.mjs';
import {constants as H2} from 'node:http2';

// Constants
const {
    HTTP2_HEADER_AUTHORIZATION,
} = H2;

const BEARER = process.env.AUTH_TOKEN ?? 'test-token';
const EMAIL = process.env.EMAIL ?? 'user@any.domain.in.tld';
const MESSAGE = 'This is a test email message.';
const PASS_PHRASE = process.env.PASS_PHRASE ?? 'some password';
const SUBJECT = 'Test Email Subject';
let PIN;

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Web_Api_Test_Email} */
let serviceTestEmail = await container.get('Fl64_Gpt_User_Back_Web_Api_Test_Email$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Test_Email} */
let endpointTestEmail = await container.get('Fl64_Gpt_User_Shared_Web_Api_Test_Email$');
const RES_CODE = endpointTestEmail.getResultCodes();

/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUserPlugin = await container.get('Fl64_Gpt_User_Back_Mod_User$');

/** @type {TeqFw_Email_Back_Act_Send} */
const actSend = await container.get('TeqFw_Email_Back_Act_Send$');

describe('020: Test Email Service', () => {
    const context = {
        request: {
            headers: {
                [HTTP2_HEADER_AUTHORIZATION]: 'Bearer ' + BEARER,
            },
        },
    };

    before(async function () {
        this.timeout(60000);
        await dbReset(container);
        await dbConnect(container);

        // Create a user for testing
        const salt = 'random_salt';
        const dto = modUserPlugin.composeEntity();
        dto.email = EMAIL;
        dto.locale = 'en-US';
        dto.passHash = modUserPlugin.hashPassPhrase({passPhrase: PASS_PHRASE, salt});
        dto.passSalt = salt;
        dto.status = 'ACTIVE';
        const created = await modUserPlugin.create({dto});
        PIN = created.pin;
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should send an email successfully', async () => {
        // Create request and response DTOs
        const req = endpointTestEmail.createReq();
        req.pin = PIN;
        req.passPhrase = PASS_PHRASE;
        req.subject = SUBJECT;
        req.message = MESSAGE;

        const res = endpointTestEmail.createRes();

        // Mock email sending action
        const sendEmailStub = actSend.act;
        actSend.act = async ({to, subject, text}) => {
            assert.strictEqual(to, EMAIL, 'Email recipient should match');
            assert.strictEqual(subject, SUBJECT, 'Email subject should match');
            assert.strictEqual(text, MESSAGE, 'Email message should match');
            return {success: true};
        };

        // Process the request
        await serviceTestEmail.process(req, res, context);

        // Validate the response
        assert.strictEqual(res.resultCode, RES_CODE.SUCCESS, 'Result code should indicate success');
        assert.strictEqual(
            res.message,
            'The email was successfully sent to the user. Check the user\'s registered email for the message.',
            'Response message should indicate email was sent successfully'
        );

        // Restore original email sending method
        actSend.act = sendEmailStub;
    });

});
