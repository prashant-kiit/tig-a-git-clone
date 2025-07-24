import runStaging from "./stager.js";
import runCommit from "./commit.js";
import runPush from "./push.js"
import runRegister from "./register.js"
import runLogin from "./login.js"
import runLogout from "./logout.js"
import runAddRepo from "./addRepo.js"
import runConfig from "./config.js"

const args = process.argv.splice(2);
if (args[0] === "stage") runStaging(args[1]);

else if (args[0] === "commit" && args.length === 2) runCommit(args[1]);

else if (args[0] === "push" && args.length === 1) runPush();

else if (args[0] === "register" && args.length === 1) runRegister();

else if (args[0] === "login" && args.length === 1) runLogin();

else if (args[0] === "logout" && args.length === 1) runLogout();

else if (args[0] === "add-repo" && args.length === 2) runAddRepo(args[1]);

else if (args[0] === "config" && args.length === 1) runConfig();

else {
    console.log("Not a valid cmd: tig", args.join(' '))
}


