const admin = require('firebase-admin');

//const serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(require('../keys/admin'))
});

// admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
