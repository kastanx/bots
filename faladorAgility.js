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
  { x: 3033, y: 3349, z: 3 },
  { x: 3033, y: 3340, z: 3 },
  { x: 3042, y: 3340, z: 3 },
  { x: 3042, y: 3349, z: 3 },
]);

const area2 = new Area([
  { x: 3043, y: 3347, z: 3 },
  { x: 3047, y: 3351, z: 3 },
  { x: 3053, y: 3351, z: 3 },
  { x: 3053, y: 3339, z: 3 },
  { x: 3043, y: 3339, z: 3 },
]);

const area3 = new Area([
  { x: 3047, y: 3360, z: 3 },
  { x: 3047, y: 3356, z: 3 },
  { x: 3052, y: 3356, z: 3 },
  { x: 3052, y: 3360, z: 3 },
]);

const area4 = new Area([
  { x: 3044, y: 3369, z: 3 },
  { x: 3044, y: 3360, z: 3 },
  { x: 3050, y: 3360, z: 3 },
  { x: 3050, y: 3369, z: 3 },
]);

const area5 = new Area([
  { x: 3033, y: 3366, z: 3 },
  { x: 3033, y: 3360, z: 3 },
  { x: 3043, y: 3360, z: 3 },
  { x: 3043, y: 3366, z: 3 },
]);

const area6 = new Area([
  { x: 3025, y: 3357, z: 3 },
  { x: 3025, y: 3351, z: 3 },
  { x: 3031, y: 3351, z: 3 },
  { x: 3031, y: 3357, z: 3 },
]);

const area7 = new Area([
  { x: 3008, y: 3360, z: 3 },
  { x: 3008, y: 3352, z: 3 },
  { x: 3023, y: 3352, z: 3 },
  { x: 3023, y: 3360, z: 3 },
]);

const area8 = new Area([
  { x: 3015, y: 3351, z: 3 },
  { x: 3015, y: 3342, z: 3 },
  { x: 3024, y: 3342, z: 3 },
  { x: 3024, y: 3351, z: 3 },
]);

const area9 = new Area([
  { x: 3009, y: 3343, z: 3 },
  { x: 3015, y: 3343, z: 3 },
  { x: 3015, y: 3349, z: 3 },
  { x: 3009, y: 3349, z: 3 },
]);

const area10 = new Area([
  { x: 3015, y: 3335, z: 3 },
  { x: 3007, y: 3335, z: 3 },
  { x: 3007, y: 3343, z: 3 },
  { x: 3015, y: 3343, z: 3 },
]);

const area11 = new Area([
  { x: 3011, y: 3335, z: 3 },
  { x: 3018, y: 3335, z: 3 },
  { x: 3018, y: 3329, z: 3 },
  { x: 3011, y: 3329, z: 3 },
]);

const area12 = new Area([
  { x: 3019, y: 3337, z: 3 },
  { x: 3019, y: 3330, z: 3 },
  { x: 3028, y: 3330, z: 3 },
  { x: 3028, y: 3337, z: 3 },
]);

const failArea = new Area([
  { x: 3049, y: 3359, z: 0 },
  { x: 3049, y: 3350, z: 0 },
  { x: 3053, y: 3350, z: 0 },
  { x: 3053, y: 3359, z: 0 },
]);

const MARK_OF_GRACE_AREAS = [
  area1,
  area2,
  area3,
  area4,
  area5,
  area6,
  area7,
  area8,
  area9,
  area10,
  area11,
  area12,
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
        const { gameObjects } = await getData(14899);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to second area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area2.contains(status)) {
        const { gameObjects } = await getData(14901);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to third area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area3.contains(status)) {
        const { gameObjects } = await getData(14903);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fourth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area4.contains(status)) {
        const { gameObjects } = await getData(14904);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fifth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area5.contains(status)) {
        const { gameObjects } = await getData(14905);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to sixth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area6.contains(status)) {
        const { gameObjects } = await getData(14911);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to seventh area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area7.contains(status)) {
        const { gameObjects } = await getData(14919);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to eigth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area8.contains(status)) {
        const { gameObjects } = await getData(14920);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to ninth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area9.contains(status)) {
        const { gameObjects } = await getData(14921);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to tenth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area10.contains(status)) {
        const { gameObjects } = await getData(14923);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to eleventh area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area11.contains(status)) {
        const { gameObjects } = await getData(14924);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to twelvth area");
        await waitForXpDrop();
      } else if (!status?.moving2 && area12.contains(status)) {
        const { gameObjects } = await getData(14925);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to thirteenth area");
        await waitForXpDrop();
      }
      // start tile, fail tile
      else if (!status?.moving2 && failArea.contains(status)) {
        const { status } = await getData(0, 3041, 3341, 0);
        await moveMouseClick(status?.tileX, status?.tileY, 10);
        log("going to start tile from fail area");
        await sleep(500);
      } else if (!status?.moving2) {
        const { gameObjects } = await getData(14898);
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
