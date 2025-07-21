import { retrieveRepo, retrieveToken } from "./helper.js";

async function runConfig() {
    const token = await retrieveToken();
    const repo  = JSON.parse(await retrieveRepo());
    const config = {
        token,
        repo,
    };
    console.log(config);
}

export default runConfig;