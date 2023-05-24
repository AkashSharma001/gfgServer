const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAvJc6nNR3n4n0MTZAJZiBqlIyW0oLayk",
    authDomain: "productserver-57d88.firebaseapp.com",
    projectId: "productserver-57d88",
    storageBucket: "productserver-57d88.appspot.com",
    messagingSenderId: "580654811693",
    appId: "1:580654811693:web:3de39fadcc304fe73d86a4"
  };
  

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports = getStorage(firebaseApp);
