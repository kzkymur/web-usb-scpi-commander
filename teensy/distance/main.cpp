/* This example shows how to get single-shot range
 measurements from the VL53L0X. The sensor can optionally be
 configured with different ranging profiles, as described in
 the VL53L0X API user manual, to get better performance for
 a certain application. This code is based on the four
 "SingleRanging" examples in the VL53L0X API.

 The range readings are in units of mm. */

#include <Wire.h>
#include <Arduino.h>
#include <VL53L0X.h>

VL53L0X sensor;


// Uncomment this line to use long range mode. This
// increases the sensitivity of the sensor and extends its
// potential range, but increases the likelihood of getting
// an inaccurate reading because of reflections from objects
// other than the intended target. It works best in dark
// conditions.

#define LONG_RANGE


// Uncomment ONE of these two lines to get
// - higher speed at the cost of lower accuracy OR
// - higher accuracy at the cost of lower speed

//#define HIGH_SPEED
#define HIGH_ACCURACY


#define I2C_SDA_PIN (17)
#define I2C_SCL_PIN (16)
#define SWITCH_PIN_R (10)
#define SWITCH_PIN_G (11)
#define SWITCH_PIN_B (12)
#define SWITCH_PIN_IR (14)
#define TEST_LED (13)

// LOOP_TIME > SENSING_TIME
#define LOOP_TIME (500)
#define SENSING_TIME (210)
#define LED_FLUSHING_TIME (60000) // it is a multiple of LOOP_TIME

int led_flush_counter = 0;

void setup()
{
  pinMode(SWITCH_PIN_R, OUTPUT);
  pinMode(SWITCH_PIN_G, OUTPUT);
  pinMode(SWITCH_PIN_B, OUTPUT);
  pinMode(SWITCH_PIN_IR, OUTPUT);
  
  pinMode(TEST_LED, OUTPUT);

  Serial.begin(9600);

  Wire1.setSDA(I2C_SDA_PIN);
  Wire1.setSCL(I2C_SCL_PIN);

  Wire1.begin();

  delay(500);
//   sensor.setBus(&Wire1);
//   sensor.setTimeout(500);
//   if (!sensor.init())
//   {
//     Serial.println("Failed to detect and initialize sensor!");
//     while (1) {}
//   }

// #if defined LONG_RANGE
//   // lower the return signal rate limit (default is 0.25 MCPS)
//   sensor.setSignalRateLimit(0.1);
//   // increase laser pulse periods (defaults are 14 and 10 PCLKs)
//   sensor.setVcselPulsePeriod(VL53L0X::VcselPeriodPreRange, 18);
//   sensor.setVcselPulsePeriod(VL53L0X::VcselPeriodFinalRange, 14);
// #endif

// #if defined HIGH_SPEED
//   // reduce timing budget to 20 ms (default is about 33 ms)
//   sensor.setMeasurementTimingBudget(20000);
// #elif defined HIGH_ACCURACY
//   // increase timing budget to 200 ms
//   sensor.setMeasurementTimingBudget(200000);
// #endif
}

void loop()
{
  if (led_flush_counter > LED_FLUSHING_TIME / LOOP_TIME) {
      led_flush_counter = 0;
      digitalWrite(TEST_LED, LOW);
      digitalWrite(SWITCH_PIN_G, LOW);
      Serial.println("END");
  } else if (led_flush_counter > 0) {
      led_flush_counter++;
    } else if (Serial.available() > 0 ) {
        String data = Serial.readStringUntil('\n');

        if (data == "S") {
            Serial.println("START");
            led_flush_counter = 1;
            digitalWrite(TEST_LED, HIGH);
            digitalWrite(SWITCH_PIN_G, HIGH);
        }
    }

  // Serial.print(sensor.readRangeSingleMillimeters());
  // if (sensor.timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  // Serial.println();

  delay(LOOP_TIME - SENSING_TIME);
}