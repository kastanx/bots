const robot = require("robotjs");
const TOP_OFFSET = 70;
const MARK_OF_GRACE = 11849;

const INV_COORDS = [
  { x: 1310, y: 701 },
  { x: 1349, y: 702 },
  { x: 1390, y: 703 },
  { x: 1428, y: 704 },
  { x: 1301, y: 736 },
  { x: 1349, y: 737 },
  { x: 1390, y: 737 },
  { x: 1433, y: 737 },
  { x: 1308, y: 771 },
  { x: 1354, y: 772 },
  { x: 1392, y: 773 },
  { x: 1432, y: 773 },
  { x: 1310, y: 809 },
  { x: 1350, y: 810 },
  { x: 1391, y: 810 },
  { x: 1432, y: 808 },
  { x: 1313, y: 842 },
  { x: 1349, y: 849 },
  { x: 1393, y: 847 },
  { x: 1431, y: 846 },
  { x: 1312, y: 881 },
  { x: 1353, y: 882 },
  { x: 1392, y: 881 },
  { x: 1434, y: 881 },
  { x: 1308, y: 917 },
  { x: 1354, y: 918 },
  { x: 1393, y: 918 },
  { x: 1437, y: 917 },
];

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

const area1 = new Area([
  { x: 2620, y: 3678, z: 3 },
  { x: 2620, y: 3670, z: 3 },
  { x: 2629, y: 3670, z: 3 },
  { x: 2629, y: 3678, z: 3 },
]);

const area2 = new Area([
  { x: 2613, y: 3670, z: 3 },
  { x: 2624, y: 3670, z: 3 },
  { x: 2624, y: 3656, z: 3 },
  { x: 2613, y: 3656, z: 3 },
]);

const area3 = new Area([
  { x: 2625, y: 3657, z: 3 },
  { x: 2625, y: 3650, z: 3 },
  { x: 2632, y: 3650, z: 3 },
  { x: 2632, y: 3657, z: 3 },
]);

const area4 = new Area([
  { x: 2638, y: 3655, z: 3 },
  { x: 2638, y: 3648, z: 3 },
  { x: 2646, y: 3648, z: 3 },
  { x: 2646, y: 3655, z: 3 },
]);

const area5 = new Area([
  { x: 2642, y: 3664, z: 3 },
  { x: 2642, y: 3656, z: 3 },
  { x: 2652, y: 3656, z: 3 },
  { x: 2652, y: 3664, z: 3 },
]);

const area6 = new Area([
  { x: 2654, y: 3683, z: 3 },
  { x: 2654, y: 3664, z: 3 },
  { x: 2664, y: 3664, z: 3 },
  { x: 2664, y: 3683, z: 3 },
]);

const finalArea = new Area([
  { x: 2647, y: 3684, z: 0 },
  { x: 2647, y: 3668, z: 0 },
  { x: 2656, y: 3668, z: 0 },
  { x: 2656, y: 3684, z: 0 },
]);

const failArea = new Area([
  { x: 2621, y: 3667, z: 0 },
  { x: 2621, y: 3653, z: 0 },
  { x: 2627, y: 3649, z: 0 },
  { x: 2631, y: 3648, z: 0 },
  { x: 2636, y: 3648, z: 0 },
  { x: 2636, y: 3658, z: 0 },
  { x: 2633, y: 3668, z: 0 },
]);

const MARK_OF_GRACE_AREAS = [
  area1,
  area2,
  area3,
  area4,
  area5,
  area6,
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
        await moveMouseClick(1312, 126);
        log("turning run on");
        await sleep(200);
      }

      if (!status?.moving2 && area1.contains(status)) {
        const { gameObjects } = await getData(14947);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to second area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area2.contains(status)) {
        const { gameObjects } = await getData(14987);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to third area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area3.contains(status)) {
        const { gameObjects } = await getData(14990);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fourth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area4.contains(status)) {
        const { gameObjects } = await getData(14991);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fifth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area5.contains(status)) {
        const { gameObjects } = await getData(14992);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to sixth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area6.contains(status)) {
        const { gameObjects } = await getData(14994);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to final area");
        await waitForXpDrop();
      } else if (!status?.moving2 && finalArea.contains(status)) {
        const { status } = await getData(0, 2635, 3679, 0);
        await moveMouseClick(status?.tileX, status?.tileY, 10);
        log("going to start tile");
        await sleep(500);
      } else if (!status?.moving2 && failArea.contains(status)) {
        const { status } = await getData(0, 2628, 3672, 0);
        await moveMouseClick(status?.tileX, status?.tileY, 10);
        log("going to start tile from fail area");
        await sleep(500);
      } else if (!status?.moving2) {
        const { gameObjects } = await getData(14946);
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
