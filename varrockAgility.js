import { RUN_COORDS } from "./config.js";
import { getData } from "./util/api.js";
import { Area } from "./util/area.js";
import {
  log,
  moveMouseClick,
  sleep,
  waitForAgilityXpDrop,
} from "./util/util.js";

const MARK_OF_GRACE = 11849;

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
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && secondArea.contains(status)) {
        const { gameObjects } = await getData(14414);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && thirdArea.contains(status)) {
        const { gameObjects } = await getData(14832);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && fourthArea.contains(status)) {
        const { gameObjects } = await getData(14833);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && fifthArea.contains(status)) {
        const { gameObjects } = await getData(14834);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && sixthArea.contains(status)) {
        const { gameObjects } = await getData(14835);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && seventhArea.contains(status)) {
        const { gameObjects } = await getData(14836);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop();
      } else if (!status?.moving2 && eisghtArea.contains(status)) {
        const { gameObjects } = await getData(14841);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop(200);
      } else if (!status?.moving2 && failArea.contains(status)) {
        const { status } = await getData(0, 3207, 3409, 0);
        await moveMouseClick(status?.tileX, status?.tileY);
      } else if (!status?.moving2) {
        const { gameObjects } = await getData(14412);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForAgilityXpDrop();
      }
    } catch (error) {}

    await sleep(300);
  }
}

setTimeout(loop, 3000);
// loop();
