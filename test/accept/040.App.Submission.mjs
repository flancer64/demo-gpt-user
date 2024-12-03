import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from './common.mjs';
import {constants as H2} from 'node:http2';

// Constants
const {
    HTTP2_HEADER_AUTHORIZATION,
} = H2;

const BEARER = process.env.AUTH_TOKEN ?? 'test-token';
const EMAIL_SUPPORT = process.env.EMAIL ?? 'user@any.domain.in.tld';
const EMAIL_USER = 'user@wants.to.apply.tld';
const MESSAGE_EN = 'This is a test email message.';
const MESSAGE_RU = 'Это сообщение на русском.';
const OAI_USER_ID = process.env.OAI_USER_ID ?? 'some-user-id';
const PASS_PHRASE = process.env.PASS_PHRASE ?? 'some password';
const SUBJECT = 'Test Application';
let PIN;

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {GptUser_Back_Web_Api_Application_Submission} */
let service = await container.get('GptUser_Back_Web_Api_Application_Submission$');
/** @type {GptUser_Shared_Web_Api_Application_Submission} */
let endpoint = await container.get('GptUser_Shared_Web_Api_Application_Submission$');
const RES_CODE = endpoint.getResultCodes();

/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUserPlugin = await container.get('Fl64_Gpt_User_Back_Mod_User$');
/** @type {TeqFw_Email_Back_Act_Send} */
const actSend = await container.get('TeqFw_Email_Back_Act_Send$');
/** @type {TeqFw_Core_Back_Config} */
const config = await container.get('TeqFw_Core_Back_Config$');
/** @type {GptUser_Back_Plugin_Dto_Config_Local} */
const dtoConfig = await container.get('GptUser_Back_Plugin_Dto_Config_Local$');
/** @type {GptUser_Back_Defaults} */
const DEF = await container.get('GptUser_Back_Defaults$');
/** @type {Fl64_Gpt_User_Back_Defaults} */
const DEF_GPT = await container.get('Fl64_Gpt_User_Back_Defaults$');

describe('040: Application Submission Service', () => {
    const context = {
        request: {
            headers: {
                [HTTP2_HEADER_AUTHORIZATION]: 'Bearer ' + BEARER,
                [DEF_GPT.HTTP_HEAD_OPENAI_EPHEMERAL_USER_ID]: OAI_USER_ID
            },
        },
    };

    const origGetLocal = config.getLocal;
    origGetLocal.bind(config);
    config.getLocal = (name) => {
        if (name === DEF.NAME) {
            const res = dtoConfig.createDto();
            res.emailSupport = EMAIL_SUPPORT;
            return res;
        } else return origGetLocal(name);
    };

    before(async function () {
        this.timeout(60000);
        await dbReset(container);
        await dbConnect(container);

        // Create a user for testing
        const salt = 'random_salt';
        const dto = modUserPlugin.composeEntity();
        dto.email = EMAIL_USER;
        dto.locale = 'en-US';
        dto.passHash = modUserPlugin.hashPassPhrase({passPhrase: PASS_PHRASE, salt});
        dto.passSalt = salt;
        dto.status = 'ACTIVE';
        const created = await modUserPlugin.create({dto});
        PIN = created.pin;

        //
        await service.init();

    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should send an email successfully', async () => {
        // Create request and response DTOs
        const req = endpoint.createReq();
        req.messageEn = MESSAGE_EN;
        req.messageRu = MESSAGE_RU;
        req.passPhrase = PASS_PHRASE;
        req.pin = PIN;
        req.subject = SUBJECT;

        const res = endpoint.createRes();

        // Mock email sending action
        const sendEmailStub = actSend.act;
        actSend.act = async ({from, to, subject}) => {
            assert.strictEqual(from, EMAIL_USER, 'Email sender should match');
            assert.strictEqual(to, EMAIL_SUPPORT, 'Email recipient should match');
            assert.strictEqual(subject, SUBJECT, 'Email subject should match');
            return {success: true};
        };

        // Process the request
        await service.process(req, res, context);

        // Validate the response
        assert.strictEqual(res.resultCode, RES_CODE.SUCCESS, 'Result code should indicate success');

        // Restore original email sending method
        actSend.act = sendEmailStub;
    });

});
