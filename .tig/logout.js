import { callServer, storeRefreshToken, storeToken, retrieveToken, retrieveRefreshToken } from "./helper.js";

async function runLogout() {
    try {
        if (await retrieveToken() === "-" || await retrieveRefreshToken() === "-") {
            console.log("Not Logged In");
            return;
        }
        await callServer("POST", "/logout",)
        storeToken("-");
        storeRefreshToken("-");
    } catch (error) {
        console.error(error.message);
    }

}

export default runLogout;