import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {GptUser_Shared_Dto_User} */
const domDto = await container.get('GptUser_Shared_Dto_User$');
/** @type {GptUser_Back_Store_RDb_Schema_User} */
const rdbDto = await container.get('GptUser_Back_Store_RDb_Schema_User$');
/** @type {GptUser_Back_Convert_User} */
const converter = await container.get('GptUser_Back_Convert_User$');

describe('GptUser_Back_Convert_User', () => {
    const sampleRdbDto = rdbDto.createDto({
        id: 42,
        name: 'Jane Doe'
    });

    const sampleDomDto = domDto.createDto({
        id: 42,
        name: 'Jane Doe'
    });

    it('should convert RDB DTO to Domain DTO correctly', () => {
        const domDto = converter.db2dom({dbUser: sampleRdbDto});
        assert.deepStrictEqual(domDto, sampleDomDto, 'Converted Domain DTO should match the sample Domain DTO');
    });

    it('should convert Domain DTO to RDB DTO correctly', () => {
        const {dbUser: rdbDto} = converter.dom2db({user: sampleDomDto});
        assert.deepStrictEqual(rdbDto, sampleRdbDto, 'Converted RDB DTO should match the sample RDB DTO');
    });
});
