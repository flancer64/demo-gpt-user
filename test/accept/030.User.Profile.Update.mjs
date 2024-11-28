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
const NEW_LOCALE = 'en-US';
const NAME = 'Alex Gusev';
const NEW_PASS_PHRASE = 'new password';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_Gpt_User_Back_Mod_User} */
const modUserPlugin = await container.get('Fl64_Gpt_User_Back_Mod_User$');
/** @type {Fl64_Gpt_User_Back_Mod_Token} */
const modToken = await container.get('Fl64_Gpt_User_Back_Mod_Token$');
/** @type {Fl64_Gpt_User_Back_Web_Api_Update_Init} */
let serviceInit = await container.get('Fl64_Gpt_User_Back_Web_Api_Update_Init$');
/** @type {Fl64_Gpt_User_Back_Web_Api_Update_Load} */
let serviceLoad = await container.get('Fl64_Gpt_User_Back_Web_Api_Update_Load$');
/** @type {Fl64_Gpt_User_Back_Web_Api_Update_Save} */
let serviceSave = await container.get('Fl64_Gpt_User_Back_Web_Api_Update_Save$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Init} */
let endpointInit = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Init$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Load} */
let endpointLoad = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Load$');
/** @type {Fl64_Gpt_User_Shared_Web_Api_Update_Save} */
let endpointSave = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Save$');
const RES_INIT = endpointInit.getResultCodes();
const RES_LOAD = endpointLoad.getResultCodes();
const RES_SAVE = endpointSave.getResultCodes();

/** @type {TeqFw_Email_Back_Act_Send} */
const actSend = await container.get('TeqFw_Email_Back_Act_Send$');

let USER_ID, TOKEN_CODE;

describe('030: User Profile Update', () => {
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
        const dto = modUserPlugin.composeEntity();
        dto.email = EMAIL;
        dto.locale = LOCALE;
        dto.passHash = 'hash';
        dto.passSalt = 'salt';
        dto.name = NAME;
        dto.status = 'ACTIVE';
        const createdUser = await modUserPlugin.create({dto});
        USER_ID = createdUser.userRef;
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should initialize the profile update process and send an email', async () => {
        const req = endpointInit.createReq();
        req.email = EMAIL;
        const res = endpointInit.createRes();

        // Mock email sending action
        const sendEmailStub = actSend.act;
        actSend.act = async ({to}) => {
            assert.strictEqual(to, EMAIL, 'Email recipient should match');
            return {success: true};
        };

        await serviceInit.process(req, res, context);

        assert.strictEqual(res.resultCode, RES_INIT.SUCCESS, 'Profile update initiation should succeed');
        const tokens = await modToken.list({});
        const [token] = tokens;
        assert.ok(token, 'Profile update token should exist');
        assert.strictEqual(token.userRef, USER_ID, 'Token should belong to the correct user');
        TOKEN_CODE = token.code;

        // Restore original email sending method
        actSend.act = sendEmailStub;
    });

    it('should load user profile data with a valid token', async () => {
        const req = endpointLoad.createReq();
        req.token = TOKEN_CODE;
        const res = endpointLoad.createRes();

        await serviceLoad.process(req, res, null);

        assert.strictEqual(res.resultCode, RES_LOAD.SUCCESS, 'Profile data loading should succeed');
        assert.strictEqual(res.email, EMAIL, 'Loaded email should match the user data');
        assert.strictEqual(res.locale, LOCALE, 'Loaded locale should match the user data');
    });

    it('should update user profile with a valid token', async () => {
        const req = endpointSave.createReq();
        req.token = TOKEN_CODE;
        req.locale = NEW_LOCALE;
        req.passphrase = NEW_PASS_PHRASE;
        const res = endpointSave.createRes();

        await serviceSave.process(req, res, null);

        assert.strictEqual(res.resultCode, RES_SAVE.SUCCESS, 'Profile update should succeed');

        const updatedUser = await modUserPlugin.read({userRef: USER_ID});
        assert.strictEqual(updatedUser.locale, NEW_LOCALE, 'Updated locale should match the new value');
        assert.ok(
            modUserPlugin.hashPassPhrase({
                passPhrase: NEW_PASS_PHRASE,
                salt: updatedUser.passSalt,
            }) === updatedUser.passHash,
            'Updated passphrase should match the hashed value'
        );

        const token = await modToken.read({code: TOKEN_CODE});
        assert.strictEqual(token, null, 'Token should be deleted after successful profile update');
    });
});
