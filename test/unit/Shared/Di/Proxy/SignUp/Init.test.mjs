import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
container.setDebug(true);
/**
 * Request the original ID from the container.
 * @type {GptUser_Shared_Di_Proxy_SignUp_Init}
 */
const proxyEndpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_SignUp_Init$');

describe('GptUser_Shared_Di_Proxy_SignUp_Init', () => {
    // Expected properties for the Request DTO (including the added "name" property)
    const expectedRequestProperties = [
        'email',
        'isConsent',
        'locale',
        'passPhrase',
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

    it('should delegate getResultCodes to the base method', async () => {
        const resultCodes = proxyEndpoint.getResultCodes();
        assert.ok(resultCodes, 'ResultCodes should be retrieved successfully');
    });
});
