import type { GameLevel } from "@/game/types.ts";

export const GameConstants = {
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,
  GRID_COLS: 9,
  GRID_ROWS: 5,
  TILE_SIZE: 80,
  DEBUG_MODE: false,
  DURATION: 1,
};

export const defaultLevel: GameLevel = {
  current: "",
  facing: "up",
  collectible: [],
  obstacle: [],
  goal: [],
  start: [],
  path: [],
  maxStep: 0,
  next: null,
  commands: [],
  guides: [],
};

export const levelMapper = [
  { id: "2Eo-J5C71ngUck9cjz2yC", data: "level1.json", layer: "level_1" },
  { id: "aXf7_Kl8MnOpQrStUvWx", data: "level2.json", layer: "level_2" },
  { id: "Gh9-jK0LmNoPqRsTuVwX", data: "level3.json", layer: "level_3" },
  { id: "Yz12_AbCdEfGhIjKlMnO", data: "level4.json", layer: "level_4" },
  { id: "Pq3R-StUvWxYz01AbCdEf", data: "level5.json", layer: "level_5" },
  { id: "GhIj-KlMnOpQrStUvWxY", data: "level6.json", layer: "level_6" },
  { id: "ZaBc_DfGhIjKlMnOpQrS", data: "level7.json", layer: "level_7" },
  { id: "TuVw-XyZaBcDeFgHiJkL", data: "level8.json", layer: "level_8" },
  { id: "MnOp_QrStUvWxYz01AbC", data: "level9.json", layer: "level_9" },
  { id: "DeFg_HiJkLmNoPqRsTuV", data: "level10.json", layer: "level_10" },
  { id: "QrSt_UvWxYz01AbCdEfG", data: "level11.json", layer: "level_11" },
  { id: "IjKl_MnOpQrStUvWxYz0", data: "level12.json", layer: "level_12" },
  { id: "AbCd_EfGhIjKlMnOpQrS", data: "level13.json", layer: "level_13" },
  { id: "TyZ0_AbCdEfGhIjKlMnO", data: "level14.json", layer: "level_14" },
  { id: "UvWx_Yz01AbCdEfGhIjK", data: "level15.json", layer: "level_15" },
];

export const DIRECTION_DELTAS: Record<string, [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
};
