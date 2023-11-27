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
            tileZ,
            MARK_OF_GRACE_AREAS
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
        const { gameObjects } = await getData(14899);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to second area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area2.contains(status)) {
        const { gameObjects } = await getData(14901);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to third area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area3.contains(status)) {
        const { gameObjects } = await getData(14903);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fourth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area4.contains(status)) {
        const { gameObjects } = await getData(14904);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to fifth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area5.contains(status)) {
        const { gameObjects } = await getData(14905);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to sixth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area6.contains(status)) {
        const { gameObjects } = await getData(14911);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to seventh area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area7.contains(status)) {
        const { gameObjects } = await getData(14919);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to eigth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area8.contains(status)) {
        const { gameObjects } = await getData(14920);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to ninth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area9.contains(status)) {
        const { gameObjects } = await getData(14921);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to tenth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area10.contains(status)) {
        const { gameObjects } = await getData(14923);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to eleventh area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area11.contains(status)) {
        const { gameObjects } = await getData(14924);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to twelvth area");
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && area12.contains(status)) {
        const { gameObjects } = await getData(14925);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        log("going to thirteenth area");
        await waitForAgilityXpDrop();
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
        await waitForAgilityXpDrop();
      }
    } catch (error) {}

    await sleep(300);
  }
}

setTimeout(loop, 3000);
