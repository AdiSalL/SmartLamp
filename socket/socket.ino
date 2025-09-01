#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "NETD_SR";
const char* password = "password123.";

WebSocketsClient webSocket;

const int pinBolam  = 26;

// --- konfigurasi soketi ---
const char* host = "soketi.ajikamaludin.id"; // domain soketi kamu
const int port = 6002;               // port soketi SSL
const char* appKey = "default_app_key";      // isi dengan APP_KEY soketi
const char* channel = "esp32-smartlamp"; // channel yang mau di-subscribe
const char* eventName = "smartlamp";   // event yang mau diterima

bool containsON(const uint8_t* payload, size_t length) {
  if (!payload || length < 2) return false;
  for (size_t i = 0; i + 1 < length; ++i) {
    if (payload[i] == 'O' && payload[i + 1] == 'N') return true;
  }
  return false;
}

// handle pesan masuk
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("⚠️ Terputus dari soketi");
      break;
    case WStype_CONNECTED:
      Serial.println("✅ Terkoneksi ke soketi");

      // kirim subscribe channel (format Pusher protocol)
      {
        String msg = "{\"event\":\"pusher:subscribe\",\"data\":{\"channel\":\"" + String(channel) + "\"}}";
        webSocket.sendTXT(msg);
      }

      // contoh trigger event (hanya bisa kalau channel punya auth di backend)
      {
        String msg = "{\"event\":\"" + String(eventName) + "\",\"data\":\"{\\\"message\\\":\\\"Halo dari Arduino\\\"}\",\"channel\":\"" + String(channel) + "\"}";
        webSocket.sendTXT(msg);
      }

      break;
    case WStype_TEXT:
      Serial.printf("📩 Pesan: %s\n", payload);
        if (containsON(payload, length)) {
            Serial.println("✅ Found 'ON'");
            // do something, e.g. turn on LED
            digitalWrite(pinBolam, HIGH);
        } else {
            Serial.println("❌ 'ON' not found");
            digitalWrite(pinBolam, LOW);
        }
      break;
  }
}

void setup() {
  Serial.begin(19200);

  pinMode(pinBolam, OUTPUT);


  digitalWrite(pinBolam, LOW);

  WiFi.begin(ssid, password);
  Serial.println("🔌 Menghubungkan WiFi...");
  Serial.println(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(pinBolam, LOW);
    delay(500);
    Serial.print(".");
  }
  digitalWrite(pinBolam, LOW);
  Serial.println("\n✅ WiFi terhubung");

  // connect ke soketi pakai Pusher protocol
  String path = "/app/" + String(appKey) + "?protocol=7&client=arduino&version=1.0&flash=false";
  webSocket.beginSSL(host, port, path.c_str());

  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();
}