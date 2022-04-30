// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    ApplicationVerifier,
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPhoneNumber,
    signInWithPopup
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

type RegisterRequest = {
    name: string, email: string, password: string
}

type LoginRequest = {
    email: string, password: string
}

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

export const logInWithEmailAndPassword = async ({email, password}: LoginRequest) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);

        return true;
    } catch (err: any) {
        console.error(err);

        toast({msg: err.message, type: 'danger'});

        return false;
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

export const registerWithEmailAndPassword = async ({name, email, password}: RegisterRequest) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

export const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};