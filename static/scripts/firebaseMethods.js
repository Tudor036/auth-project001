import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    setPersistence, 
    browserSessionPersistence, 
    signInWithEmailAndPassword 
} from "firebase/auth";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc 
} from "firebase/firestore";
import Cookies from "js-cookie";

const firebaseConfig = {
    apiKey: "AIzaSyC0bVLVE4tjQIi2UGsoXk6Gi5acUnNzfuQ",
    authDomain: "first-blog-7b98b.firebaseapp.com",
    projectId: "first-blog-7b98b",
    storageBucket: "first-blog-7b98b.appspot.com",
    messagingSenderId: "917429207291",
    appId: "1:917429207291:web:8d54bb9458fdf2fcdd705e",
    measurementId: "G-SX68G92TBJ"
}

initializeApp(firebaseConfig);
export const db = getFirestore();

// ----- CREATE USER ------

export const CreateUser =  async function(userinfo) {
    const auth = getAuth()

    const e = document.querySelector('#error-message');
    const { name, email, password, confirm } = userinfo;

    // check password validity
    if(password != confirm) {
        e.textContent = "Error: The passwords don't match!"
        return null;
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, '/users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    console.log(userDocSnapshot.exists());

    const createdAt = new Date();
    const admin = false;

    try {
        await setDoc(userDocRef, {
            name,
            email,
            admin,
            createdAt
        })
    } catch (err) {
        console.log("An error occured: ", err.message);
    }

    auth.signOut();
}

// ----- SIGN IN USER -----

export const SignInUser = (email, password) => {
    const auth = getAuth();

    setPersistence(auth, browserSessionPersistence).then(async () => {
        const response = await signInWithEmailAndPassword(auth, email, password)
        .catch((err) => throwErrors(err.message));

        if (response === undefined) return;

        showAuthMessage("Successfully authenticated!", "green");
    
        const { user } = response;
        const admin = await getUserRole(user.uid);
        const idToken = await user.getIdToken();
        await fetchAndRedirect(idToken, admin);
    });

    auth.signOut();
}

function showAuthMessage(message, color) {
    const e = document.getElementById('error-message');

    e.style.color = color;
    e.textContent = message;
}

async function fetchAndRedirect(token, role, fetchLocation = "/sessionLogin") {
    await fetch(fetchLocation, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
            // "ROLE": 
        },
        body: JSON.stringify({ token, role })
    });
    
    window.location.replace(role ? "/admin" : "/dashboard");
}

function throwErrors(errMessage) {
    switch (errMessage) {
        case "Firebase: Error (auth/user-not-found).":
            showAuthMessage("Error: user not found!", "red");
            break;
        case "Firebase: Error (auth/wrong-password).":
            showAuthMessage("Error: wrong password!", "red");
            break;
        case "Firebase: Error (auth/network-request-failed).":
            showAuthMessage("Error: check internet connection!", "red");
        case "forbidden access":
            showAuthMessage("Error: forbidden access", "red");
        default:
            showAuthMessage("Error: unknown error! Please try again in 5 min.", "red")
            break;
    }
}

async function getUserRole(uid) {
    const userDocRef = doc(db, 'users', uid);
    const userDocument = await getDoc(userDocRef);

    return userDocument.data().admin ? "admin" : "user";
}