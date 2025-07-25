import { callServer, storeRefreshToken, storeToken, retrieveToken, retrieveRefreshToken, storeUserId } from "./helper.js";

async function runLogout() {
    try {
        if (await retrieveToken() === "-" || await retrieveRefreshToken() === "-") {
            console.log("Not Logged In");
            return;
        }
        const response = await callServer("POST", "/logout")
        storeUserId("-");
        storeToken("-");
        storeRefreshToken("-");
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }

}

export default runLogout;