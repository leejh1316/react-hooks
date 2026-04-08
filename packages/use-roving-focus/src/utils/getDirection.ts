import { Direction } from "../types";

export function getDirection(key: string): Direction {
  switch (key) {
    case "ArrowRight":
      return "right";
    case "ArrowLeft":
      return "left";
    case "ArrowDown":
      return "down";
    case "ArrowUp":
      return "up";
    case "Home":
      return "home";
    case "End":
      return "end";
    default:
      return "right";
  }
}
