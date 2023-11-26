const robot = require("robotjs");
const IRON_ORE = 440;
const IRON_OBJECT = 11364;
const IRON_OBJECT_2 = 11365;
const MINING_SPOT_TILE = [2692, 3329, 0];

const { INV_COORDS, TOP_OFFSET } = require("./config.js");
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

const miningArea = new Area([
  { x: 2687, y: 3341, z: 0 },
  { x: 2688, y: 3329, z: 0 },
  { x: 2691, y: 3325, z: 0 },
  { x: 2718, y: 3325, z: 0 },
  { x: 2718, y: 3339, z: 0 },
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

async function loop() {
  while (true) {
    try {
      const { status, gameObjects } = await getData(
        [IRON_OBJECT, IRON_OBJECT_2].join(","),
        MINING_SPOT_TILE[0],
        MINING_SPOT_TILE[1],
        MINING_SPOT_TILE[2]
      );

      const inv = await getInv();

      if (status?.gameState === "LOGIN_SCREEN") {
        log("exiting process");
        process.exit();
      }

      if (isInventoryFull(inv)) {
        for (const [index, value] of inv.entries()) {
          if (value.id === IRON_ORE) {
            await moveMouseClick(
              INV_COORDS[index]?.x,
              INV_COORDS[index]?.y - TOP_OFFSET
            );
            log("dropping ore");
            await sleep(100);
          }
        }
      }

      if (miningArea.contains(status)) {
        log("inside mining area");
        if (
          status.playerX !== MINING_SPOT_TILE[0] ||
          status.playerY !== MINING_SPOT_TILE[1] ||
          status.playerZ !== MINING_SPOT_TILE[2]
        ) {
          await moveMouseClick(status?.tileX, status?.tileY, 5);
          log("going to mining spot");
          await sleep(2000);
        } else if (
          status.playerX === MINING_SPOT_TILE[0] &&
          status.playerY === MINING_SPOT_TILE[1] &&
          status.playerZ === MINING_SPOT_TILE[2]
        ) {
          await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
          log("trying to mine ore");
          await waitForXpDrop(0);
        }
      } else {
        log("outside of mining area, exiting");
        process.exit();
      }
    } catch (error) {
      log(error);
    }

    await sleep(300);
  }
}

function isInventoryFull(inventory) {
  const emptySpace = !!inventory?.find((item) => item.id === -1);

  if (inventory?.length !== 28) {
    return false;
  }
  return !emptySpace;
}

function randomCoordinatesWithinRadius(x, y, radius) {
  const angle = Math.random() * Math.PI * 2;
  const randomX = x + radius * Math.cos(angle);
  const randomY = y + radius * Math.sin(angle);

  return { x: randomX, y: randomY };
}

async function waitForXpDrop(waittime = 200) {
  const { status: ogStatus } = await getData();
  await waitFor(async () => {
    const { status } = await getData();
    return status.miningXp !== ogStatus.miningXp;
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
    }, 10000);
  });
}

function log(data) {
  const date = new Date();
  const logstring = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${data}`;
  console.log(logstring);
}

setTimeout(loop, 3000);
