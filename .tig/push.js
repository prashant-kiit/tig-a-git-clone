import { serializeToIndex, deserializeFromIndex } from './helper.js';

async function runPush() {
    const storeObject = deserializeFromIndex();
    storeObject.pushed = storeObject.committed;
    storeObject.committed = [];
    serializeToIndex(storeObject)

    await axios.post('http://localhost:3000/push', {
        committed: storeObject.committed   
    });
}

export default runPush;