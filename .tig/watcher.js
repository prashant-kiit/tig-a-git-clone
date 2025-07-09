import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { deserializeFromIndex, serializeToIndex, hashFilePath, hashFileContent } from './helper.js'

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

function hashFiles(filePaths) {
  let hashedFiles = {};
  for (const filePath of filePaths) {
    const fileContent = readFileSync(filePath, 'utf8');
    const hashedFilePath = hashFilePath(filePath);
    const hashedContent = hashFileContent(fileContent);
    hashedFiles[hashedFilePath] = hashedContent;
  }
  return hashedFiles;
}

function storeHashedFiles(hashedFiles) {
  // deserialize
  const storeObject = deserializeFromIndex();
  
  for (const key in hashedFiles) {
    if(storeObject.staged[key] === hashedFiles[key])
      delete hashedFiles[key]
  }

  storeObject.watched = hashedFiles;

  // serialize
  serializeToIndex(storeObject);

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

