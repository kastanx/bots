import robot from "robotjs";
import { getData, getPath } from "./api.js";
import { moveMouseClick, sleep } from "./util.js";

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function closestPointIndexOnPath(path, currentX, currentY) {
  let closestIndex = null;
  let closestDistance = Number.MAX_VALUE;

  for (let i = 0; i < path.length - 1; i++) {
    const { x: x1, y: y1 } = path[i];
    const { x: x2, y: y2 } = path[i + 1];
    const segmentLength = distance(x1, y1, x2, y2);

    // Calculate the projection of the current point onto the line segment
    const u =
      ((currentX - x1) * (x2 - x1) + (currentY - y1) * (y2 - y1)) /
      Math.pow(segmentLength, 2);
    let closestX, closestY;

    if (u < 0) {
      closestX = x1;
      closestY = y1;
    } else if (u > 1) {
      closestX = x2;
      closestY = y2;
    } else {
      closestX = x1 + u * (x2 - x1);
      closestY = y1 + u * (y2 - y1);
    }

    // Calculate distance between current point and its projection on the line segment
    const dist = distance(currentX, currentY, closestX, closestY);

    // Update closest point index if the new point is closer and towards the destination
    if (
      dist < closestDistance ||
      (dist === closestDistance &&
        distance(closestX, closestY, x2, y2) <
          distance(path[closestIndex].x, path[closestIndex].y, x2, y2))
    ) {
      closestDistance = dist;
      closestIndex = i;
    }
  }

  return closestIndex;
}

function getNextPoint(path, currentX, currentY) {
  const closestIndex = closestPointIndexOnPath(path, currentX, currentY);
  let nextIndex = closestIndex + 5;
  if (path.length - 1 <= nextIndex) {
    nextIndex = path.length - 1;
  }

  return path[nextIndex];
}

export async function walk(destinationX, destinationY, destinationZ = 0) {
  const { status } = await getData();
  const path = await getPath(
    {
      x: status.playerX,
      y: status.playerY,
      z: status.playerZ,
    },
    { x: destinationX, y: destinationY, z: destinationZ }
  );

  if (path.length) {
    while (true) {
      const { status } = await getData();
      if (status.playerX === destinationX && status.playerY === destinationY) {
        return;
      }

      const nextPoint = getNextPoint(path, status.playerX, status.playerY);
      const { status: clickStatus } = await getData(
        0,
        nextPoint.x,
        nextPoint.y,
        nextPoint.z
      );

      robot.keyToggle("shift", "down");
      await moveMouseClick(clickStatus.tileX, clickStatus.tileY, 2);
      await sleep(500);
      robot.keyToggle("shift", "up");
      await sleep(100);
    }
  }

  robot.keyToggle("shift", "up");
}
