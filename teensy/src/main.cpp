#include <Arduino.h>

#define PWM_OUT_PIN_R (3)
#define PWM_OUT_PIN_G (4)
#define PWM_OUT_PIN_B (5)

String buffer = "";
int r, g, b;

void setup() {
    // USBシリアル（On board）
    Serial.begin(9600);
    pinMode(PWM_OUT_PIN_R, OUTPUT);
    pinMode(PWM_OUT_PIN_G, OUTPUT);
    pinMode(PWM_OUT_PIN_B, OUTPUT);
}

void loop() {
    if (Serial.available()) {
        buffer = Serial.readString();
        int result = sscanf(buffer.c_str(), "%d,%d,%d", &r, &g, &b);
        uint16_t r16 = static_cast<uint16_t>((float)r / 100 * 4096.0);
        analogWrite(PWM_OUT_PIN_R, r16);
        uint16_t g16 = static_cast<uint16_t>((float)g / 100 * 4096.0);
        analogWrite(PWM_OUT_PIN_G, g16);
        uint16_t b16 = static_cast<uint16_t>((float)b / 100 * 4096.0);
        analogWrite(PWM_OUT_PIN_B, b16);
    }
}
