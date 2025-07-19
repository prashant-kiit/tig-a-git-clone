import promptSync from 'prompt-sync';
import db from './tigstore.js';
import { collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { hashPassword, storeToken } from './helper.js';
import axios from 'axios';

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

async function login(user) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('emailId', '==', user.emailId), where('password', '==', user.password));
        const snapshot = await getDocs(q);
        if (snapshot.empty || snapshot.docs.length === 0) {
            throw new Error('User does not exist.')
        }
        await updateDoc(snapshot.docs[0].ref, user);
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

async function loginAPI(user) {
    try {
        const response = await axios.post('http://localhost:3000/login', user);
        console.log('Response:', response.data);
        return response.data.body.token;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

async function runLogin() {
    const emailId = await readInput(InputType.EMAILID);
    const password = hashPassword(await readInput(InputType.PASSWORD));
    const user = {
        emailId,
        password,
        isLoggedIn: true
    }
    // login(user);
    const token = await loginAPI(user);
    storeToken(token);
}

export default runLogin;