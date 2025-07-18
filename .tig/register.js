import db from './tigstore.js';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import promptSync from 'prompt-sync';
import { z } from 'zod';
import { hashPassword } from './helper.js';

const prompt = promptSync({ sigint: true });

const InputType = {
    EMAILID: "emailId",
    PASSWORD: "password"
}

const emailSchema = z.email();

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password too long')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one digit')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character');

class Validator {
    constructor(inputType) {
        switch (inputType) {
            case InputType.EMAILID:
                this.validator = new EmailValidator();
                break;

            case InputType.PASSWORD:
                this.validator = new PasswordValidator();
                break;
        }
    }

    get() {
        return this.validator;
    }
}

class EmailValidator {
    constructor() {
    }

    async validate(input) {
        this.input = input;
        this.checkIsDataFormatValid();
        await this.checkIsUnique();
        return true;
    }

    checkIsDataFormatValid() {
        const result = emailSchema.safeParse(this.input);
        if (!result.success) {
            throw new Error("Error: Email Format Invalid.")
        }
        return this;
    }

    async checkIsUnique() {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('emailId', '==', this.input));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            throw new Error('User ID already exists. Please choose a unique emailId.')
        }
        return this;
    }
}

class PasswordValidator {
    constructor() {
    }

    validate(input) {
        this.input = input;
        this.checkIsDataFormatValid();
        return true;
    }

    checkIsDataFormatValid() {
        const result = passwordSchema.safeParse(this.input);
        if (!result.success) {
            throw new Error("Error: Password Format Invalid.")
        }
        return this;
    }
}

async function readInput(inputType) {
    let input = "";
    const validator = new Validator(inputType).get();
    while (true) {
        try {
            input = prompt(`Enter your ${inputType}: `);
            const isValid = await validator.validate(input);
            if (isValid) {
                return input;
            }
        } catch (error) {
            console.error(error.message);
            console.log("Please try again.");
            continue;
        }
    }
}

async function addUser(user) {
    try {
        const usersRef = collection(db, 'users');
        const docRef = await addDoc(usersRef, user);
        console.log('User added with ID:', docRef.id);
        process.exit(0);
    } catch (err) {
        console.error('Error adding user:', err);
        process.exit(1);
    }
}

// email Id and password validation
async function runRegister() {
    const emailId = await readInput(InputType.EMAILID);
    const password = hashPassword(await readInput(InputType.PASSWORD));

    const user = {
        emailId,
        password,
        isLoggedIn: false
    }

    addUser(user);
}

export default runRegister;