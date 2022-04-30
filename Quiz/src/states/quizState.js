import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, stateMachine, questions } from "../../globals.js";
import State from "../../lib/State.js"
import ImageName from "../enums/ImageName.js";
import FontName from "../enums/FontName.js";
import StateName from "../enums/StateName.js";

export default class QuizState extends State{
    constructor(){
        super();
        
        this.questionX = CANVAS_WIDTH / 2;
        this.questionY = CANVAS_WIDTH *.12;

        this.timerX = CANVAS_WIDTH / 10;
        this.timerY = CANVAS_HEIGHT / 10;
        this.timerBoxSize = 50;
        
        var answerHorizontalSpacing = CANVAS_WIDTH *.23;
        this.answer0X = CANVAS_WIDTH / 2 - answerHorizontalSpacing;
        this.answer0Y = CANVAS_HEIGHT / 2 + CANVAS_HEIGHT *.05;
        this.answer1X = CANVAS_WIDTH / 2 + answerHorizontalSpacing;
        this.answer1Y = CANVAS_HEIGHT / 2 + CANVAS_HEIGHT *.05;
        this.answer2X = CANVAS_WIDTH / 2 - answerHorizontalSpacing;
        this.answer2Y = CANVAS_HEIGHT / 2 + CANVAS_HEIGHT *.32;
        this.answer3X = CANVAS_WIDTH / 2 + answerHorizontalSpacing;
        this.answer3Y = CANVAS_HEIGHT / 2 + CANVAS_HEIGHT *.32;

        this.answerCornerRadius = 20;
        this.questionCornerRadius = 30;

        this.answerWidth = CANVAS_WIDTH*.45;
        this.answerHeight = CANVAS_HEIGHT*.25;
        
        this.mouseX = 0;
        this.mouseY = 0;

        context.font = "60px ViceCitySans";


        this.allquestions = null;
        this.curentQuestion = null;
        this.pastQuestions = [];
        this.pastAnswers = [];

        this.totalTime = 30;
        this.timer = null;
        this.timeLeft = 0;
    }

    /*function timer(){
        var sec = 30;
        var timer = setInterval(function(){
            document.getElementById('safeTimerDisplay').innerHTML='00:'+sec;
            sec--;
            if (sec < 0) {
                clearInterval(timer);
            }
        }, 1000);
    }*/

    enter(){
        this.allquestions = null;
        this.curentQuestion = null;
        this.pastQuestions = [];
        this.pastAnswers = [];
        
        this.allquestions = this.duplicateArray(questions.questions);
        var index = Math.floor(Math.random() * this.allquestions.length);
        this.curentQuestion = this.allquestions.splice(index, 1)[0];

        this.timeLeft = this.totalTime;
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.renderTimer();

            if(this.timeLeft <= 0){
                stateMachine.change(StateName.Result, {
                    questions: this.pastQuestions,
                    answers: this.pastAnswers
                });
            }
        }, 1000);

        this.render();
    }

    exit(){
        this.mouseX = 0;
        this.mouseY = 0;
        this.clicked = false;
        clearInterval(this.timer);
    }

    update(parameters){
        this.mouseX = parameters[0];
        this.mouseY = parameters[1];
        this.clicked = parameters[2];

        this.render();

        //Mouse check
        if(this.mouseX > this.answer0X - this.answerWidth/2 && this.mouseX < this.answer0X + this.answerWidth/2 && this.mouseY > this.answer0Y - this.answerHeight/2 && this.mouseY < this.answer0Y + this.answerHeight/2){
            this.roundRect(this.answer0X-(this.answerWidth/2), this.answer0Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#0069db", "#000", true);
            this.setTextStyle('black', 'middle', 'center');
            context.fillText(this.curentQuestion.choices[0], this.answer0X, this.answer0Y);

            if(this.clicked){
                this.processAnswer(0);
            }
        }

        if(this.mouseX > this.answer1X - this.answerWidth/2 && this.mouseX < this.answer1X + this.answerWidth/2 && this.mouseY > this.answer1Y - this.answerHeight/2 && this.mouseY < this.answer1Y + this.answerHeight/2){
            this.roundRect(this.answer1X-(this.answerWidth/2), this.answer1Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#00cc00", "#009900", true);
            this.setTextStyle('black', 'middle', 'center');
            context.fillText(this.curentQuestion.choices[1], this.answer1X, this.answer1Y);

            if(this.clicked){
                this.processAnswer(1);
            }
        }

        if(this.mouseX > this.answer2X - this.answerWidth/2 && this.mouseX < this.answer2X + this.answerWidth/2 && this.mouseY > this.answer2Y - this.answerHeight/2 && this.mouseY < this.answer2Y + this.answerHeight/2){
            this.roundRect(this.answer2X-(this.answerWidth/2), this.answer2Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#cc0000", "#990000", true);
            this.setTextStyle('black', 'middle', 'center');
            context.fillText(this.curentQuestion.choices[2], this.answer2X, this.answer2Y);

            if(this.clicked){
                this.processAnswer(2);
            }
        }

        if(this.mouseX > this.answer3X - this.answerWidth/2 && this.mouseX < this.answer3X + this.answerWidth/2 && this.mouseY > this.answer3Y - this.answerHeight/2 && this.mouseY < this.answer3Y + this.answerHeight/2){
            this.roundRect(this.answer3X-(this.answerWidth/2), this.answer3Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#cccc00", "#999900", true);
            this.setTextStyle('black', 'middle', 'center');
            context.fillText(this.curentQuestion.choices[3], this.answer3X, this.answer3Y);

            if(this.clicked){
                this.processAnswer(3);
            }
        }
    }

    processAnswer(answerIndex){
        this.pastQuestions.push(this.curentQuestion);
        this.pastAnswers.push(answerIndex);

        if(this.allquestions.length > 0){
            var index = Math.floor(Math.random() * this.allquestions.length);
            this.curentQuestion = this.allquestions.splice(index, 1)[0];
        } else{
            stateMachine.change(StateName.Result, {
                questions: this.pastQuestions,
                answers: this.pastAnswers
            });
        }

        this.render();
    }

    render(){
        context.fillStyle = '#dc1d5d';
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        /* Answer Boxes */ 
        this.roundRect(this.answer0X-(this.answerWidth/2), this.answer0Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#007bff", "#000099", true);
        this.roundRect(this.answer1X-(this.answerWidth/2), this.answer1Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#00ff00", "#009900", true);
        this.roundRect(this.answer2X-(this.answerWidth/2), this.answer2Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#ff0000", "#990000", true);
        this.roundRect(this.answer3X-(this.answerWidth/2), this.answer3Y-(this.answerHeight/2), this.answerWidth, this.answerHeight, this.answerCornerRadius, "#ffff00", "#999900", true);

        /* Question Box */ 
        this.roundRect(this.questionX-(CANVAS_WIDTH*.455), this.questionY-(CANVAS_HEIGHT*.35/2), CANVAS_WIDTH*.91, CANVAS_HEIGHT*.35, this.questionCornerRadius, "#9F2C55", "#802646", true);

        /* Text */
        this.setTextStyle('#F9D4E0', 'middle', 'center');
		this.writeQuestion(this.curentQuestion.question, this.questionX, this.questionY);

        this.setTextStyle('black', 'middle', 'center');
        context.fillText(this.curentQuestion.choices[0], this.answer0X, this.answer0Y);
        context.fillText(this.curentQuestion.choices[1], this.answer1X, this.answer1Y);
        context.fillText(this.curentQuestion.choices[2], this.answer2X, this.answer2Y);
        context.fillText(this.curentQuestion.choices[3], this.answer3X, this.answer3Y);

        this.renderTimer();
    }

    writeQuestion(question, x, y){
        let words = question.split(" ");
        let count = 0;
        let index = 0;
        let lines = [""];

        words.forEach(word => {
            count += word.length;

            if(count > 60){
                index++;
                count = 0;
                lines.push("");
            }

            lines[index] += word + " ";
        });
        
        if(index == 0)
            context.fillText(lines[0], x, y);
        else if(index == 1){
            context.fillText(lines[0], x, y - 20);
            context.fillText(lines[1], x, y + 20);
        } else{
            context.fillText(lines[0], x, y - 20);
            context.fillText(lines[1], x, y + 20);
            context.fillText(lines[2], x, y + 60);
        }
    }

    renderTimer(){
        this.roundRect(this.timerX - (this.timerBoxSize / 2), this.timerY - (this.timerBoxSize / 2), this.timerBoxSize, this.timerBoxSize, 20, "#F6931B", "#b36200", true);
        this.setTextStyle('black', 'middle', 'center');
        context.fillText(this.timeLeft.toString(), this.timerX, this.timerY);
    }

    setTextStyle(fillStyle, textBaseline, textAlign){
        context.fillStyle = fillStyle;
        context.textBaseline = textBaseline;
        context.textAlign = textAlign;
    }

    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle outline with a 5 pixel border radius
     * Source: https://stackoverflow.com/a/3368118
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {String} fillStyle The color of the rectangle
     * @param {String} strokeStyle The border color of the rectangle
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    roundRect(x, y, width, height, radius, fillStyle, strokeStyle, fill, stroke) {
        if (typeof strokeStyle != 'undefined') { context.strokeStyle = strokeStyle; }
        if (typeof fillStyle != 'undefined') { context.fillStyle = fillStyle; }
        if (typeof stroke === 'undefined') { stroke = true; }
        if (typeof radius === 'undefined') { radius = 5; }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        context.beginPath();
        context.moveTo(x + radius.tl, y);
        context.lineTo(x + width - radius.tr, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        context.lineTo(x + width, y + height - radius.br);
        context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        context.lineTo(x + radius.bl, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        context.lineTo(x, y + radius.tl);
        context.quadraticCurveTo(x, y, x + radius.tl, y);
        context.closePath();
        if (fill) { context.fill(); }
        if (stroke) { context.stroke(); }
    }

    duplicateArray(array){
        var result = new Array();
        array.forEach(element => {
            result.push(element);
        });
        return result;
    }
}