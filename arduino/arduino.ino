#include <SPI.h>
#include <MFRC522.h>

// ===== Pines =====
#define LED_VERDE 2   // P2 → LED verde con 220Ω al ánodo, cátodo a GND
#define LED_ROJO  4   // P4 → LED rojo  con 220Ω al ánodo, cátodo a GND

// RC522 (SPI)
#define SS_PIN    5   // SDA
#define RST_PIN  22
MFRC522 mfrc522(SS_PIN, RST_PIN);

// ===== Lista de UIDs autorizados =====
const char* authorized[] = {
  "12 87 10 05"  // Tu UID autorizado
};
const int N_AUTH = sizeof(authorized) / sizeof(authorized[0]);

// ===== Convierte UID a texto =====
String uidToString(MFRC522::Uid &uid) {
  String s = "";
  for (byte i = 0; i < uid.size; i++) {
    if (uid.uidByte[i] < 0x10) s += "0";
    s += String(uid.uidByte[i], HEX);
    if (i != uid.size - 1) s += " ";
  }
  s.toUpperCase();
  return s;
}

// ===== Verifica si el UID está autorizado =====
bool isAuthorized(const String& uid) {
  for (int i = 0; i < N_AUTH; i++) {
    if (uid.equalsIgnoreCase(authorized[i])) return true;
  }
  return false;
}

// ===== Control de LEDs =====
void setLeds(bool verde, bool rojo) {
  digitalWrite(LED_VERDE, verde ? HIGH : LOW);
  digitalWrite(LED_ROJO, rojo ? HIGH : LOW);
}

// ===== Setup =====
void setup() {
  Serial.begin(115200);

  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);
  setLeds(false, true); // Empieza con rojo encendido

  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("Listo. Pase una tarjeta...");
}

// ===== Loop principal =====
void loop() {
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial())   return;

  String uid = uidToString(mfrc522.uid);
  Serial.print("UID: "); Serial.println(uid);

  if (isAuthorized(uid)) {
    Serial.print("✅ Aprobado: "); Serial.println(uid);
    setLeds(true, false);  // Verde ON
  } else {
    Serial.print("❌ Denegado: "); Serial.println(uid);
    setLeds(false, true);  // Rojo ON
  }

  mfrc522.PICC_HaltA(); // Detiene lectura
}


