import { deserializeFromIndex, serializeToIndex, encryptor } from './helper.js'

function getStagedChanges() {
    const storeObject = deserializeFromIndex();
    return storeObject.staged;
}

function shortenStagedChanges(stagedChanges) {
    const encrypted = encryptor.encrypt(stagedChanges);
    return encrypted;
}

function storeCommit(commit, message) {
    const storeObject = deserializeFromIndex();
    storeObject.committed.push({
        commit,
        message
    })

    storeObject.staged = {};

    serializeToIndex(storeObject);
}

function runCommit(message) {
    // get staged changes;
    const stagedChanges = getStagedChanges();

    // hash the staged changes
    const commit = shortenStagedChanges(stagedChanges);

    // store the commit in index
    storeCommit(commit, message);
}

export default runCommit;