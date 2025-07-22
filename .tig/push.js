import { serializeToIndex, deserializeFromIndex, retrieveToken, retrieveRepo } from './helper.js';
import axios from 'axios';

async function runPush() {
    const storeObject = deserializeFromIndex();
    storeObject.pushed = storeObject.committed;

    const repo = await retrieveRepo();
    const body = {
        pushed: storeObject.pushed,
        repo
    }
    const token = await retrieveToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    }
    const response = await axios.post('http://localhost:3000/push', body, {
        headers
    });
    console.log(response.data);

    serializeToIndex(storeObject)
}

export default runPush;