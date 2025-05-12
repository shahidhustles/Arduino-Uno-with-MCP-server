# Chotu Robot

A Johnny-Five powered robot controlled through Claude's Model Context Protocol (MCP).

## Prerequisites

- Node.js (v14 or newer)
- Arduino Board (connected via USB)
- Visual Studio C++ Desktop Tools (required for node-gyp)
  - Download link: https://visualstudio.microsoft.com/visual-cpp-build-tools/
  - During installation, make sure to select "Desktop development with C++"

## Installation & Setup

1. Clone this repository or download the source code

2. Install dependencies:
   ```
   npm i
   ```

3. Compile TypeScript:
   ```
   npx tsc
   ```

4. Create build folder and move compiled JavaScript:
   ```
   mkdir build
   move src\*.js build\
   ```

5. Edit Claude Desktop config file at:
   `C:\Users\<YourUsername>\AppData\Roaming\Claude\claude_desktop_config.json`

   Add the following configuration:
   ```json
   {
     "mcpServers": {
       "choturoboserver": {
         "command": "node",
         "args": ["D:\\ae-cp\\build\\choturobo.js"]
       }
     }
   }
   ```

   Note: Adjust the path if you installed the project in a different location.

6. Connect your Arduino board to your computer via USB

7. Start Claude and begin prompting

## Hardware Setup

Connect the following components to your Arduino:

1. **LED (Eyes)**: 
   - Connect to pin 10
   - Anode (+) to pin 10 through a 220Ω resistor
   - Cathode (-) to GND

2. **Buzzer**:
   - Connect to pin 12
   - Positive (+) to pin 12
   - Negative (-) to GND

3. **DC Motor**:
   - Connect to pins 6 and 7 via a motor driver (L298N or similar)
   - PWM pin 6 for speed control
   - DIR pin 7 for direction control
   - Connect motor driver to external power source as needed

4. **Servo Motor**:
   - Connect to pin 5
   - Red wire to 5V
   - Black/Brown wire to GND
   - Yellow/Orange/White signal wire to pin 5

5. **Fan** (LED or actual small fan):
   - Connect to pin 4
   - Positive (+) to pin 4 (through transistor if using actual fan)
   - Negative (-) to GND

6. **Relay**:
   - Connect to pin 3
   - VCC to 5V
   - GND to GND
   - IN to pin 3

7. **Temperature Sensor** (e.g., TMP36 or similar):
   - Connect to analog pin A0
   - VCC to 5V
   - GND to GND
   - Signal to A0

8. **Ultrasonic Sensor** (e.g., HC-SR04):
   - Connect to analog pin A1
   - VCC to 5V
   - GND to GND
   - Signal/Echo to A1

## Example Prompts

### Basic Prompts

Use these prompts to interact with Chotu Robot's predefined actions:

- "Start Chotu" - Initializes Chotu robot
- "Stop Chotu" - Safely stops all operations
- "Move Chotu forward 10 steps" - Moves the robot forward
- "Turn Chotu left" - Turns the robot to the left
- "Turn Chotu right" - Turns the robot to the right
- "Set Chotu's speed to fast" - Changes movement speed

### Component-Specific Prompts

#### LED (Eyes)
- "Make Chotu blink eyes for 3 seconds"
- "Can Chotu show me a light pattern with its eyes?"
- "Flash Chotu's eyes twice"

#### Buzzer
- "Make Chotu buzz for 2 seconds"
- "Can Chotu make an alarm sound?"
- "Play a short beep on Chotu"

#### Motor
- "Run Chotu's motor at half speed"
- "Can you make Chotu's wheels move forward for 5 seconds?"
- "Activate Chotu's motors at maximum speed"

#### Servo
- "Move Chotu's servo to 90 degrees"
- "Can you make Chotu look up by moving its servo?"
- "Position Chotu's arm at 45 degrees"

#### Fan
- "Turn Chotu's fan on"
- "Can you activate Chotu's cooling system?"
- "Turn off Chotu's fan"

#### Relay
- "Turn on Chotu's relay"
- "Can you activate Chotu's power circuit?"
- "Switch off Chotu's relay"

#### Temperature Sensor
- "What's the current temperature?"
- "Can Chotu tell me how hot it is?"
- "Check the room temperature with Chotu"

#### Ultrasonic Sensor
- "How far is the object in front of Chotu?"
- "Can Chotu detect any obstacles ahead?"
- "Measure the distance to the nearest object"

### Combined Actions

- "Make Chotu do a light and sound show"
- "Can Chotu turn around while making noise?"
- "Have Chotu detect objects while blinking its eyes"
- "Make Chotu check the temperature while running its fan"

## Port Configuration

By default, the Arduino is configured to connect to `COM7`. If your Arduino is connected to a different port:

1. Check your Arduino's port in the Arduino IDE or Device Manager
2. Update the port in `src/choturobo.ts`:
   ```typescript
   board = new Board({ repl: false, debug: false, port: "YOUR_COM_PORT" });
   ```

## Troubleshooting

- If you encounter node-gyp build errors, make sure Visual Studio C++ Desktop Tools are properly installed
- Verify that your Arduino board is properly connected and recognized by your computer
- Check the correct port is being used in the code for your Arduino connection
- If components aren't responding, double-check your wiring connections
- For motor or servo issues, ensure you have proper power supply connected

## License

MIT