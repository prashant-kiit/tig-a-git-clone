import { createHash, randomUUID } from 'crypto';
import { resolve, dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync, renameSync } from 'fs';

function runStaging(relativePath) {
    const hashedFilePath = hashFile(relativePath);
    storeHashedFile(hashedFilePath);
}

function hashFile(relativePath) {
    process.cwd();
    process.chdir('..');
    const baseDir = process.cwd();
    const fullFilePath = resolve(baseDir, relativePath);

    if (!existsSync(fullFilePath)) {
        throw new Error('File does not exist');
    }

    const hashedFilePath = createHash('MD5').update(fullFilePath).digest('hex');

    return hashedFilePath;
}

function storeHashedFile(hashedFilePath) {
    process.chdir('./.tig');
    const storeFileRelativePath = "./index.json"
    const storeFileContent = readFileSync(storeFileRelativePath, 'utf8');
    const storeObject = JSON.parse(storeFileContent);

    if(storeObject.watched[hashedFilePath]) {
        storeObject.staged[hashedFilePath] = storeObject.watched[hashedFilePath];
        delete storeObject.watched[hashedFilePath];
        const newStoreFileContent = JSON.stringify(storeObject);
        const tigDirectory = dirname(storeFileRelativePath);
        const storeTempPath = join(tigDirectory, `index.tmp-${randomUUID()}`);
        writeFileSync(storeTempPath, newStoreFileContent, 'utf8');
        renameSync(storeTempPath, storeFileRelativePath)
    }
}

const args = process.argv.splice(2);
if (args[0] === "stage") runStaging(args[1]);

