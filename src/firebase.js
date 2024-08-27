import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB7I3edh4Iq3hEWWCVXYfB_pVJzAZOlZZ4",
    authDomain: "meu-chatbot-d4a79.firebaseapp.com",
    projectId: "meu-chatbot-d4a79",
    storageBucket: "meu-chatbot-d4a79.appspot.com",
    messagingSenderId: "83017801271",
    appId: "1:83017801271:web:59995e224b3c39e5c569b2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
