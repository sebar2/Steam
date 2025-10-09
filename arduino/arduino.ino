// ==== Pines ====
#define RELAY_PIN 4    // GPIO4 → IN del relé (y LED en paralelo)
#define BUTTON_PIN 15  // GPIO15 → Botón (a GND con INPUT_PULLUP)

// ==== Configuración del relé ====
const bool RELAY_ACTIVE_LOW = true;             // tu relé se activa con nivel bajo
const int RELAY_ON  = RELAY_ACTIVE_LOW ? LOW  : HIGH;
const int RELAY_OFF = RELAY_ACTIVE_LOW ? HIGH : LOW;

// ==== Tiempo de apertura ====
const uint32_t OPEN_MS = 3000; // 3 segundos

// ==== Función para abrir ====
void abrir() {
  Serial.println(">> Activando relé...");
  digitalWrite(RELAY_PIN, RELAY_ON);
  delay(OPEN_MS);
  digitalWrite(RELAY_PIN, RELAY_OFF);
  Serial.println(">> Relé desactivado.");
}

void setup() {
  Serial.begin(115200);

  // Configurar relé y LED
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, RELAY_OFF);

  // Configurar botón con resistencia pull-up interna
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  Serial.println("Sistema iniciado: Relé en P4, Botón en P15, alimentación 5V.");
}

void loop() {
  // Si el botón está presionado (LOW porque INPUT_PULLUP lo deja en HIGH por defecto)
  if (digitalRead(BUTTON_PIN) == LOW) {
    abrir();
    delay(500); // antirrebote simple
  }
}
