import { getData } from "./util/api.js";
import { Area } from "./util/area.js";
import { moveMouseClick, sleep } from "./util/util.js";

const firstArea = new Area([
  { x: 2469, y: 3431, z: 0 },
  { x: 2479, y: 3431, z: 0 },
  { x: 2479, y: 3424, z: 0 },
  { x: 2469, y: 3424, z: 0 },
]);

const secondArea = new Area([
  { x: 2468, y: 3426, z: 1 },
  { x: 2480, y: 3426, z: 1 },
  { x: 2480, y: 3420, z: 1 },
  { x: 2468, y: 3420, z: 1 },
]);

const thirdArea = new Area([
  { x: 2468, y: 3425, z: 2 },
  { x: 2480, y: 3425, z: 2 },
  { x: 2480, y: 3413, z: 2 },
  { x: 2468, y: 3413, z: 2 },
]);

const fourthArea = new Area([
  { x: 2480, y: 3424, z: 2 },
  { x: 2480, y: 3414, z: 2 },
  { x: 2494, y: 3414, z: 2 },
  { x: 2494, y: 3425, z: 2 },
  { x: 2480, y: 3425, z: 2 },
]);

const fifthArea = new Area([
  { x: 2480, y: 3426, z: 0 },
  { x: 2490, y: 3426, z: 0 },
  { x: 2490, y: 3418, z: 0 },
  { x: 2480, y: 3418, z: 0 },
]);

console.log(fifthArea.contains({ playerX: 2483, playerY: 3425, playerZ: 0 }));

const sixthArea = new Area([
  { x: 2482, y: 3428, z: 0 },
  { x: 2482, y: 3432, z: 0 },
  { x: 2490, y: 3432, z: 0 },
  { x: 2490, y: 3428, z: 0 },
]);

const seventhArea = new Area([
  { x: 2481, y: 3439, z: 0 },
  { x: 2489, y: 3439, z: 0 },
  { x: 2489, y: 3435, z: 0 },
  { x: 2481, y: 3435, z: 0 },
]);

async function loop() {
  while (true) {
    try {
      const { status } = await getData();

      if (!status?.moving2 && firstArea.contains(status)) {
        const { gameObjects } = await getData(23134);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(secondArea);
      } else if (!status?.moving2 && secondArea.contains(status)) {
        const { gameObjects } = await getData(23559);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(thirdArea);
      } else if (!status?.moving2 && thirdArea.contains(status)) {
        const { gameObjects } = await getData(23557);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(fourthArea);
      } else if (!status?.moving2 && fourthArea.contains(status)) {
        const { gameObjects } = await getData(23560);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(fifthArea);
      } else if (!status?.moving2 && fifthArea.contains(status)) {
        const { gameObjects } = await getData(23135);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(sixthArea);
      } else if (!status?.moving2 && sixthArea.contains(status)) {
        const { gameObjects } = await getData(23138);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(seventhArea);
      } else if (!status?.moving2) {
        const { gameObjects } = await getData(23145);
        await moveMouseClick(gameObjects[0].x, gameObjects[0].y);
        await waitForXpDrop(firstArea);
      }
    } catch (error) {}

    await sleep(300);
  }
}

setTimeout(loop, 3000);
// loop();
setTimeout(() => {
  process.exit();
}, 1000 * 60 * 60 * 2);
