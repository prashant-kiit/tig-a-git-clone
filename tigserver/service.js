import db from './tigstore.js';
import { collection, getDocs, updateDoc, addDoc, query, where } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import CustomError from './customError.js';

export async function loginService(user) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('emailId', '==', user.emailId), where('password', '==', user.password));
    const snapshot = await getDocs(q);
    if (snapshot.empty || snapshot.docs.length === 0) {
        throw new CustomError("AUTHENCIATION_ERROR", 401, 'User cannot be authenticated.')
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

export async function repoService(repo, user) {
    const reposRef = collection(db, 'repos');
    const q = query(reposRef, where('name', '==', repo.name));
    const snapshot = await getDocs(q);
    if (!(snapshot.empty || snapshot.docs.length === 0)) {
        throw new CustomError("DUPLICATION_ERROR", 409, 'Repo already exists.')
    }
    const repoPayload = { name: repo.name, owner: user.emailId }
    const repoRef = await addDoc(reposRef, repoPayload);

    return {
        name: repo.name,
        repoId: repoRef.id
    };
}