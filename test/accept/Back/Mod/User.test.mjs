import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from '../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {GptUser_Back_Mod_User} */
const modUser = await container.get('GptUser_Back_Mod_User$');

let USER_ID;

const NAME = 'John Doe';
const NAME_UPDATED = 'Jane Doe';

// Test Suite for User Model
describe('GptUser_Back_Mod_User', () => {

    before(async function () {
        this.timeout(60000);
        await dbReset(container);
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should successfully compose entity and item', async () => {
        const entity = modUser.composeEntity();
        const item = modUser.composeItem();
        // Check if entity is correctly composed
        assert.ok(entity, 'Entity should be composed successfully');
        assert.strictEqual(typeof entity, 'object', 'Composed entity should be of type object');
        assert.ok(item, 'Item should be composed successfully');
        assert.strictEqual(typeof item, 'object', 'Composed item should be of type object');
    });

    it('should successfully create a new user entry', async () => {
        // Creating a new user entry
        const dto = modUser.composeEntity();
        dto.name = NAME;

        const newUser = await modUser.create({dto});
        USER_ID = newUser.id;

        // Check if the user entry was created
        assert.ok(newUser, 'User entry should exist');
        assert.strictEqual(newUser.name, NAME, 'User name should match');
    });

    it('should read an existing user entry by user ID', async () => {
        // Reading the created user entry
        const foundUser = await modUser.read({id: USER_ID});

        // Check if the user entry was read correctly
        assert.strictEqual(foundUser.id, USER_ID, 'User ID should match');
        assert.strictEqual(foundUser.name, NAME, 'User name should match');
    });

    it('should update an existing user entry', async () => {
        // Updating the created user entry
        const dto = await modUser.read({id: USER_ID});
        dto.name = NAME_UPDATED;
        const updated = await modUser.update({dto});

        // Verify the update
        assert.strictEqual(updated.name, NAME_UPDATED, 'User name should be updated');
    });

    it('should delete an existing user entry by user ID', async () => {
        // Deleting the created user entry
        const dto = await modUser.read({id: USER_ID});
        assert.ok(dto, 'User entry should exist before deletion');
        const total = await modUser.delete({dto});
        assert.strictEqual(total, 1, 'One user entry should be deleted');

        // Attempt to read deleted entry
        const removedUser = await modUser.read({id: USER_ID});
        assert.strictEqual(removedUser, null, 'User entry should be deleted');
    });
});
