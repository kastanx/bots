const robot = require("robotjs");
const TOP_OFFSET = 70;

class Area {
  points;
  constructor(points) {
    this.points = points;
  }

  contains(status) {
    return pointInPolygon(
      status.playerX,
      status.playerY,
      status.playerZ,
      this.points
    );
  }
}

const firstArea = new Area([
  { x: 2469, y: 3431, z: 0 },
  { x: 2479, y: 3431, z: 0 },
  { x: 2479, y: 3424, z: 0 },
  { x: 2469, y: 3424, z: 0 },
]);

const secondArea = new Area([
  { x: 2468, y: 3426, z: 1 },
  { x: 2480, y: 3426, z: 1 },
  { x: 2480, y: 3420, z: 1 },
  { x: 2468, y: 3420, z: 1 },
]);

const thirdArea = new Area([
  { x: 2468, y: 3425, z: 2 },
  { x: 2480, y: 3425, z: 2 },
  { x: 2480, y: 3413, z: 2 },
  { x: 2468, y: 3413, z: 2 },
]);

const fourthArea = new Area([
  { x: 2480, y: 3424, z: 2 },
  { x: 2480, y: 3414, z: 2 },
  { x: 2494, y: 3414, z: 2 },
  { x: 2494, y: 3425, z: 2 },
  { x: 2480, y: 3425, z: 2 },
]);

const fifthArea = new Area([
  { x: 2480, y: 3426, z: 0 },
  { x: 2490, y: 3426, z: 0 },
  { x: 2490, y: 3418, z: 0 },
  { x: 2480, y: 3418, z: 0 },
]);

console.log(fifthArea.contains({ playerX: 2483, playerY: 3425, playerZ: 0 }));

const sixthArea = new Area([
  { x: 2482, y: 3428, z: 0 },
  { x: 2482, y: 3432, z: 0 },
  { x: 2490, y: 3432, z: 0 },
  { x: 2490, y: 3428, z: 0 },
]);

const seventhArea = new Area([
  { x: 2481, y: 3439, z: 0 },
  { x: 2489, y: 3439, z: 0 },
  { x: 2489, y: 3435, z: 0 },
  { x: 2481, y: 3435, z: 0 },
]);

function pointInPolygon(x, y, z, polygon) {
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

const getData = async (id = 0, tileX = 0, tileY = 0, tileZ = 0) => {
  const response = await fetch(
    `http://localhost:8080/test?id=${id}&tileX${tileX}&tileY${tileY}&tileZ${tileZ}`,
    {
      method: "GET",
    }
  ).catch();
  return response.json();
};

function getObject(id, objects) {
  return objects.find((object) => object.id === id);
}

async function loop() {
  while (true) {
    try {
      const { status } = await getData();

      if (!status?.moving2 && firstArea.contains(status)) {
        const { gameObjects } = await getData(23134);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(secondArea);
      } else if (!status?.moving2 && secondArea.contains(status)) {
        const { gameObjects } = await getData(23559);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(thirdArea);
      } else if (!status?.moving2 && thirdArea.contains(status)) {
        const { gameObjects } = await getData(23557);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(fourthArea);
      } else if (!status?.moving2 && fourthArea.contains(status)) {
        const { gameObjects } = await getData(23560);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(fifthArea);
      } else if (!status?.moving2 && fifthArea.contains(status)) {
        const { gameObjects } = await getData(23135);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(sixthArea);
      } else if (!status?.moving2 && sixthArea.contains(status)) {
        const { gameObjects } = await getData(23138);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(seventhArea);
      } else if (!status?.moving2) {
        const { gameObjects } = await getData(23145);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(firstArea);
      }
    } catch (error) {}

    await sleep(300);
  }
}

function randomCoordinatesWithinRadius(x, y, radius) {
  // Generate a random angle between 0 and 2 * PI (360 degrees)
  const angle = Math.random() * Math.PI * 2;

  // Calculate random coordinates within the circle using polar coordinates
  const randomX = x + radius * Math.cos(angle);
  const randomY = y + radius * Math.sin(angle);

  return { x: randomX, y: randomY };
}

async function waitForXpDrop() {
  const { status: ogStatus } = await getData();
  await waitFor(async () => {
    const { status } = await getData();
    return status.agilityXp !== ogStatus.agilityXp;
  });
}

async function waitForNewArea(area) {
  return waitFor(async () => {
    const { status } = await getData();
    return area.contains(status);
  });
}

async function moveMouseClick(x, y, radius = 5) {
  const randomCoords = randomCoordinatesWithinRadius(x, y, radius);
  robot.moveMouse(randomCoords.x, randomCoords.y + TOP_OFFSET);
  await sleep(100);
  robot.moveMouseSmooth(randomCoords.x + 1, randomCoords.y + TOP_OFFSET + 1);
  robot.mouseClick("left");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitFor(callback) {
  return new Promise((resolve) => {
    const int = setInterval(async () => {
      const condition = await callback();
      if (condition) {
        clearInterval(int);
        resolve(true);
      }
    }, 100);
    setTimeout(() => {
      resolve(true);
      clearInterval(int);
    }, 5000);
  });
}

setTimeout(loop, 3000);
// loop();
setTimeout(() => {
  process.exit();
}, 1000 * 60 * 60 * 2);
