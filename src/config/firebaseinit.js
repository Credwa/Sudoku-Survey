import firebase from 'firebase/app';

require('firebase/database');
const configData = require('./config.json');

const config = {
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  databaseURL: configData.databaseURL,
  storageBucket: configData.storageBucket,
  projectId: configData.projectId,
  messagingSenderId: configData.messagingSenderId,
};
const firebaseApp = firebase.initializeApp(config);
// const database = firebase.database();

export default firebaseApp;
