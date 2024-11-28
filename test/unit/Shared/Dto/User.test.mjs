import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECT FROM CONTAINER
/** @type {GptUser_Shared_Dto_User} */
const domDto = await container.get('GptUser_Shared_Dto_User$');

describe('GptUser_Shared_Dto_User', () => {
    const expectedProperties = ['id', 'name'];

    it('should create a Domain DTO with only the expected properties', () => {
        const dto = domDto.createDto();
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
