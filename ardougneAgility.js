import robot from "robotjs";
import { INV_COORDS, RUN_COORDS, TOP_OFFSET } from "./config.js";
import "./monitoring.js";
import { getData, getInv } from "./util/api.js";
import { Area } from "./util/area.js";
import {
  isInMarkLocation,
  log,
  moveMouseClick,
  sleep,
  waitForAgilityXpDrop,
} from "./util/util.js";
import { walk } from "./util/walking.js";

const MARK_OF_GRACE = 11849;

const area1 = new Area([
  { x: 2670, y: 3312, z: 3 },
  { x: 2673, y: 3312, z: 3 },
  { x: 2673, y: 3298, z: 3 },
  { x: 2670, y: 3298, z: 3 },
]);

const area2 = new Area([
  { x: 2660, y: 3320, z: 3 },
  { x: 2660, y: 3317, z: 3 },
  { x: 2667, y: 3317, z: 3 },
  { x: 2667, y: 3320, z: 3 },
]);

const area3 = new Area([
  { x: 2653, y: 3320, z: 3 },
  { x: 2653, y: 3317, z: 3 },
  { x: 2659, y: 3317, z: 3 },
  { x: 2659, y: 3320, z: 3 },
]);

const area4 = new Area([
  { x: 2652, y: 3316, z: 3 },
  { x: 2652, y: 3310, z: 3 },
  { x: 2655, y: 3310, z: 3 },
  { x: 2655, y: 3316, z: 3 },
]);

const area5 = new Area([
  { x: 2650, y: 3310, z: 3 },
  { x: 2650, y: 3300, z: 3 },
  { x: 2650, y: 3299, z: 3 },
  { x: 2658, y: 3299, z: 3 },
  { x: 2656, y: 3310, z: 3 },
]);

const area6 = new Area([
  { x: 2655, y: 3298, z: 3 },
  { x: 2655, y: 3297, z: 3 },
  { x: 2657, y: 3297, z: 3 },
  { x: 2657, y: 3298, z: 3 },
]);

const startArea = new Area([
  { x: 2663, y: 3300, z: 0 },
  { x: 2663, y: 3294, z: 0 },
  { x: 2677, y: 3294, z: 0 },
  { x: 2677, y: 3300, z: 0 },
]);

const MARK_OF_GRACE_AREAS = [area1, area2, area3, area4, area5, area6];

async function loop() {
  while (true) {
    try {
      const { status, groundItems } = await getData(0, 0, 0, 0, MARK_OF_GRACE);

      if (status?.gameState === "LOGIN_SCREEN") {
        log("logging out");
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
            tileZ,
            MARK_OF_GRACE_AREAS
          )
        ) {
          await moveMouseClick(groundItems[0]?.x, groundItems[0]?.y, 1);
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

      if (!status?.moving2 && area1.contains(status)) {
        const { gameObjects } = await getData(15609);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to second area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area2.contains(status)) {
        const { gameObjects } = await getData(26635);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y - 10, 0);
        log("going to third area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area3.contains(status)) {
        const { gameObjects } = await getData(15610);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fourth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area4.contains(status)) {
        const { gameObjects } = await getData(15611);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fifth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area5.contains(status)) {
        const { gameObjects } = await getData(28912);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to sixth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area6.contains(status)) {
        const { gameObjects } = await getData(15612);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to final area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && startArea.contains(status)) {
        const { gameObjects } = await getData(15608);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y - 10);
        log("going to first area");
        await waitForAgilityXpDrop();
      } else if (
        !status?.moving2 &&
        !startArea.contains(status) &&
        status.playerZ === 0
      ) {
        log("walking to start");
        await walk(2669, 3297, 0);
      }
    } catch (error) {}

    await sleep(100);
  }
}

setInterval(() => {
  log("changing worlds");
  robot.keyTap("l");
}, 1000 * 60 * 60);

setTimeout(loop, 3000);
