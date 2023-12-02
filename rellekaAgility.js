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

const MARK_OF_GRACE = 11849;

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

      if (!status?.moving2 && area1.contains(status)) {
        const { gameObjects } = await getData(14947);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to second area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area2.contains(status)) {
        const { gameObjects } = await getData(14987);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to third area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area3.contains(status)) {
        const { gameObjects } = await getData(14990);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fourth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area4.contains(status)) {
        const { gameObjects } = await getData(14991);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fifth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area5.contains(status)) {
        const { gameObjects } = await getData(14992);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to sixth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area6.contains(status)) {
        const { gameObjects } = await getData(14994);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to final area");
        await waitForAgilityXpDrop();
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
        await waitForAgilityXpDrop();
      }
    } catch (error) {}

    await sleep(300);
  }
}

setTimeout(loop, 3000);
