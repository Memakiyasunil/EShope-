import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBO6dFxAUgqWJ9_awuPTjznd6kXK4DxRIU",
  authDomain: "e-shop-da99d.firebaseapp.com",
  projectId: "e-shop-da99d",
  storageBucket: "e-shop-da99d.firebasestorage.app",
  messagingSenderId: "213251664783",
  appId: "1:213251664783:web:3d01aca910ea37ed4439fa",
  measurementId: "G-QLDP1SPWKW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
