#include <Arduino.h>

#define SWITCH_PIN_R (10)
#define SWITCH_PIN_G (11)
#define SWITCH_PIN_B (12)
#define SWITCH_PIN_IR (14)
#define TEST_LED (13)

#define LOOP_TIME (500)

void setup()
{
  pinMode(SWITCH_PIN_G, OUTPUT);
  pinMode(SWITCH_PIN_B, OUTPUT);
  pinMode(SWITCH_PIN_IR, OUTPUT);
  
  pinMode(TEST_LED, OUTPUT);
}

void turnOff () {
    digitalWrite(TEST_LED, LOW);
    digitalWrite(SWITCH_PIN_G, LOW);
}

void turnOn () {
    digitalWrite(TEST_LED, HIGH);
    digitalWrite(SWITCH_PIN_G, HIGH);
}

void loop()
{
    if (Serial.available() > 0 ) {
        String data = Serial.readStringUntil('\n');
        digitalWrite(TEST_LED, HIGH);
        if (data == "S") turnOn();
        else turnOff();
    } else turnOff();

    delay(LOOP_TIME);
}