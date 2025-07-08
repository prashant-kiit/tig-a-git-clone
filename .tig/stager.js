import { createHash } from 'crypto';
import { resolve } from 'path';

function runStaging(relativePath) {
    const baseDir = process.cwd();
    const fullFilePath = resolve(baseDir, relativePath);
    const hashedFilePath = createHash('MD5').update(fullFilePath).digest('hex');
    console.log(fullFilePath);
    console.log(hashedFilePath);
}

const args = process.argv.splice(2);
if (args[0] === "stage") runStaging(args[1]);

