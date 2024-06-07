#include <Arduino.h>
#include <Seeed_MCP9600.h>
#include <Wire.h>

#define SWITCH_PIN (2)
#define PWM_OUT_PIN_IR (3)
#define PWM_OUT_PIN_R (4)
#define PWM_OUT_PIN_G (5)
#define PWM_OUT_PIN_B (6)
#define SWITCH_PIN_R (10)
#define SWITCH_PIN_G (11)
#define SWITCH_PIN_B (12)
#define SWITCH_PIN_IR (14)
#define I2C_ADDRS (0x60)
#define TEST_LED (13)

#define I2C_SDA_PIN (19)
#define I2C_SCL_PIN (18)

String buffer = "";
MCP9600 mpc9600;

err_t setupMpc9600() {
    err_t ret = NO_ERROR;
    CHECK_RESULT(ret, mpc9600.set_filt_coefficients(FILT_MID));
    CHECK_RESULT(ret, mpc9600.set_cold_junc_resolution(COLD_JUNC_RESOLUTION_0_25));
    CHECK_RESULT(ret, mpc9600.set_ADC_meas_resolution(ADC_14BIT_RESOLUTION));
    CHECK_RESULT(ret, mpc9600.set_burst_mode_samp(BURST_32_SAMPLE));
    CHECK_RESULT(ret, mpc9600.set_sensor_mode(NORMAL_OPERATION));
    return ret;
}

err_t getTemperature(float* value) {
    err_t ret = NO_ERROR;
    float hot_junc = 0;
    float junc_delta = 0;
    float cold_junc = 0;
    CHECK_RESULT(ret, mpc9600.read_hot_junc(&hot_junc));
    CHECK_RESULT(ret, mpc9600.read_junc_temp_delta(&junc_delta));

    CHECK_RESULT(ret, mpc9600.read_cold_junc(&cold_junc));
    *value = hot_junc;
    return ret;
}

uint count = 0;

int getCycle(uint cycle) {
    return count % cycle * (100 / (cycle - 1));
}
int zero100ToZero255(uint v) {
    return (uint8_t)((float)v / 100 * 255);
}

void setup() {
    Serial.begin(9600);
    pinMode(SWITCH_PIN, OUTPUT);
    pinMode(SWITCH_PIN_R, OUTPUT);
    pinMode(SWITCH_PIN_G, OUTPUT);
    pinMode(SWITCH_PIN_B, OUTPUT);
    pinMode(SWITCH_PIN_IR, OUTPUT);
    
    pinMode(PWM_OUT_PIN_IR, OUTPUT);
    pinMode(PWM_OUT_PIN_R, OUTPUT);
    pinMode(PWM_OUT_PIN_G, OUTPUT);
    pinMode(PWM_OUT_PIN_B, OUTPUT);
    pinMode(TEST_LED, OUTPUT);

    analogWriteFrequency(PWM_OUT_PIN_IR, 200000);
    analogWriteFrequency(PWM_OUT_PIN_R, 375000);
    analogWriteFrequency(PWM_OUT_PIN_G, 375000);
    analogWriteFrequency(PWM_OUT_PIN_B, 375000);

    digitalWrite(SWITCH_PIN, LOW);

    Wire.setSDA(I2C_SDA_PIN);
    Wire.setSCL(I2C_SCL_PIN);
    
    setupMpc9600();
}

void loop() {
    count ++;
    digitalWrite(SWITCH_PIN, LOW);
    digitalWrite(SWITCH_PIN_R, LOW);
    digitalWrite(SWITCH_PIN_G, HIGH);
    digitalWrite(SWITCH_PIN_B, LOW);
    digitalWrite(SWITCH_PIN_IR, LOW);
    
    // uint8_t ir = zero100ToZero255(getCycle(5));
    uint8_t ir = zero100ToZero255(99);
    analogWrite(PWM_OUT_PIN_IR, ir);
    // analogWrite(SWITCH_PIN_R, ir);
    // uint8_t r = zero100ToZero255(getCycle(10));
    // analogWrite(PWM_OUT_PIN_R, r);
    // uint8_t g = zero100ToZero255(getCycle(20));
    // analogWrite(PWM_OUT_PIN_G, g);
    // uint8_t b = zero100ToZero255(getCycle(30));
    // analogWrite(PWM_OUT_PIN_B, b);

    analogWrite(TEST_LED, ir);

    // Serial.print("output: ");
    // Serial.print(ir);
    // Serial.print(", ");
    // Serial.print(r);
    // Serial.print(", ");
    // Serial.print(g);
    // Serial.print(", ");
    // Serial.print(b);
    // Serial.print('\n');

    float temp = 0;
    getTemperature(&temp);
    Serial.print(temp);
    Serial.print("\n");
    delay(100);
}
