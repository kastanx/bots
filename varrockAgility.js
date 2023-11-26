const robot = require("robotjs");
const { RUN_COORDS, TOP_OFFSET } = require("./config.js");
const MARK_OF_GRACE = 11849;

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
  { x: 3212, y: 3421, z: 3 },
  { x: 3221, y: 3421, z: 3 },
  { x: 3221, y: 3408, z: 3 },
  { x: 3212, y: 3408, z: 3 },
]);

const secondArea = new Area([
  { x: 3200, y: 3421, z: 3 },
  { x: 3211, y: 3421, z: 3 },
  { x: 3211, y: 3410, z: 3 },
  { x: 3200, y: 3410, z: 3 },
]);

const thirdArea = new Area([
  { x: 3199, y: 3418, z: 1 },
  { x: 3199, y: 3415, z: 1 },
  { x: 3191, y: 3415, z: 1 },
  { x: 3191, y: 3418, z: 1 },
]);

const fourthArea = new Area([
  { x: 3190, y: 3408, z: 3 },
  { x: 3200, y: 3408, z: 3 },
  { x: 3200, y: 3401, z: 3 },
  { x: 3190, y: 3401, z: 3 },
]);

const fifthArea = new Area([
  { x: 3201, y: 3404, z: 3 },
  { x: 3201, y: 3400, z: 3 },
  { x: 3180, y: 3400, z: 3 },
  { x: 3180, y: 3380, z: 3 },
  { x: 3191, y: 3380, z: 3 },
  { x: 3191, y: 3385, z: 3 },
  { x: 3198, y: 3385, z: 3 },
  { x: 3198, y: 3389, z: 3 },
  { x: 3202, y: 3392, z: 3 },
  { x: 3210, y: 3392, z: 3 },
  { x: 3210, y: 3405, z: 3 },
  { x: 3201, y: 3405, z: 3 },
]);

const sixthArea = new Area([
  { x: 3213, y: 3404, z: 3 },
  { x: 3213, y: 3391, z: 3 },
  { x: 3234, y: 3391, z: 3 },
  { x: 3234, y: 3405, z: 3 },
  { x: 3213, y: 3405, z: 3 },
]);

const seventhArea = new Area([
  { x: 3235, y: 3409, z: 3 },
  { x: 3242, y: 3409, z: 3 },
  { x: 3242, y: 3401, z: 3 },
  { x: 3235, y: 3401, z: 3 },
]);

const eisghtArea = new Area([
  { x: 3235, y: 3409, z: 3 },
  { x: 3242, y: 3409, z: 3 },
  { x: 3242, y: 3419, z: 3 },
  { x: 3235, y: 3419, z: 3 },
]);

const failArea = new Area([
  { x: 3183, y: 3429, z: 0 },
  { x: 3197, y: 3429, z: 0 },
  { x: 3197, y: 3419, z: 0 },
  { x: 3199, y: 3419, z: 0 },
  { x: 3201, y: 3414, z: 0 },
  { x: 3200, y: 3399, z: 0 },
  { x: 3183, y: 3400, z: 0 },
]);

const MARK_OF_GRACE_AREAS = [
  firstArea,
  secondArea,
  thirdArea,
  fourthArea,
  fifthArea,
  sixthArea,
  seventhArea,
  eisghtArea,
];

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

const getData = async (
  id = 0,
  tileX = 0,
  tileY = 0,
  tileZ = 0,
  tileItemId = 0
) => {
  const response = await fetch(
    `http://localhost:8080/test?id=${id}&tileX=${tileX}&tileY=${tileY}&tileZ=${tileZ}&tileItemId=${tileItemId}`,
    {
      method: "GET",
    }
  ).catch(console.log);
  return response.json();
};

function getObject(id, objects) {
  return objects.find((object) => object.id === id);
}

async function loop() {
  while (true) {
    try {
      const { status, groundItems } = await getData(0, 0, 0, 0, MARK_OF_GRACE);

      if (status?.hp < 4) {
        log("waiting for health");
        continue;
      }

      if (!status?.isRunning && status?.runEnergy === 10000) {
        await moveMouseClick(RUN_COORDS[0], RUN_COORDS[1]);
        await sleep(200);
      }

      if (!status?.moving2 && firstArea.contains(status)) {
        const { gameObjects } = await getData(14413);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
      } else if (!status?.moving2 && secondArea.contains(status)) {
        const { gameObjects } = await getData(14414);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
      } else if (!status?.moving2 && thirdArea.contains(status)) {
        const { gameObjects } = await getData(14832);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
      } else if (!status?.moving2 && fourthArea.contains(status)) {
        const { gameObjects } = await getData(14833);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
      } else if (!status?.moving2 && fifthArea.contains(status)) {
        const { gameObjects } = await getData(14834);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
      } else if (!status?.moving2 && sixthArea.contains(status)) {
        const { gameObjects } = await getData(14835);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
      } else if (!status?.moving2 && seventhArea.contains(status)) {
        const { gameObjects } = await getData(14836);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
      } else if (!status?.moving2 && eisghtArea.contains(status)) {
        const { gameObjects } = await getData(14841);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(200);
      } else if (!status?.moving2 && failArea.contains(status)) {
        const { status } = await getData(0, 3207, 3409, 0);
        await moveMouseClick(status?.tileX, status?.tileY);
      } else if (!status?.moving2) {
        const { gameObjects } = await getData(14412);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop();
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

async function waitForXpDrop(waittime = 200) {
  const { status: ogStatus } = await getData();
  await waitFor(async () => {
    const { status } = await getData();
    return status.agilityXp !== ogStatus.agilityXp;
  });
  await sleep(waittime);
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
    }, 10);
    setTimeout(() => {
      resolve(true);
      clearInterval(int);
    }, 5000);
  });
}

function isInMarkLocation(playerX, playerY, playerZ, markX, markY, markZ) {
  const currentArea = MARK_OF_GRACE_AREAS.find((area) =>
    area.contains({ playerX, playerY, playerZ })
  );

  const markLocation = MARK_OF_GRACE_AREAS.find((area) =>
    area.contains({ playerX: markX, playerY: markY, playerZ: markZ })
  );

  return currentArea === markLocation;
}

function log(data) {
  const date = new Date();
  const logstring = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${data}`;
  console.log(logstring);
}

setTimeout(loop, 3000);
// loop();
