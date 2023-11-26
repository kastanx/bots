const robot = require("robotjs");
const MARK_OF_GRACE = 11849;
const { RUN_COORDS, INV_COORDS, TOP_OFFSET } = require("./config.js");

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
  { x: 2719, y: 3499, z: 3 },
  { x: 2719, y: 3488, z: 3 },
  { x: 2733, y: 3488, z: 3 },
  { x: 2733, y: 3500, z: 3 },
  { x: 2719, y: 3500, z: 3 },
]);

const secondArea = new Area([
  { x: 2703, y: 3500, z: 2 },
  { x: 2716, y: 3500, z: 2 },
  { x: 2716, y: 3485, z: 2 },
  { x: 2703, y: 3485, z: 2 },
]);

const thirdArea = new Area([
  { x: 2707, y: 3484, z: 2 },
  { x: 2707, y: 3475, z: 2 },
  { x: 2719, y: 3475, z: 2 },
  { x: 2719, y: 3484, z: 2 },
]);

const fourthArea = new Area([
  { x: 2697, y: 3479, z: 3 },
  { x: 2707, y: 3479, z: 3 },
  { x: 2707, y: 3475, z: 3 },
  { x: 2719, y: 3475, z: 3 },
  { x: 2719, y: 3468, z: 3 },
  { x: 2697, y: 3468, z: 3 },
]);

const fifthArea = new Area([
  { x: 2688, y: 3468, z: 2 },
  { x: 2705, y: 3468, z: 2 },
  { x: 2705, y: 3457, z: 2 },
  { x: 2688, y: 3457, z: 2 },
]);

const finalArea = new Area([
  { x: 2728, y: 3475, z: 0 },
  { x: 2728, y: 3454, z: 0 },
  { x: 2685, y: 3454, z: 0 },
  { x: 2685, y: 3475, z: 0 },
]);

const failArea = new Area([
  { x: 2704, y: 3500, z: 0 },
  { x: 2720, y: 3500, z: 0 },
  { x: 2720, y: 3482, z: 0 },
  { x: 2704, y: 3482, z: 0 },
]);

const MARK_OF_GRACE_AREAS = [
  firstArea,
  secondArea,
  thirdArea,
  fourthArea,
  fifthArea,
  finalArea,
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

const getInv = async () => {
  const response = await fetch(`http://localhost:8080/inv`, {
    method: "GET",
  }).catch(console.log);
  return response.json();
};

function getObject(id, objects) {
  return objects.find((object) => object.id === id);
}

async function loop() {
  while (true) {
    try {
      const { status, groundItems } = await getData(0, 0, 0, 0, MARK_OF_GRACE);

      if (status?.gameState === "LOGIN_SCREEN") {
        log("exiting process");
        process.exit();
      }

      if (groundItems.length) {
        const { tileX, tileY, tileZ } = groundItems[0];
        if (
          isInMarkLocation(
            status.playerX,
            status.playerY,
            status.playerZ,
            tileX,
            tileY,
            tileZ
          )
        ) {
          await moveMouseClick(groundItems[0]?.x, groundItems[0]?.y);
          log("picking mark of grace");
          await sleep(1000);
          continue;
        }
      }

      if (status?.hp < 4) {
        const inv = await getInv();

        for (const [index, value] of inv.entries()) {
          if (value.id === 7220 || value.id === 7218) {
            await moveMouseClick(
              INV_COORDS[index]?.x,
              INV_COORDS[index]?.y - TOP_OFFSET
            );
            log("eating");
            await sleep(1000);
            break;
          }
        }

        log("waiting for health");
        continue;
      }

      if (!status?.isRunning && status?.runEnergy === 10000) {
        await moveMouseClick(RUN_COORDS[0], RUN_COORDS[1]);
        log("turning run on");
        await sleep(200);
      }

      if (!status?.moving2 && firstArea.contains(status)) {
        const { gameObjects } = await getData(14928);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to second area");
        await waitForXpDrop();
      } else if (!status?.moving2 && secondArea.contains(status)) {
        const { gameObjects } = await getData(14932);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to third area");
        await waitForXpDrop();
      } else if (!status?.moving2 && thirdArea.contains(status)) {
        const { gameObjects } = await getData(14929);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fourth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && fourthArea.contains(status)) {
        const { gameObjects } = await getData(14930);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fifth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && fifthArea.contains(status)) {
        const { gameObjects } = await getData(14931);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to final area");
        await waitForXpDrop();
      } else if (!status?.moving2 && finalArea.contains(status)) {
        const { status } = await getData(0, 2725, 3477, 0);
        await moveMouseClick(status?.tileX, status?.tileY, 10);
        log("going to start tile");
        await sleep(500);
      } else if (!status?.moving2 && failArea.contains(status)) {
        const { status } = await getData(0, 2724, 3485, 0);
        await moveMouseClick(status?.tileX, status?.tileY, 10);
        log("going to start tile from fail area");
        await sleep(500);
      } else if (!status?.moving2) {
        const { gameObjects } = await getData(14927);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to first area");
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
