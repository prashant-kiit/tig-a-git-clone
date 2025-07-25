import { retrieveRefreshToken, retrieveRepo, retrieveToken } from "./helper.js";

async function runConfig() {
    const token = await retrieveToken();
    const repo  = await retrieveRepo();
    const refreshToken = await retrieveRefreshToken();
    const config = {
        token,
        refreshToken,
        repo,
    };
    console.log(config);
}

export default runConfig;