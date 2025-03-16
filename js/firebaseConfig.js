// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Database reference
let database;
let doorControlRef;

/**
 * Initialize Firebase
 */
function initializeFirebase() {
    // Initialize Firebase app
    firebase.initializeApp(firebaseConfig);
    
    // Get database reference
    database = firebase.database();
    
    // Reference to door control in database
    doorControlRef = database.ref('doorControl');
    
    console.log("Firebase initialized");
}

/**
 * Update door control status in database
 * @param {string} status - YES or NO
 */
function updateDoorControl(status) {
    return doorControlRef.set({
        status: status,
        timestamp: Date.now(),
        source: 'web'
    });
}

/**
 * Listen for changes in door control
 * @param {function} callback - Function to call when status changes
 */
function listenToDoorControl(callback) {
    doorControlRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            callback(data);
        }
    });
}