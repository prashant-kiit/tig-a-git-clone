import { writeFileSync, readFileSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID, createHash, createCipheriv, createDecipheriv } from 'crypto';

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
