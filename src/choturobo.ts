import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pkg from "johnny-five";

const { Board, Led, Servo, Motor, Relay, Sensor } = pkg;

const server = new McpServer({
  name: "ChotuRoboServer",
  version: "1.0.0",
});

let board: any;

let buzzer: InstanceType<typeof Led>;
let eyes: InstanceType<typeof Led>;
let motor: InstanceType<typeof Motor>;
let servo: InstanceType<typeof Servo>;
let fan: InstanceType<typeof Led>;
let relay: InstanceType<typeof Relay>;
let temperatureSensor: InstanceType<typeof Sensor>;
let ultrasonicSensor: InstanceType<typeof Sensor>;

async function blinkLED<T>(time: number): Promise<T | null> {
  return new Promise((resolve) => {
    eyes.blink(500);
    setTimeout(() => {
      eyes.stop().off();
      resolve("done" as T);
    }, time * 1000);
  });
}

async function buzz<T>(time: number): Promise<T | null> {
  return new Promise((resolve) => {
    buzzer.on();
    setTimeout(() => {
      buzzer.off();
      resolve("done" as T);
    }, time * 1000);
  });
}

server.tool("chotuBlinkEyes", { time: z.number() }, async ({ time }) => {
  await blinkLED(time);
  return {
    content: [
      { type: "text", text: `I am blinking the eyes of Chotu for ${time} ms` },
    ],
  };
});

server.tool("chotuBuzzSound", { time: z.number() }, async ({ time }) => {
  await buzz(time);
  return {
    content: [{ type: "text", text: `I am buzzing Chotu for ${time} ms` }],
  };
});

server.tool("runMotor", { speed: z.number() }, async ({ speed }) => {
  motor.start(speed);
  setTimeout(() => motor.stop(), 5000);
  return {
    content: [{ type: "text", text: `Motor running at speed ${speed}.` }],
  };
});

server.tool("moveServo", { angle: z.number() }, async ({ angle }) => {
  servo.to(angle);
  return {
    content: [{ type: "text", text: `Servo moved to ${angle} degrees.` }],
  };
});

server.tool("controlFan", { state: z.boolean() }, async ({ state }) => {
  state ? fan.on() : fan.off();
  return {
    content: [{ type: "text", text: `Fan turned ${state ? "on" : "off"}.` }],
  };
});

server.tool("toggleRelay", { state: z.boolean() }, async ({ state }) => {
  state ? relay.open() : relay.close();
  return {
    content: [
      { type: "text", text: `Relay switched ${state ? "ON" : "OFF"}.` },
    ],
  };
});

server.tool("readTemperature", {}, async () => {
  const temp = temperatureSensor.value;
  return {
    content: [{ type: "text", text: `Current temperature: ${temp}°C.` }],
  };
});

server.tool("readDistance", {}, async () => {
  const distance = ultrasonicSensor.raw;
  return {
    content: [{ type: "text", text: `Detected object at ${distance} cm.` }],
  };
});

server.prompt("move-chotu", { steps: z.string() }, ({ steps }) => ({
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: `I will move Chotu this many steps:\n\n${steps}`,
      },
    },
  ],
}));

server.prompt("start-chotu", {}, () => ({
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: "Initializing Chotu and getting ready to operate.",
      },
    },
  ],
}));

server.prompt("stop-chotu", {}, () => ({
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: "Stopping Chotu safely and shutting down operations.",
      },
    },
  ],
}));

server.prompt(
  "turn-chotu",
  { direction: z.enum(["left", "right"]) },
  ({ direction }) => ({
    messages: [
      {
        role: "user",
        content: { type: "text", text: `Turning Chotu to the ${direction}.` },
      },
    ],
  })
);

server.prompt("set-chotu-speed", { speed: z.string() }, ({ speed }) => ({
  messages: [
    {
      role: "user",
      content: { type: "text", text: `Setting Chotu's speed to ${speed}.` },
    },
  ],
}));

async function main() {
  board = new Board({ repl: false, debug: false, port: "COM7" });

  board.on("ready", async () => {
    // Initialize all hardware components once
    buzzer = new Led(12);
    eyes = new Led(10);
    motor = new Motor({ pins: { pwm: 6, dir: 7 } });
    servo = new Servo(5);
    fan = new Led(4);
    relay = new Relay(3);
    temperatureSensor = new Sensor("A0");
    ultrasonicSensor = new Sensor("A1");

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Chotu Robo Running");
  });

  board.on("error", (error: unknown) => {
    console.error("Board error:", error);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
