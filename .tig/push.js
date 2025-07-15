import { serializeToIndex, deserializeFromIndex } from './helper.js';

function runPush() {
    const storeObject = deserializeFromIndex();
    storeObject.pushed = storeObject.commited;
    storeObject.commited = [];
    serializeToIndex(storeObject)
}

export default runPush;