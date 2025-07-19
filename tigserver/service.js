import db from './tigstore.js';
import { collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import jwt from 'jsonwebtoken';

export async function loginService(user) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('emailId', '==', user.emailId), where('password', '==', user.password));
    const snapshot = await getDocs(q);
    if (snapshot.empty || snapshot.docs.length === 0) {
        throw new Error('User cannot be authenticated.')
    }
    await updateDoc(snapshot.docs[0].ref, user);

    const token = jwt.sign({ emailId: user.emailId }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return {
        emailId: user.emailId,
        token: token
    }
}