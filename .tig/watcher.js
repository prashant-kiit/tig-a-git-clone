import { exec } from 'child_process';
import { writeFileSync, readFileSync, renameSync } from 'fs';
import { join, dirname } from 'path';
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

function separateAllFilePaths(stdout) {
  const filePaths = stdout.trim().split('\n');
  return filePaths;
}

function storeHashedFiles(hashedFiles) {
  // console.log(hashedFiles);
  const storeFileContent = readFileSync('./store.json', 'utf8');
  const storeObject = JSON.parse(storeFileContent);
  console.log(storeObject);
  storeObject.watched = hashedFiles
  const newStoreFileContent = JSON.stringify(storeObject);
  const storeFileRelativePath = "./store.json"

  const tigDirectory = dirname(storeFileRelativePath);
  const storeTempPath = join(tigDirectory, `store.tmp-${randomUUID()}`);
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
    const filePaths = separateAllFilePaths(stdout);
    const hashedFiles = hashFiles(filePaths);
    storeHashedFiles(hashedFiles);
  });
}

listFilesUnderWatch();
// verfiy if it the same folder as earlier to prevent iisues caused during copy paste of tig folder from one repo to another.
// add tigignore
// implement caching

