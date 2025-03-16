/**
 * Face Recognition class to handle all face detection and recognition operations
 */
class FaceRecognizer {
    constructor(videoElement, canvasElement, statusElement, doorStatusElement, logContainer) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.statusElement = statusElement;
        this.doorStatusElement = doorStatusElement;
        this.logContainer = logContainer;
        this.stream = null;
        this.isModelLoaded = false;
        
        // Known faces - these would be loaded from your database in a real system
        this.knownFaces = [];
        
        // Face matching threshold
        this.matchThreshold = 0.6; // Lower means stricter matching
    }
    
    /**
     * Load face-api.js models
     */
    async loadModels() {
        try {
            this.statusElement.textContent = "Loading facial recognition models...";
            this.addLog("Loading facial recognition models...");
            
            // Load all required models
            await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
            
            this.isModelLoaded = true;
            this.statusElement.textContent = "Models loaded! Ready to start camera.";
            this.addLog("Face recognition models loaded successfully");
            
            // In a real app, you would load known faces here
            await this.loadKnownFaces();
            
            return true;
        } catch (error) {
            this.addLog(`Error loading models: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Load known faces from database or local storage
     * In a real app, this would fetch from your database
     */
    async loadKnownFaces() {
        // This is a placeholder. In a real app, you would:
        // 1. Load face images from your server/storage
        // 2. Process them to extract face descriptors
        // 3. Store them with labels for matching
        
        // For demo purposes, we're using placeholder data
        this.knownFaces = [
            { id: 'person1', label: 'Person 1', descriptor: null },
            { id: 'person2', label: 'Person 2', descriptor: null }
        ];
        
        this.addLog(`Loaded ${this.knownFaces.length} known faces`);
    }
    
    /**
     * Start the camera
     */
    async startCamera() {
        if (!this.isModelLoaded) {
            throw new Error("Face recognition models not loaded");
        }
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user"
                } 
            });
            
            this.video.srcObject = this.stream;
            
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    // Set canvas dimensions to match video
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                    
                    this.statusElement.textContent = "Camera started. Ready to capture and analyze faces.";
                    resolve(true);
                };
            });
        } catch (error) {
            this.addLog(`Error accessing camera: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Stop the camera
     */
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
            this.stream = null;
            this.addLog("Camera stopped");
        }
    }
    
    /**
     * Analyze the current video frame
     */
    async analyzeCurrentFrame() {
        if (!this.stream) {
            throw new Error("Camera not started");
        }
        
        try {
            // Draw current frame to canvas
            const ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Detect faces
            const detections = await faceapi.detectAllFaces(this.canvas)
                .withFaceLandmarks()
                .withFaceDescriptors();
            
            // Draw detections on canvas
            faceapi.draw.drawDetections(this.canvas, detections);
            
            if (detections.length === 0) {
                this.statusElement.textContent = "No face detected. Please try again.";
                this.addLog("No face detected in the capture");
                return null;
            }
            
            this.addLog(`Detected ${detections.length} face(s)`);
            
            // In a real application, you would:
            // 1. Compare detected face descriptors with known faces
            // 2. Determine if there's a match using euclidean distance
            // 3. Return YES or NO based on match results
            
            // For this demo, we'll simulate recognition
            // In production, use actual face matching logic
            const result = this.simulateRecognition(detections);
            
            this.statusElement.textContent = `Face analyzed! Access: ${result}`;
            this.addLog(`Face recognition result: ${result}`);
            
            return result;
        } catch (error) {
            this.addLog(`Error analyzing face: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Simulate face recognition
     * In a real app, replace this with actual face matching logic
     */
    simulateRecognition(detections) {
        // For demo: 70% chance of successful recognition
        const recognized = Math.random() > 0.3;
        
        if (recognized) {
            // In production, this would be based on actual face matching
            return "YES"; // Grant access
        } else {
            return "NO"; // Deny access
        }
    }
    
    /**
     * Real face recognition implementation
     * This would replace simulateRecognition in production
     */
    async recognizeFace(detections) {
        if (detections.length === 0) return "NO";
        
        // Get the descriptor of the first detected face
        const queryDescriptor = detections[0].descriptor;
        
        // In a real application, your known faces would have actual descriptors
        // For each known face, calculate the distance to the detected face
        let bestMatch = null;
        let minDistance = Infinity;
        
        for (const knownFace of this.knownFaces) {
            if (knownFace.descriptor) {
                // Calculate Euclidean distance between face descriptors
                const distance = faceapi.euclideanDistance(queryDescriptor, knownFace.descriptor);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    bestMatch = knownFace;
                }
            }
        }
        
        // Determine if this is a match (lower distance = better match)
        if (bestMatch && minDistance < this.matchThreshold) {
            this.addLog(`Matched with: ${bestMatch.label} (distance: ${minDistance.toFixed(2)})`);
            return "YES"; // Grant access
        } else {
            this.addLog(`No match found. Best distance: ${minDistance.toFixed(2)}`);
            return "NO"; // Deny access
        }
    }
    
    /**
     * Add face to known faces
     * This would be used in an admin interface to register new faces
     */
    async addKnownFace(label, faceImage) {
        try {
            // Detect face in the provided image
            const detection = await faceapi.detectSingleFace(faceImage)
                .withFaceLandmarks()
                .withFaceDescriptor();
                
            if (!detection) {
                throw new Error("No face detected in the provided image");
            }
            
            // Create a new known face entry
            const newFace = {
                id: `person${this.knownFaces.length + 1}`,
                label: label,
                descriptor: detection.descriptor
            };
            
            // Add to known faces
            this.knownFaces.push(newFace);
            
            // In a real app, you would save this to your database
            this.addLog(`Added new face: ${label}`);
            
            return newFace.id;
        } catch (error) {
            this.addLog(`Error adding face: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Draw face landmarks on canvas
     */
    drawFaceLandmarks(detections) {
        const ctx = this.canvas.getContext('2d');
        
        // Clear previous drawings
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw current frame
        ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Draw detections and landmarks
        faceapi.draw.drawDetections(this.canvas, detections);
        faceapi.draw.drawFaceLandmarks(this.canvas, detections);
        
        // Add labels
        detections.forEach((detection, i) => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
                label: `Face ${i + 1}`,
                lineWidth: 2
            });
            drawBox.draw(this.canvas);
        });
    }
    
    /**
     * Add log entry
     */
    addLog(message) {
        const logEntry = document.createElement("div");
        logEntry.className = "log-entry";
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.logContainer.prepend(logEntry);
    }
}