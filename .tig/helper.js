import { writeFileSync, readFileSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID, createHash } from 'crypto';

const storeFileRelativePath = "./index.json"

export function serializeToIndex(storeObject) {
    const newStoreFileContent = JSON.stringify(storeObject);
    const tigDirectory = dirname(storeFileRelativePath);
    const storeTempPath = join(tigDirectory, `index.tmp-${randomUUID()}`);
    writeFileSync(storeTempPath, newStoreFileContent, 'utf8');
    renameSync(storeTempPath, storeFileRelativePath)
}

export function deserializeFromIndex() {
    const storeFileContent = readFileSync(storeFileRelativePath, 'utf8');
    const storeObject = JSON.parse(storeFileContent);
    return storeObject;
}

export function hashFilePath(filePath) {
    return createHash('MD5').update(filePath).digest('hex');
}

export function hashFileContent(fileContent) {
    return createHash('sha256').update(fileContent).digest('hex');
}