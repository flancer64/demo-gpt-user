import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {GptUser_Back_Store_RDb_Schema_User} */
const rdbDto = await container.get('GptUser_Back_Store_RDb_Schema_User$');

describe('GptUser_Back_Store_RDb_Schema_User', () => {
    const ATTR = rdbDto.getAttributes();
    const expectedProperties = ['id', 'name'];

    it('should create an RDB DTO with only the expected properties', () => {
        const dto = rdbDto.createDto();
        const dtoKeys = Object.keys(dto).sort();

        // Verify that the DTO has only the expected properties
        assert.deepStrictEqual(dtoKeys, expectedProperties.sort(), 'DTO should contain only the expected properties');

        // Check that each property is initially undefined
        expectedProperties.forEach(prop => {
            assert.strictEqual(dto[prop], undefined, `Property ${prop} should initially be undefined`);
        });
    });

    it('ATTR should contain only the expected properties', () => {
        const attrKeys = Object.keys(ATTR).sort();
        const upperCaseExpectedProperties = expectedProperties.map(p => p.toUpperCase()).sort();

        // Check that ATTR has the expected properties in uppercase
        assert.deepStrictEqual(attrKeys, upperCaseExpectedProperties, 'ATTR should contain only the expected properties in uppercase format');

        // Verify that each uppercase property in ATTR maps correctly to its original property name
        expectedProperties.forEach(prop => {
            assert.strictEqual(ATTR[prop.toUpperCase()], prop, `ATTR.${prop.toUpperCase()} should map to ${prop}`);
        });
    });

    it('should have the correct ENTITY name and primary key', () => {
        assert.equal(rdbDto.getEntityName(), '/user', 'Entity name should match the expected path');
        assert.deepStrictEqual(rdbDto.getPrimaryKey(), [ATTR.ID], 'Primary key should be set to ID');
    });
});
