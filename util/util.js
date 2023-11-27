import robot from "robotjs";
import { TOP_OFFSET } from "../config.js";
import { getData } from "./api.js";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomCoordinatesWithinRadius(x, y, radius) {
  const angle = Math.random() * Math.PI * 2;

  const randomX = x + radius * Math.cos(angle);
  const randomY = y + radius * Math.sin(angle);

  return { x: randomX, y: randomY };
}

export async function moveMouseClick(x, y, radius = 5) {
  const randomCoords = randomCoordinatesWithinRadius(x, y, radius);
  robot.moveMouse(randomCoords.x, randomCoords.y + TOP_OFFSET);
  await sleep(100);
  robot.moveMouseSmooth(randomCoords.x + 1, randomCoords.y + TOP_OFFSET + 1);
  robot.mouseClick("left");
}

export async function waitForAgilityXpDrop(waittime = 200) {
  const { status: ogStatus } = await getData();
  await waitFor(async () => {
    const { status } = await getData();
    return status.agilityXp !== ogStatus.agilityXp;
  });
  await sleep(waittime);
}

function waitFor(callback) {
  return new Promise((resolve) => {
    const int = setInterval(async () => {
      const condition = await callback();
      if (condition) {
        clearInterval(int);
        resolve(true);
      }
    }, 10);
    setTimeout(() => {
      resolve(true);
      clearInterval(int);
    }, 5000);
  });
}

export function pointInPolygon(x, y, z, polygon) {
  if (z !== polygon[0].z) {
    return false;
  }

  const numVertices = polygon.length;

  let inside = false;

  for (let i = 0, j = numVertices - 1; i < numVertices; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

export function log(data) {
  const date = new Date();
  const logstring = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${data}`;
  console.log(logstring);
}

export function isInMarkLocation(
  playerX,
  playerY,
  playerZ,
  markX,
  markY,
  markZ,
  areas
) {
  const currentArea = areas.find((area) =>
    area.contains({ playerX, playerY, playerZ })
  );

  const markLocation = areas.find((area) =>
    area.contains({ playerX: markX, playerY: markY, playerZ: markZ })
  );

  return currentArea === markLocation;
}
