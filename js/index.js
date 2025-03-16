// Main app initialization
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const startButton = document.getElementById('startButton');
    const captureButton = document.getElementById('captureButton');
    const statusElement = document.getElementById('status');
    const doorStatusElement = document.getElementById('doorStatus');
    const logContainer = document.getElementById('logContainer');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    // Initialize firebase from firebaseConfig.js
    initializeFirebase();
    
    // Setup face recognition from faceRecognition.js
    const faceRecognizer = new FaceRecognizer(
        video, 
        canvas, 
        statusElement,
        doorStatusElement,
        logContainer
    );
    
    // Start the app and load models
    faceRecognizer.loadModels()
        .then(() => {
            addLog("System ready to start");
            startButton.disabled = false;
        })
        .catch(error => {
            addLog(`Error loading models: ${error.message}`);
            statusElement.textContent = `Error loading models: ${error.message}`;
        });
    
    // Start camera button click handler
    startButton.addEventListener('click', async () => {
        try {
            await faceRecognizer.startCamera();
            captureButton.disabled = false;
            addLog("Camera started successfully");
        } catch (error) {
            addLog(`Error starting camera: ${error.message}`);
            statusElement.textContent = `Error starting camera: ${error.message}`;
        }
    });
    
    // Capture and analyze button click handler
    captureButton.addEventListener('click', async () => {
        try {
            statusElement.textContent = "Processing...";
            const result = await faceRecognizer.analyzeCurrentFrame();
            
            if (result) {
                // Update database with result
                updateDoorControl(result);
                
                // Update UI based on result
                if (result === "YES") {
                    openDoor();
                    // Auto-close after 5 seconds
                    setTimeout(() => {
                        closeDoor();
                    }, 5000);
                }
            }
        } catch (error) {
            addLog(`Error analyzing face: ${error.message}`);
            statusElement.textContent = `Error analyzing face: ${error.message}`;
        }
    });
    
    // Function to open door
    function openDoor() {
        doorStatusElement.textContent = "Door Status: OPEN";
        doorStatusElement.classList.remove("closed");
        doorStatusElement.classList.add("open");
        addLog("Door opened");
    }
    
    // Function to close door
    function closeDoor() {
        updateDoorControl("NO");
        doorStatusElement.textContent = "Door Status: CLOSED";
        doorStatusElement.classList.remove("open");
        doorStatusElement.classList.add("closed");
        addLog("Door closed");
    }
    
    // Function to add log entry
    function addLog(message) {
        const logEntry = document.createElement("div");
        logEntry.className = "log-entry";
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.prepend(logEntry);
    }
    
    // Listen for changes in database (from ESP)
    listenToDoorControl((data) => {
        if (data) {
            if (data.status === "YES") {
                openDoor();
            } else {
                closeDoor();
            }
            addLog(`Door status updated from ESP: ${data.status}`);
        }
    });
});