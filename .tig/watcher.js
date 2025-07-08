import { exec } from 'child_process';
import { writeFileSync, readFileSync, renameSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { createHash, randomUUID } from 'crypto';

function hashFiles(filePaths) {
  let hashedFiles = [];
  for (const filePath of filePaths) {
    const fileContent = readFileSync(filePath, 'utf8');
    const hashedFilePath = createHash('MD5').update(filePath).digest('hex');
    const hashedContent = createHash('sha256').update(fileContent).digest('hex');
    const hashedFile = hashedFilePath + "." + hashedContent;
    hashedFiles.push(hashedFile);
  }
  return hashedFiles;
}

function processAllFilePaths(stdout) {
  const filePaths = stdout.trim().split('\n');
  const baseDir = process.cwd();
  for (let i = 0; i < filePaths.length; i++) {
    const fullFilePath = resolve(baseDir, filePaths[i]);
    filePaths[i] = fullFilePath
  }
  console.log(filePaths);
  return filePaths;
}

function storeHashedFiles(hashedFiles) {
  const storeFileRelativePath = "./index.json"
  const storeFileContent = readFileSync(storeFileRelativePath, 'utf8');
  const storeObject = JSON.parse(storeFileContent);
  storeObject.watched = hashedFiles
  const newStoreFileContent = JSON.stringify(storeObject);

  const tigDirectory = dirname(storeFileRelativePath);
  const storeTempPath = join(tigDirectory, `index.tmp-${randomUUID()}`);
  writeFileSync(storeTempPath, newStoreFileContent, 'utf8');
  renameSync(storeTempPath, storeFileRelativePath);

}

function listFilesUnderWatch() {
  const cmd = "find .. \\( -path '../.git' -o -path '../.tig' \\) -prune -o -type f -print";

  exec(cmd, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error(`Error: ${error.message}`);
      return;
    }
    const filePaths = processAllFilePaths(stdout);
    const hashedFiles = hashFiles(filePaths);
    storeHashedFiles(hashedFiles);
  });
}

listFilesUnderWatch();
// verfiy if it the same folder as earlier to prevent iisues caused during copy paste of tig folder from one repo to another.
// add tigignore
// implement caching

