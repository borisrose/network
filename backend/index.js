const express = require('express')
const  app = express()
  
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serviceAccount = require('./serviceAccountKey.json')

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.get('/posts', (request, response) => {

    response.set('Access-Control-Allow-Origin', '*')

    let posts = [
       
    ]

    db.collection('posts').orderBy('date', 'desc').get().then((snapShot) => {


      snapShot.forEach((doc) => {

        console.log(doc.id, '=>',doc.data())
        posts.push(doc.data().content)
      });

      response.send(posts)
    })
    
    
    
})

app.listen(process.env.PORT || 3000)