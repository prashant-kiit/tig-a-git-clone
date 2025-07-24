import promptSync from 'prompt-sync';
import { hashPassword, storeToken, storeRefreshToken, callServer, retrieveToken, retrieveRefreshToken } from './helper.js';

const prompt = promptSync({ sigint: true });

const InputType = {
    EMAILID: "emailId",
    PASSWORD: "password"
}

async function readInput(inputType) {
    let input = "";
    while (true) {
        try {
            input = prompt(`Enter your ${inputType}: `);
            if (input === "")
                throw new Error("Empty string not allowed.")
            return input;
        } catch (error) {
            console.error(error.message);
            console.log("Please try again.");
            continue;
        }
    }
}

async function loginAPI(user) {
    try {
        // const response = await axios.post('http://localhost:3000/login', user);
        const response = await callServer("POST", "/login", user);
        return {
            token: response.data.body.token,
            refreshToken: response.data.body.refreshToken
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function runLogin() {
    try {
        if (await retrieveToken() !== "-" || await retrieveRefreshToken() !== "-") {
            console.log("Already Logged In");
            return;
        }

        const emailId = await readInput(InputType.EMAILID);
        const password = hashPassword(await readInput(InputType.PASSWORD));
        const user = {
            emailId,
            password,
        }

        const { token, refreshToken } = await loginAPI(user);
        if (token) {
            storeToken(token);
            storeRefreshToken(refreshToken);
        }
    } catch (error) {
        console.error(error.message);
    }
}

export default runLogin;