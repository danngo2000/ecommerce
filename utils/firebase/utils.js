import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

import { firebaseConfig } from './config'

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

export const auth = firebase.auth()
export const firestore = firebase.firestore()

const GoogleProvider = new firebase.auth.GoogleAuthProvider()
GoogleProvider.setCustomParameters({ prompt: 'select_account' })
export const signInWithGoogle = () => auth.signInWithPopup(GoogleProvider)


export const handleUserProfile = async (userAuth, additionalData) => {
    if (!userAuth) return;
    const { uid } = userAuth

    const userRef = firestore.doc(`users/${uid}`)
    const snapshot = await userRef.get()

    if (!snapshot.exists) {
        const { displayName, email } = userAuth
        const timestamp = new Date()

        try {
            await userRef.set({
                displayName,
                email,
                createDate: timestamp,
                ...additionalData
            })
        } catch (err) {
            // console.log(err);
        }
    }
    return userRef
}