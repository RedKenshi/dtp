import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCP9gRUCkmCiTlIW1eQlEFhDudk0RLorq8",
    authDomain: "dieuzaide-tp.firebaseapp.com",
    projectId: "dieuzaide-tp",
    storageBucket: "dieuzaide-tp.appspot.com",
    messagingSenderId: "851034130454",
    appId: "1:851034130454:web:1cf5cb7d0990431aeb4d37"
} as FirebaseOptions;

let app : FirebaseApp | undefined;

if(!getApps().length){
    app = initializeApp(firebaseConfig);
}

function createFirebaseApp(config:FirebaseOptions) {
    try {
        return getApp();
    } catch {
        return initializeApp(config);
    }
}
  
const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';