import { writeFileSync, readFileSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID, createHash, createCipheriv, createDecipheriv } from 'crypto';
import keytar from 'keytar';
import api from './api.js';

const storeFileRelativePath = "./index.json"

export function serializeToIndex(storeObject) {
    const newStoreFileContent = JSON.stringify(storeObject);
    const tigDirectory = dirname(storeFileRelativePath);
    const storeTempPath = join(tigDirectory, `index.tmp-${randomUUID()}`);
    writeFileSync(storeTempPath, newStoreFileContent, 'utf8');
    renameSync(storeTempPath, storeFileRelativePath)
}

export function deserializeFromIndex() {
    const storeFileContent = readFileSync(storeFileRelativePath, 'utf8');
    const storeObject = JSON.parse(storeFileContent);
    return storeObject;
}

export function hashFilePath(filePath) {
    return createHash('MD5').update(filePath).digest('hex');
}

export function hashFileContent(fileContent) {
    return createHash('sha256').update(fileContent).digest('hex');
}

class Encryptor {
    constructor(secretKey) {
        // Ensure 32-byte key for AES-256
        this.key = createHash('sha256').update(secretKey).digest();
    }

    // Generate fixed IV from JSON string (16 bytes)
    _getIV(obj) {
        return createHash('md5').update(JSON.stringify(obj)).digest(); // 16 bytes
    }

    encrypt(obj) {
        const iv = this._getIV(obj);
        const cipher = createCipheriv('aes-256-cbc', this.key, iv);

        let encrypted = cipher.update(JSON.stringify(obj), 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return encrypted;
    }

    decrypt(encrypted, objForIV) {
        const iv = this._getIV(objForIV);
        const decipher = createDecipheriv('aes-256-cbc', this.key, iv);

        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    }
}

export const encryptor = new Encryptor('your-secret-password');

export function hashPassword(password) {
    return createHash('MD5').update(password).digest('hex');
}

const SERVICE = 'tig-app';
const ACTIVEUSERTOKEN = 'ACTIVE-USER-TOKEN'
const ACTIVEUSERREFRESHTOKEN = 'ACTIVE-USER-REFRESH-TOKEN'
const ACTIVEUSERID = 'ACTIVE-USERID'
const ACTIVEREMOTEREPO = 'ACTIVE-REMOTE-REPO'

export async function storeToken(token) {
    await keytar.setPassword(SERVICE, ACTIVEUSERTOKEN, token);
}

export async function retrieveToken() {
    const token = await keytar.getPassword(SERVICE, ACTIVEUSERTOKEN);
    return token;
}

export async function storeRepo(repo) {
    await keytar.setPassword(SERVICE, ACTIVEREMOTEREPO, JSON.stringify(repo));
}

export async function retrieveRepo() {
    const repo = JSON.parse(await keytar.getPassword(SERVICE, ACTIVEREMOTEREPO));
    return repo;
}

export async function storeRefreshToken(refreshToken) {
    await keytar.setPassword(SERVICE, ACTIVEUSERREFRESHTOKEN, refreshToken);
}

export async function retrieveRefreshToken() {
    const token = await keytar.getPassword(SERVICE, ACTIVEUSERREFRESHTOKEN);
    return token;
}

export async function storeUserId(userId) {
    await keytar.setPassword(SERVICE, ACTIVEUSERID, userId);
}

export async function retrieveUserId() {
    const userId = await keytar.getPassword(SERVICE, ACTIVEUSERID);
    return userId;
}

export async function callServer(method = "GET", path = "/", body = {}) {
    let response = "";
    try {
        if (method === "POST")
            response = await api.post(path, body)

        return response;
    } catch (error) {
        throw new Error(error.response?.data.message || error.message);
    }
}


