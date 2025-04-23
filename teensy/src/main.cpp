#include <Arduino.h>

#define SWITCH_PIN_R (12)
#define SWITCH_PIN_G (11)
#define SWITCH_PIN_B (12)
#define SWITCH_PIN_IR (14)
#define TEST_LED (13)

#define LOOP_TIME (60000)

void setup()
{
    pinMode(SWITCH_PIN_R, OUTPUT);
    pinMode(SWITCH_PIN_G, OUTPUT);
    pinMode(SWITCH_PIN_B, OUTPUT);
    pinMode(SWITCH_PIN_IR, OUTPUT);

    pinMode(TEST_LED, OUTPUT);
}

void turnOffGreen()
{
    digitalWrite(SWITCH_PIN_G, LOW);
}

void turnOffRed()
{
    digitalWrite(SWITCH_PIN_R, LOW);
}

void turnOffLed()
{
    digitalWrite(TEST_LED, LOW);
}

void turnOffAll()
{
    digitalWrite(SWITCH_PIN_G, LOW);
    digitalWrite(SWITCH_PIN_R, LOW);
    digitalWrite(TEST_LED, LOW);
}

void turnOnGreen()
{
    digitalWrite(TEST_LED, HIGH);
    digitalWrite(SWITCH_PIN_G, HIGH);
}

void turnOnRed()
{
    digitalWrite(TEST_LED, HIGH);
    digitalWrite(SWITCH_PIN_R, HIGH);
}

void loop()
{
    if (Serial.available() > 0)
    {
        String data = Serial.readStringUntil('\n');
        digitalWrite(TEST_LED, HIGH);

        bool r = data.indexOf("R") != -1;
        bool g = data.indexOf("G") != -1;

        if (g)
            turnOnGreen();
        else
            turnOffGreen();

        if (r)
            turnOnRed();
        else
            turnOffRed();

        if (!g && !r)
            turnOffLed();
    }
    else
        turnOffAll();

    delay(LOOP_TIME);
}