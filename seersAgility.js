import { INV_COORDS, RUN_COORDS, TOP_OFFSET } from "./config.js";
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
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && secondArea.contains(status)) {
        const { gameObjects } = await getData(14932);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to third area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && thirdArea.contains(status)) {
        const { gameObjects } = await getData(14929);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fourth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && fourthArea.contains(status)) {
        const { gameObjects } = await getData(14930);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fifth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && fifthArea.contains(status)) {
        const { gameObjects } = await getData(14931);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to final area");
        await waitForAgilityXpDrop();
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
        await waitForAgilityXpDrop();
      }
    } catch (error) {}

    await sleep(300);
  }
}

setTimeout(loop, 3000);
