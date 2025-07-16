import db from './tigstore.js';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import promptSync from 'prompt-sync';

const prompt = promptSync({ sigint: true });

async function addUser(user) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('userId', '==', user.userId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            console.log('User ID already exists. Please choose a unique userId.');
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

function runRegister(userId) {
    const password = prompt('Enter your password: ');

    const user = {
        userId,
        password,
        isLoggedIn: false
    }

    addUser(user);
}

export default runRegister;