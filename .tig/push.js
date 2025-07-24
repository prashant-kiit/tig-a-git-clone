import { serializeToIndex, deserializeFromIndex, retrieveRepo, callServer } from './helper.js';

async function runPush() {
    try {
        const storeObject = deserializeFromIndex();
        storeObject.pushed = storeObject.committed;

        const repo = await retrieveRepo();
        const body = {
            pushed: storeObject.pushed,
            repo
        }

        await callServer("POST", "/push", body)

        serializeToIndex(storeObject)
    } catch (error) {
        console.error(error.message);
    }
}

export default runPush;