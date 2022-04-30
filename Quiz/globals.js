import Images from "./lib/Images.js";
import Fonts from "./lib/Fonts.js";
import Sounds from "./lib/Sounds.js";
import StateMachine from "./lib/StateMachine.js";
import Questions from "./lib/Questions.js";
import SpreadSheetManager from "./src/services/SpreadSheetManager.js"

export const canvas = document.querySelector('canvas');
export const context = canvas.getContext('2d');

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

export const MAX_HIGH_SCORES = 10;

export const images = new Images(context);
export const fonts = new Fonts();
export const sounds = new Sounds();
export const questions = new Questions();
export const stateMachine = new StateMachine();
//export const spreadSheetManager = new SpreadSheetManager();