const { admin, db } = require('../util/admin');
const config = require('../util/config');

const { v4: uuid} = require('uuid');
const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignUpData , validateLoginData, reduceUserDetails} = require('../util/validators');

//user sign up
exports.signup = (req, res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const { valid, errors} = validateSignUpData(newUser);

    if(!valid) return res.status(400).json(errors);

    const noImage = 'user.png';
    // todo validate data
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc =>{
            if(doc.exists){
                return res.status(400).json({handle: 'this handle is already taken'})
            }else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data=>{
            userId = data.user.uid;
            return  data.user.getIdToken();
        })
        .then( idToken =>{
            token = idToken;
            const userCredential = {
                "email": newUser.email,
                "handle": newUser.handle,
                "createdAt": new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredential);
        })
        .then(()=>{
            return res.status(201).json({ token })
        })
        .catch(err=>{
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({email: 'Email is already in use'})
            }else if(err.code === 'auth/invalid-email'){
                return res.status(403).json({ email: 'Please put a valid Email Address'})
            }
            else {
                return res.status(500).json({general: 'Something went wrong, please try again'})
            }
        })
};

//user login
exports.login = (req, res)=>{
    const user = {
        email : req.body.email,
        password: req.body.password
    };

    const { valid, errors} = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data =>{
            return data.user.getIdToken();
        }).then(token =>{
        return res.json({token})
    }).catch(err=>{
        console.error(err);
        return res
            .status(403)
            .json({ general: 'Wrong credentials, please try again'})
    })

};

//add user details
exports.addUserDetails = (req, resp)=>{
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(()=>{
            return resp.json({message: 'Details added successfully'})
        })
        .catch(err=>{
            console.error(err);
            return resp.status(500).json({error: err.code})
        })
};

//get any user details
exports.getUserDetails = (req, resp) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`)
        .get()
        .then((doc)=>{
            if(doc.exists){
                userData.user = doc.data();
                return db
                    .collection("screams")
                    .where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            }else {
                return resp.status(404).json({ error: 'user not found'})
            }
        })
        .then((data)=>{
            userData.screams = [];
            data.forEach(doc=>{
                userData.screams.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    screamId: doc.id,
                })
            });
            return resp.json(userData)
        })
        .catch((err)=>{
            console.error(err);
            return resp.status(500).json({ error: err.code})
        })
};


//get own user details
exports.getAuthenticatedUser = (req, resp) =>{
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc =>{
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', '==', req.user.handle).get()
            }
        })
        .then(data=>{
            userData.likes=[];
            data.forEach(doc =>{
                userData.likes.push(doc.data())
            });
            return db.collection('notifications')
                .where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10).get()
        })
        .then((data)=>{
            userData.notifications = [];
            data.forEach(doc=>{
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    type: doc.data().type,
                    read: doc.data().read,
                    screamId: doc.data().screamId,
                    notificationId: doc.id
                })
            });
            return resp.json(userData)
        })
        .catch(err=>{
            console.error(err);
            return resp.status(500).json({error: err.code})
        }
    )
};


//upload an image
exports.uploadImage = (req, resp)=>{
    const Busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new Busboy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    // String for image token
    let generatedToken = uuid();

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (!mimetype.includes('image')) {
            return resp.status(400).json({error: 'Wrong file uploaded'})
        }
        const imageExtension = filename.split('.')[filename.split('.').length-1];//327536548675765.png
        imageFileName = `${Math.round(Math.random()*100000000000).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on("finish", ()=>{
        admin
            .storage()
            .bucket(`${config.storageBucket}`)
            .upload(imageToBeUploaded.filepath,{
            resumable: false,
            metadata:{
                metadata:{
                    contentType: imageToBeUploaded.mimetype,
                    //Generate token to be appended to imageUrl
                    firebaseStorageDownloadTokens: generatedToken,
                }
            }
        })
            .then(()=>{
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;
                return db.doc(`/users/${req.user.handle}`).update({imageUrl})
            })
            .then(()=>{
                return resp.json({message: 'Image Uploaded successfully'})
            })
            .catch(err=>{
                console.error(err);
                return resp.status(500).json({error: "Something went wrong"})
            })
    });
    busboy.end(req.rawBody)
};

//mark notification read
exports.markNotificationsRead =(req, resp) =>{
    let batch = db.batch();
    req.body.forEach((notificationId)=>{
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true})
    });
    batch
        .commit()
        .then(()=>{
            return resp.json({message: 'Notifications marked read'})
        })
        .catch((err)=>{
            console.error(err);
            return resp.status(500).json({error: err.code})
        })
};
