#include <WiFi.h>
#include <Firebase.h>

#define FIREBASE_HOST "YOUR_FIREBASE_DATABASE_URL"
#define FIREBASE_AUTH "YOUR_FIREBASE_AUTH_KEY"

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

#define RED_LED 25
#define GREEN_LED 26

Firebase fb(FIREBASE_HOST, FIREBASE_AUTH);

void setup() {
    Serial.begin(115200);
    
    pinMode(RED_LED, OUTPUT);
    pinMode(GREEN_LED, OUTPUT);
    
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, LOW);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }
}

void loop() {
    String accessValue = fb.getString("door_lock/access");

    if (accessValue == "Yes") {
        Serial.println("Access Granted! Green LED ON, Red LED OFF.");
        digitalWrite(GREEN_LED, HIGH);
        digitalWrite(RED_LED, LOW);
    } 
    else if (accessValue == "No") {
        Serial.println("Access Denied! Red LED ON, Green LED OFF.");
        digitalWrite(RED_LED, HIGH);
        digitalWrite(GREEN_LED, LOW);
    } 
    else {
        Serial.println("Failed to fetch data from Firebase.");
    }

    delay(100); 
}