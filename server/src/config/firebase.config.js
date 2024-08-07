import * as dotenv from 'dotenv';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import config from './firebase.config.js';

dotenv.config();

export default {
	firebaseConfig: {
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID,
		measurementId: process.env.FIREBASE_MEASUREMENT_ID,
	},
};

const app = initializeApp(config.firebaseConfig);
const storage = getStorage();

export { storage };
