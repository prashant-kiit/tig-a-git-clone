import runStaging from "./stager.js";
import runCommit from "./commit.js";
import runPush from "./push.js"
import runRegister from "./register.js"

const args = process.argv.splice(2);
if (args[0] === "stage") runStaging(args[1]);

else if (args[0] === "commit") runCommit(args[1]);

else if (args[0] === "push") runPush();

else if (args[0] === "register") runRegister(args[1]);

else {
    console.log("Not a valid cmd:", args[0])
}


