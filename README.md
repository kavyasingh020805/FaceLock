Here’s your modified README file with instructions for setting up the 

---

# FaceLock: AI-Based Door Security System  

## 📌 Project Overview  
FaceLock is a face detection-based door lock system that verifies users using pre-stored face images. If a recognized face is detected, the system updates Firebase, which can then be used to control a door lock via an ESP32 microcontroller.  

## 🛠 Features  
✅ Real-time face detection using OpenCV & Face Recognition library  
✅ Pre-stored face verification  
✅ Firebase Realtime Database integration  
✅ Tkinter GUI for live camera feed & access control  
✅ ESP32-based door control with LED status indicators  

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

### 5️⃣ Setup ESP32 for Door Lock Control  
#### 🔧 Required Components  
- **ESP32** (or ESP8266)  
- **Servo Motor** (for door lock)  
- **LEDs** (Red for "Access Denied", Green for "Access Granted")  
- **5V Power Supply**  

## 🔌 Wiring Connections

- **Red LED (Access Denied)**
  - ESP32 Pin: **GPIO 25**
  - Function: Turns ON when access is denied

- **Green LED (Access Granted)**
  - ESP32 Pin: **GPIO 26**
  - Function: Turns ON when access is granted

- **Servo Motor (Door Lock)**
  - ESP32 Pin: **GPIO 5** (Signal Pin)
  - Function: Controls the door lock mechanism

- **Power & Ground**
  - **3.3V / 5V** → Powers the ESP32 and components  
  - **GND** → Common ground for all components

---

### 6️⃣ Flash ESP32 with the Code  
1. Install the **Arduino IDE** and the ESP32 board support package.  
2. Install required libraries:  
   - `WiFi.h` (built-in)  
   - `FirebaseESP32.h` (install via Library Manager)  
3. Open `FaceLock_ESP32.ino` and update WiFi & Firebase credentials:  
```cpp
#define FIREBASE_HOST "YOUR_FIREBASE_DATABASE_URL"
#define FIREBASE_AUTH "YOUR_FIREBASE_AUTH_KEY"

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
```  
4. Upload the code to your ESP32 using Arduino IDE.  

---

### 7️⃣ Run the FaceLock System  
1. Start the face detection system:  
   ```sh
   python main.py
   ```  
2. When a face is recognized, it updates Firebase (`door_lock/access` → `"Yes"` or `"No"`).  
3. The ESP32 reads this value and controls the servo motor to unlock the door.  

---

## 💡 Notes  
- Make sure the ESP32 is connected to the same WiFi network as the Python script.  
- The servo motor should be calibrated to rotate correctly for locking/unlocking.  

---

## 🏆 Made with ❤️ by Tanish Poddar & Prabhav Singh, Asmi Sharma & Kavya Singh
