import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	questions,
	sounds,
    stateMachine,
} from "./globals.js";
import Quiz from "./src/Quiz.js";
import MenuState from "./src/states/MenuState.js";
import QuizState from "./src/states/QuizState.js";
import StateName from "./src/enums/StateName.js"
import ScoreState from "./src/states/scoreState.js";
import ResultState from "./src/states/resultState.js";

const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
	questions: questionDefinitions
	// @ts-ignore
} = await fetch('./config.json').then((response) => response.json());

images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);
questions.load(questionDefinitions);

stateMachine.add(StateName.Menu, new MenuState());
stateMachine.add(StateName.Score, new ScoreState());
stateMachine.add(StateName.Quiz, new QuizState());
stateMachine.add(StateName.Result, new ResultState());
stateMachine.change(StateName.Menu);

canvas.addEventListener('mousemove', event => {
	var paddingX = (document.documentElement.clientWidth - CANVAS_WIDTH) / 2;
	var paddingY = (document.documentElement.clientHeight - CANVAS_HEIGHT) / 2;
	stateMachine.update([event.pageX - paddingX, 
						event.pageY - paddingY, 
						false]);
});

canvas.addEventListener('click', event => {
	var paddingX = (document.documentElement.clientWidth - CANVAS_WIDTH) / 2;
	var paddingY = (document.documentElement.clientHeight - CANVAS_HEIGHT) / 2;
	stateMachine.update([event.pageX - paddingX, 
						event.pageY - paddingY, 
						true]);
});

const quiz = new Quiz(stateMachine, context, canvas.width, canvas.height);
quiz.start();

canvas.focus();