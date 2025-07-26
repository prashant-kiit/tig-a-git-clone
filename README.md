# tig-a-git-clone
# a clone of Git

# nodemon : start the watch
# node ./tig.js stage ./watched.js  : stage the watched changes
# node ./tig.js commit "added a new change" : commit the staged changes

# https://www.youtube.com/watch?v=RxHJdapz2p0
# https://databasesample.com/database/github-database

# Key Tar Secure Vault: npm install -g node-gyp && npm install 

# encoding and decoding
const zlib = require('zlib');

// Original string
const input = "This is a sample string that needs to be compressed and encoded.";

// Compress and encode
const compressed = zlib.gzipSync(input);
const encoded = compressed.toString('base64');
console.log("Encoded:", encoded);

// Decode and decompress
const decoded = Buffer.from(encoded, 'base64');
const decompressed = zlib.gunzipSync(decoded).toString();
console.log("Decompressed:", decompressed);