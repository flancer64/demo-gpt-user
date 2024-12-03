import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {GptUser_Back_Plugin_Dto_Config_Local} */
const pluginConfigDto = await container.get('GptUser_Back_Plugin_Dto_Config_Local$');

describe('GptUser_Back_Plugin_Dto_Config_Local', () => {
    const expectedProperties = [
        'emailSupport',
    ];

    it('should create a Local Configuration DTO with only the expected properties', () => {
        const dto = new pluginConfigDto.createDto();
        const dtoKeys = Object.keys(dto).sort();

        assert.deepStrictEqual(
            dtoKeys,
            expectedProperties.sort(),
            'DTO should contain only the expected properties'
        );

        expectedProperties.forEach(prop =>
            assert.strictEqual(
                dto[prop],
                undefined,
                `Property "${prop}" should initially be undefined`
            )
        );
    });
});
