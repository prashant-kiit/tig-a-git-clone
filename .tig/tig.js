import runStaging from "./stager.js";
import runCommit from "./commit.js";

const args = process.argv.splice(2);
if (args[0] === "stage") runStaging(args[1]);

if (args[0] === "commit") runCommit(args[1]);

