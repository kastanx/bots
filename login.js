import robot from "robotjs";
import { TOP_OFFSET } from "./config.js";
import { getData } from "./util/api.js";
import {
  sleep,
  waitForLoginInput,
  waitForPasswordFieldFocus,
  waitForStartGame,
  waitForUsernameFieldFocus,
} from "./util/util.js";

export const login = async (username, password) => {
  await waitForLoginInput();

  await waitForUsernameFieldFocus();

  for (let i = 0; i < 100; i++) {
    robot.keyTap("backspace");
  }
  robot.typeString(username);

  await waitForPasswordFieldFocus();

  for (let i = 0; i < 100; i++) {
    robot.keyTap("backspace");
  }
  robot.typeString(password);
  await sleep(1000);

  robot.keyTap("enter");

  await waitForStartGame();
  await sleep(5000);
  const { status } = await getData();

  robot.moveMouse(status.clickToPlayX, status.clickToPlayY + TOP_OFFSET);
  robot.mouseClick();
};
