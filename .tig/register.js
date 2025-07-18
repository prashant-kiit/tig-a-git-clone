import db from './tigstore.js';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import promptSync from 'prompt-sync';
import { z } from 'zod';

const prompt = promptSync({ sigint: true });

const MAX = 3;

const emailSchema = z.email();

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password too long')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one digit')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character');

const schema = {
    emailId: emailSchema,
    password: passwordSchema
}

function readInput(inputType) {
    let input = "";
    let count = 0;
    while (count < MAX) {
        input = prompt(`Enter your ${inputType}: `);
        const result = schema[inputType].safeParse(input);
        if (result.success) {
            return input;
        }
        if (count === MAX - 1) {
            console.log(`Error: Invalid ${inputType} format`);
            process.exit(0);
        }
        console.log(`Error: Invalid ${inputType} format. Please try again.`);
        count++;
    }
}

async function addUser(user) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('emailId', '==', user.emailId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log('User ID already exists. Please choose a unique emailId.');
            process.exit(1);
        }

        const docRef = await addDoc(usersRef, user);
        console.log('User added with ID:', docRef.id);
        process.exit(0);
    } catch (err) {
        console.error('Error adding user:', err);
        process.exit(1);
    }
}

// email Id and password validation
function runRegister() {
    const emailId = readInput("emailId")
    const password = readInput("password")

    const user = {
        emailId,
        password,
        isLoggedIn: false
    }

    addUser(user);
}

export default runRegister;