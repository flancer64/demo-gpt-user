import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
container.setDebug(false);
/**
 * Request the proxy ID from the container.
 * @type {GptUser_Shared_Di_Proxy_Update_Save}
 */
const proxyEndpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Save$');

describe('GptUser_Shared_Di_Proxy_Update_Save', () => {
    // Expected properties for the Request DTO (including the added "name" property)
    const expectedRequestProperties = [
        'locale',
        'passphrase',
        'token',
        'name',
    ];

    it('should create a Request DTO with the extended properties', () => {
        const reqDto = proxyEndpoint.createReq();
        const reqDtoKeys = Object.keys(reqDto).sort();

        assert.deepStrictEqual(
            reqDtoKeys,
            expectedRequestProperties.sort(),
            'Request DTO should contain both base and extended properties'
        );

        expectedRequestProperties.forEach(prop =>
            assert.strictEqual(
                reqDto[prop],
                undefined,
                `Property "${prop}" in Request DTO should initially be undefined`
            )
        );
    });

    it('should correctly handle the "name" property in Request DTO', () => {
        const testName = 'John Doe';
        const reqDto = proxyEndpoint.createReq({name: testName});

        assert.strictEqual(
            reqDto.name,
            testName,
            `Property "name" in Request DTO should match the input value: "${testName}"`
        );
    });

    it('should delegate createRes to the base method', () => {
        const resDto = proxyEndpoint.createRes();
        assert.ok(resDto, 'Response DTO should be created successfully');
    });

    it('should retrieve the available result codes from the base method', () => {
        const resultCodes = proxyEndpoint.getResultCodes();

        assert.ok(resultCodes, 'Result codes should be retrieved');
        assert.strictEqual(resultCodes.SUCCESS, 'SUCCESS', 'Result code "SUCCESS" should be defined');
    });
});
