import runStaging from "./stager.js";
import runCommit from "./commit.js";
import runPush from "./push.js"
import runRegister from "./register.js"
import runLogin from "./login.js"

const args = process.argv.splice(2);
if (args[0] === "stage") runStaging(args[1]);

else if (args[0] === "commit" && args.length === 2) runCommit(args[1]);

else if (args[0] === "push" && args.length === 1) runPush();

else if (args[0] === "register" && args.length === 1) runRegister();

else if (args[0] === "login" && args.length === 1) runLogin();

else {
    console.log("Not a valid cmd: tig", args.join(' '))
}


