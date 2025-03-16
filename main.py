import cv2
import face_recognition
import firebase_admin
from firebase_admin import credentials, db
import numpy as np
import os
import tkinter as tk
from tkinter import Label, Button, ttk
from PIL import Image, ImageTk

# Initialize Firebase
cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://face-detection-tanishpoddar-default-rtdb.asia-southeast1.firebasedatabase.app/"
})

# Load predefined face images
def load_known_faces():
    known_face_encodings = []
    known_face_names = []
    image_folder = "images/"
    
    for filename in os.listdir(image_folder):
        if filename.endswith(".png"):
            image_path = os.path.join(image_folder, filename)
            image = face_recognition.load_image_file(image_path)
            encoding = face_recognition.face_encodings(image)
            if encoding:
                known_face_encodings.append(encoding[0])
                known_face_names.append(filename.split('.')[0])
    
    return known_face_encodings, known_face_names

# Initialize face data
known_face_encodings, known_face_names = load_known_faces()
video_capture = None
selected_camera = 0
running = False

# Function to open camera
def open_camera():
    global video_capture, selected_camera, running
    video_capture = cv2.VideoCapture(selected_camera)
    running = True
    scan_face()

# Function to close camera
def close_camera():
    global video_capture, running
    running = False
    if video_capture:
        video_capture.release()
        video_capture = None
        access_label.config(text="Camera Closed")

# Function to scan face
def scan_face():
    global access_label, canvas, video_capture, running
    if not video_capture or not running:
        return
    
    ret, frame = video_capture.read()
    if not ret:
        access_label.config(text="Camera Error")
        return
    
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
    
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    
    recognized = "No"
    
    for face_encoding, (top, right, bottom, left) in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        
        if True in matches:
            recognized = "Yes"
            break
        
        # Draw rectangles around detected faces
        top, right, bottom, left = top * 4, right * 4, bottom * 4, left * 4
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
    
    # Update Firebase with recognition result
    ref = db.reference("/door_lock")
    ref.set({"access": recognized})
    
    # Update UI
    access_label.config(text=f"Access: {recognized}", fg="green" if recognized == "Yes" else "red")
    
    # Convert OpenCV frame to Tkinter format
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(frame)
    imgtk = ImageTk.PhotoImage(image=img)
    canvas.create_image(0, 0, anchor=tk.NW, image=imgtk)
    canvas.image = imgtk
    
    if running:
        canvas.after(10, scan_face)

# Function to select camera
def select_camera(event):
    global selected_camera
    selected_camera = int(camera_selection.get())

# Create GUI
app = tk.Tk()
app.title("Face Detection Door Lock")
app.geometry("900x600")
app.configure(bg="#121212")

title_label = Label(app, text="FaceLock: AI-Based Door Security System", font=("Arial", 18, "bold"), fg="cyan", bg="#121212")
title_label.pack(pady=10)

access_label = Label(app, text="Access: Waiting...", font=("Arial", 16, "bold"), fg="white", bg="#121212")
access_label.pack(pady=10)

canvas = tk.Canvas(app, width=640, height=360, bg="black", highlightthickness=2, highlightbackground="white")
canvas.pack(pady=10)

# Camera selection dropdown
camera_selection_label = Label(app, text="Select Camera:", font=("Arial", 12), fg="white", bg="#121212")
camera_selection_label.pack()

camera_selection = ttk.Combobox(app, values=["0 (Main Camera)", "1 (External Camera)"], state="readonly")
camera_selection.current(0)
camera_selection.pack()
camera_selection.bind("<<ComboboxSelected>>", select_camera)

# Button Frame
button_frame = tk.Frame(app, bg="#121212")
button_frame.pack(pady=10)

open_camera_button = Button(button_frame, text="Open Camera", font=("Arial", 12), bg="#00cc66", fg="white", width=15, command=open_camera)
open_camera_button.grid(row=0, column=0, padx=5)

close_camera_button = Button(button_frame, text="Close Camera", font=("Arial", 12), bg="#ff4444", fg="white", width=15, command=close_camera)
close_camera_button.grid(row=0, column=1, padx=5)

scan_button = Button(button_frame, text="Scan Again", font=("Arial", 12), bg="#0099ff", fg="white", width=15, command=scan_face)
scan_button.grid(row=0, column=2, padx=5)

# Footer
footer_label = Label(app, text="Made with ❤️ by Tanish Poddar & Prabhav Singh", font=("Arial", 12), fg="orange", bg="#121212")
footer_label.pack(side=tk.BOTTOM, pady=10)

app.mainloop()