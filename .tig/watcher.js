import { exec } from 'child_process';

function separateAllFilePaths(stdout) {
  const filePaths = stdout.trim().split('\n');
  console.log(filePaths); 
}

function listFilesUnderWatch() {
  const cmd = 'find .. -path \'../.git\' -prune -o -type f -print';

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    separateAllFilePaths(stdout);
  });
}

listFilesUnderWatch();
// verfiy if it the same folder as earlier to prevent iisues caused during copy paste of tig folder from one repo to another.

