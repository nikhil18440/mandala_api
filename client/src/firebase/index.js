import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import env from 'dotenv'

// const firebaseConfig = 

firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_apiKey ,
    authDomain: process.env.REACT_APP_FIREBASE_authDomain,
    projectId: process.env.REACT_APP_FIREBASE_projectId,
    storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
    messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
    appId: process.env.REACT_APP_FIREBASE_appId,
    measurementId: process.env.REACT_APP_FIREBASE_appId
})

const storage = firebase.storage()

export { storage, firebase as default }