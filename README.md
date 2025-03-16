# FaceLock: AI-Based Door Security System

## 📌 Project Overview
FaceLock is a face detection-based door lock system that verifies users using pre-stored face images. If a recognized face is detected, the system updates Firebase, which can then be used to control a door lock via an ESP8266 microcontroller.

## 🛠 Features
✅ Real-time face detection using OpenCV & Face Recognition library  
✅ Pre-stored face verification  
✅ Firebase Realtime Database integration  
✅ Tkinter GUI for live camera feed & access control  
✅ Support for multiple camera sources  
✅ Door lock trigger via ESP8266

---

## 🚀 Setup Guide

### 1️⃣ Install Dependencies
Ensure you have Python installed (Python 3.8+ recommended). Install the required libraries:
```sh
pip install opencv-python face-recognition numpy firebase-admin pillow
```

---

### 2️⃣ Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Navigate to **Build > Realtime Database** and create a database in test mode.
4. In **Project Settings > Service Accounts**, click on "Generate new private key" and download the JSON file.
5. Rename the downloaded JSON file to `firebase_config.json` and place it in the project folder.

---

### 3️⃣ Configure `firebase_config.json`
Ensure your `firebase_config.json` file follows this format:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
}
```

---

### 4️⃣ Add Person's Images
1. Create a folder named **`images/`** inside the project directory.
2. Place PNG images of authorized individuals in this folder.
3. Ensure the file names are meaningful (e.g., `john.png`).
4. The program will automatically load all images inside `images/` when started.

---

### 5️⃣ Run the FaceLock System
Start the face detection system by running:
```sh
python main.py
```

This will open a Tkinter window where you can select a camera, start scanning, and verify access!