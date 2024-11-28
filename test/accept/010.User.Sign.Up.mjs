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
const LOCALE = 'lv-LV';
const NAME = 'Alex Gusev';
const PASS_PHRASE = process.env.PASS_PHRASE ?? 'some password';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {GptUser_Back_Mod_User} */
const modUserApp = await container.get('GptUser_Back_Mod_User$');
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUserPlugin = await container.get('Fl64_Gpt_User_Back_Mod_User$');
/** @type {Fl64_Gpt_User_Back_Mod_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_Token$');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_User_Status} */
const STATUS = await container.get('Fl64_Gpt_User_Shared_Enum_User_Status.default');
/** @type {typeof Fl64_Gpt_User_Shared_Enum_Token_Type} */
const TOKEN_TYPE = await container.get('Fl64_Gpt_User_Shared_Enum_Token_Type.default');

/** @type {Fl64_Gpt_User_Back_Web_Api_SignUp_Init} */
let serviceInit = await container.get('Fl64_Gpt_User_Back_Web_Api_SignUp_Init$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Init} */
let endpointInit = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Init$');
const RES_INIT = endpointInit.getResultCodes();

/** @type {Fl64_Gpt_User_Back_Web_Api_SignUp_Verify} */
let serviceVerify = await container.get('Fl64_Gpt_User_Back_Web_Api_SignUp_Verify$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify} */
let endpointVerify = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify$');
const RES_VERIFY = endpointVerify.getResultCodes();

let USER_ID, TOKEN_CODE;

describe('010: User Sign Up', () => {
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
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create the user and send email to validate address', async () => {
        /** @type {GptUser_Shared_Di_Proxy_SignUp_Init.Request} */
        const req = endpointInit.createReq();
        req.email = EMAIL;
        req.isConsent = true;
        req.locale = LOCALE;
        req.name = NAME;
        req.passPhrase = PASS_PHRASE;

        const res = endpointInit.createRes();
        await serviceInit.process(req, res, context);

        assert.strictEqual(res.resultCode, RES_INIT.SUCCESS, 'Registration should complete successfully');

        const userPlugin = await modUserPlugin.read({pin: res.pin});
        USER_ID = userPlugin.userRef;
        assert.strictEqual(userPlugin.email, EMAIL, 'Registered user email should match');
        assert.strictEqual(userPlugin.locale, LOCALE, 'Registered user locale should match');
        assert.strictEqual(userPlugin.status, STATUS.UNVERIFIED, 'User status should be UNVERIFIED after registration');

        const userApp = await modUserApp.read({id: userPlugin.userRef});
        assert.strictEqual(userApp.name, NAME, 'Registered user name should match');

        const tokens = await modToken.list({});
        const [token] = tokens;
        assert.ok(token, 'Verification token should exist');
        assert.strictEqual(token.user_ref, USER_ID, 'Token should belong to the registered user');
        assert.strictEqual(token.type, TOKEN_TYPE.EMAIL_VERIFICATION, 'Token type should be EMAIL_VERIFICATION');
        TOKEN_CODE = token.code;
    });

    it('should activate the user status', async () => {
        /** @type {Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify.Request} */
        const req = endpointVerify.createReq();
        req.token = TOKEN_CODE;

        const res = endpointVerify.createRes();
        await serviceVerify.process(req, res, null);

        assert.strictEqual(res.resultCode, RES_VERIFY.SUCCESS, 'Email verification should complete successfully');

        const userPlugin = await modUserPlugin.read({userRef: USER_ID});
        assert.strictEqual(userPlugin.status, STATUS.ACTIVE, 'User status should be ACTIVE after email verification');

        const token = await modToken.read({code: TOKEN_CODE});
        assert.strictEqual(token, null, 'Verification token should be deleted after use');
    });
});
