import db from './tigstore.js';
import { collection, doc, getDocs, updateDoc, addDoc, query, where, arrayUnion } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import CustomError from './customError.js';

export async function loginService(user) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('emailId', '==', user.emailId), where('password', '==', user.password));
    const snapshot = await getDocs(q);
    if (snapshot.empty || snapshot.docs.length === 0) {
        throw new CustomError("AUTHENCIATION_ERROR", 401, 'User cannot be authenticated.')
    }
    user.isLoggedIn = true;
    await updateDoc(snapshot.docs[0].ref, user);

    const token = jwt.sign({ emailId: user.emailId }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    const refreshToken = jwt.sign({ emailId: user.emailId }, process.env.JWT_SECRET, {
        expiresIn: '800h'
    });

    return {
        emailId: user.emailId,
        token: token,
        refreshToken: refreshToken
    }
}

export async function repoService(repo, user) {
    const reposRef = collection(db, 'repos');
    const q = query(reposRef, where('name', '==', repo.name));
    const snapshot = await getDocs(q);
    if (!(snapshot.empty || snapshot.docs.length === 0)) {
        throw new CustomError("DUPLICATION_ERROR", 409, 'Repo already exists.')
    }
    const repoPayload = { name: repo.name, owner: user.emailId, commits: [] }
    const repoRef = await addDoc(reposRef, repoPayload);

    return {
        name: repo.name,
        repoId: repoRef.id
    };
}

export async function pushService(user, repo, pushed) {
    const reposRef = collection(db, 'repos');
    const q = query(reposRef, where('name', '==', repo.name), where('owner', '==', user.emailId));
    const snapshot = await getDocs(q);
    if (snapshot.empty || snapshot.docs.length === 0) {
        throw new CustomError("NOT_FOUND", 409, 'Repo for given user not found.')
    }
    const repoDoc = snapshot.docs[0]; 
    const repoDocData = repoDoc.data();
    const oldCommitsCount = repoDocData.commits.length;
    const repoRef = doc(db, 'repos', repoDoc.id);
    await updateDoc(repoRef, {
      commits: arrayUnion(...pushed)
    });

    return {
        name: repo.name,
        repoId: repoRef.id,
        commitsCount: pushed.length - oldCommitsCount
    };
}

export async function logoutService(user) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('emailId', '==', user.emailId));
    const snapshot = await getDocs(q);
    if (snapshot.empty || snapshot.docs.length === 0) {
        throw new CustomError("NOT_FOUND", 401, 'User cannot be found.')
    }
    await updateDoc(snapshot.docs[0].ref, {
        isLoggedIn: false
    });

    return {
        emailId: user.emailId,
    }
}

export async function refreshService(refreshToken) {
    const user = jwt.verify(refreshToken, process.env.JWT_SECRET + "--");

    const newToken = jwt.sign({ emailId: user.emailId }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    const newRefreshToken = jwt.sign({ emailId: user.emailId }, process.env.JWT_SECRET, {
        expiresIn: '800h'
    });

    console.log("Refresh", newToken, newRefreshToken)

    return {
        emailId: user.emailId,
        token: newToken,
        refreshToken: newRefreshToken
    }
}

export async function forcedLogoutService(userId) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('emailId', '==', userId));
    const snapshot = await getDocs(q);
    if (snapshot.empty || snapshot.docs.length === 0) {
        throw new CustomError("AUTHENCIATION_ERROR", 401, 'User cannot be authenticated.')
    }
    await updateDoc(snapshot.docs[0].ref, {
        isLoggedIn: false
    });

    return {
        emailId: userId,
    }
}