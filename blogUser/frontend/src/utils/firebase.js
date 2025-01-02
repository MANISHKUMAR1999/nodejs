// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider,signInWithPopup} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth  = getAuth(app)

const provider = new GoogleAuthProvider()

const analytics = getAnalytics(app);

export async function googleAuth() {
    try{
        let data = await signInWithPopup(auth,provider)
        return data.user
    }
    catch(error){
        console.log(error)
    }


    
}
