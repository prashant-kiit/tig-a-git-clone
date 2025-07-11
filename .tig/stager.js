import { resolve } from 'path';
import { existsSync } from 'fs';
import { serializeToIndex, deserializeFromIndex, hashFilePath } from './helper.js';

function processFiles(relativePath) {
    process.cwd();
    process.chdir('..');
    const baseDir = process.cwd();
    const fullFilePath = resolve(baseDir, relativePath);

    if (!existsSync(fullFilePath)) {
        throw new Error('File does not exist');
    }

    return fullFilePath;
}

function hashFile(fullFilePath) {
    const hashedFilePath = hashFilePath(fullFilePath)
    return hashedFilePath;
}

function storeHashedFile(hashedFilePath) {
    process.chdir('./.tig');
    // deserialize
    const storeObject = deserializeFromIndex();

    if(storeObject.watched[hashedFilePath]) {
        storeObject.staged[hashedFilePath] = storeObject.watched[hashedFilePath];
        delete storeObject.watched[hashedFilePath];

        // serialize
        serializeToIndex(storeObject)
    }
}

function runStaging(relativePath) {
    const fullFilePath = processFiles(relativePath);
    const hashedFilePath = hashFile(fullFilePath);
    storeHashedFile(hashedFilePath);
}

export default runStaging;

