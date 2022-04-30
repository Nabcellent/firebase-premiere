// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    ApplicationVerifier,
    AuthProvider,
    getAuth,
    GoogleAuthProvider,
    signInWithPhoneNumber,
    signInWithPopup,
    UserCredential
} from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { toast } from './utils/helpers';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArNiQJyg6PgXnZsesyKs4tsckY2NufjFk",
    authDomain: "fluent-imprint-335817.firebaseapp.com",
    projectId: "fluent-imprint-335817",
    storageBucket: "fluent-imprint-335817.appspot.com",
    messagingSenderId: "894866721271",
    appId: "1:894866721271:web:2d14d2fb5528f2592806f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const AuthProviders = {
    google: new GoogleAuthProvider()
};

export const signInWithSocialAuth = (provider: AuthProvider) => new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider).then(res => resolve(res)).catch(err => reject(err))
});

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, AuthProviders.google);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);

        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

export const signInWithPhone = ({phone, appVerifier}: { phone: string, appVerifier: ApplicationVerifier }) => {
    return signInWithPhoneNumber(auth, phone, appVerifier).then(function (res) {
        let code = prompt('Enter the otp', '');

        if (code === null) return false;

        res.confirm(code).then(result => {
            console.log(result.user);

            return true;
        }).catch(err => {
            console.log(err);
            toast({msg: err.message});

            return false;
        });
    });
};