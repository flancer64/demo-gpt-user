import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
container.setDebug(false);
/**
 * Request the extended endpoint from the container.
 * @type {GptUser_Shared_Di_Proxy_Update_Load}
 */
const proxyEndpoint = await container.get('Fl64_Gpt_User_Shared_Web_Api_Update_Load$');

describe('GptUser_Shared_Di_Proxy_Update_Load', () => {
    // Expected properties for the Response DTO (including the added "name" property)
    const expectedResponseProperties = [
        'dateCreated',
        'email',
        'locale',
        'pin',
        'resultCode',
        'status',
        'name',
    ];

    it('should create a Response DTO with the extended properties', () => {
        const resDto = proxyEndpoint.createRes();
        const resDtoKeys = Object.keys(resDto).sort();

        assert.deepStrictEqual(
            resDtoKeys,
            expectedResponseProperties.sort(),
            'Response DTO should contain both base and extended properties'
        );

        expectedResponseProperties.forEach(prop =>
            assert.strictEqual(
                resDto[prop],
                undefined,
                `Property "${prop}" in Response DTO should initially be undefined`
            )
        );
    });

    it('should correctly handle the "name" property in Response DTO', () => {
        const testName = 'Jane Doe';
        const resDto = proxyEndpoint.createRes({name: testName});

        assert.strictEqual(
            resDto.name,
            testName,
            `Property "name" in Response DTO should match the input value: "${testName}"`
        );
    });

    it('should delegate createReq to the base method', () => {
        const reqDto = proxyEndpoint.createReq();
        assert.ok(reqDto, 'Request DTO should be created successfully');
    });

    it('should delegate getResultCodes to the base method', async () => {
        const resultCodes = proxyEndpoint.getResultCodes();
        assert.ok(resultCodes, 'ResultCodes should be retrieved successfully');
    });
});
