import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANYAYqZnOORkP6KdCe1V2dMB_tOslAsjI",
  authDomain: "geo-market-a6726.firebaseapp.com",
  projectId: "geo-market-a6726",
  storageBucket: "geo-market-a6726.appspot.com",
  messagingSenderId: "132254104891",
  appId: "1:132254104891:web:5ee9ffa6824c0837ed0b1e",
  measurementId: "G-RMKWTM0RLX",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyADn0sn9I22XkNgUQl-drrpECL3aQifDlA",
//   authDomain: "geo-market-b9ed3.firebaseapp.com",
//   projectId: "geo-market-b9ed3",
//   storageBucket: "geo-market-b9ed3.appspot.com",
//   messagingSenderId: "834180142030",
//   appId: "1:834180142030:web:03b3319a045864d923119f",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
