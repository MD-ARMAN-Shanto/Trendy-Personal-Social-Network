const { db } = require ('../util/admin');

exports.getAllScreams = (req, resp)=>{
    db
        .collection('screams')
        .orderBy('createdAt', 'desc').
    get().
    then((data)=>{
        let screams = [];
        data.forEach((doc) =>{
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount,
                userImage: doc.data().userImage
            })
        });
        return resp.json(screams)
    }).catch(err=> console.error(err))
};

exports.postOneScream = (req, resp) => {
    if(req.body.body.trim() === ''){
        return resp.status(400).json({body:'Body must not be empty'})
    }

    const newScream ={
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db
        .collection('screams')
        .add(newScream)
        .then((doc)=>{
            const resScream = newScream;
            resScream.screamId = doc.id;
            resp.json(resScream)
        }).catch(err=>{
        resp.status(500).json({error: `Something went wrong`});
        console.error(err)
    })
};

//get screams
exports.getScream = ( req, resp) =>{
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`).get()
        .then(doc=>{
            if(!doc.exists){
                return resp.status.json({ error: 'Scream not found'})
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get()
        })
        .then(data=>{
            screamData.comments=[];
            data.forEach(doc=>{
                screamData.comments.push(doc.data());
            });
            return resp.json(screamData)
        })
        .catch(err=>{
            console.log(err);
            resp.status(500).json({error: err.code})
        })
};

//comment on a comment
exports.commentOnScream = (req, resp) => {
    if(req.body.body.trim() === '')
        return resp.status(400).json({comment: 'Must not be empty'});

    let newComment ={
        body: req.body.body,
        createdAt: new Date().toISOString(),
        userHandle: req.user.handle,
        screamId: req.params.screamId,
        userImage: req.user.imageUrl
    };
    console.log(newComment);

    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc)=>{
            if(!doc.exists){
                return resp.status(404).json({error: 'Scream not found'});
            }
            return doc.ref.update({commentCount: doc.data().commentCount +1})
        })
        .then(()=>{
            return db.collection('comments').add(newComment)
        })
        .then(()=>{
            resp.json(newComment);
        })
        .catch(err=>{
            console.error(err);
            resp.status(500).json({error: 'Something went wrong'})
        })
};

//like a scream
exports.likeScream = (req, resp) =>{
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where ('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`)

    let screamData;
    screamDocument
        .get()
        .then((doc)=>{
            if(doc.exists){
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get()
            }else {
                return resp.status(404).json({error: 'Scream not found'})
            }
        })
        .then((data)=>{
            if(data.empty){
                return db
                    .collection('likes')
                    .add({
                        screamId: req.params.screamId,
                        userHandle: req.user.handle
                    })
                    .then(()=>{
                        screamData.likeCount++;
                        return screamDocument.update({likeCount: screamData.likeCount})
                    })
                    .then(()=>{
                        return resp.json(screamData)
                    })
            }else {
                return  resp.status(400).json({error: 'Scream already liked'})
            }
        })
        .catch((err)=>{
            console.error(err);
            resp.status(500).json({error: err.code})
        })
};

//unlike e scream
exports.unlikeScream = (req, resp) =>{
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`);

    let screamData;

    screamDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            } else {
                return resp.status(404).json({ error: 'Scream not found' });
            }
        })
        .then((data) => {
            if (data.empty) {
                return resp.status(400).json({ error: 'Scream not liked' });
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                        resp.json(screamData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            resp.status(500).json({ error: err.code });
        });
};

//Delete a scream
exports.deleteScream = (req, resp) => {
    const document = db.doc(`/screams/${req.params.screamId}`);//screamId assign to document

    document
        .get()
        .then((doc)=>{
            if(!doc.exists){
                return resp.status(404).json({error:'Scream not found'})
            }
            if(doc.data().userHandle !== req.user.handle){
                return resp.status(403).json({error: 'Unauthorized'})
            } else {
                return document.delete()
            }
        })
        .then(()=>{
            resp.json({message: 'Scream delete successfully'})
        })
        .catch((err)=>{
            console.log(err);
            return resp.status(500).json({error: err.code})
        })
};

