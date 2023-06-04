// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth";
import{getStorage} from"firebase/storage"
import { getAnalytics,logEvent } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDVsjkicttPQsRyD-WVaV3nKR-HmFgEPbk',
  authDomain: 'auth-fhome.firebaseapp.com',
  projectId: 'auth-fhome',
  storageBucket: 'auth-fhome.appspot.com',
  messagingSenderId: '781188748949',
  appId: '1:781188748949:web:782855fb18be9a3f91ad9c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const storage = getStorage(app)
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');
