import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, stateMachine } from "../../globals.js";
import State from "../../lib/State.js"
import ImageName from "../enums/ImageName.js";
import FontName from "../enums/FontName.js";
import StateName from "../enums/StateName.js";
import SaveManager from "../services/SaveManager.js";

export default class ResultState extends State{
    constructor(){
        super();

        this.defaultCanvasHeight = CANVAS_HEIGHT;
        this.adjustedCanvasHeight = 0;
        
        this.titleX = CANVAS_WIDTH * .5;
        this.titleY = CANVAS_HEIGHT / 10;
        this.distance = 40;
        this.padding = 10;
        this.size = 60;
        
        this.mouseX = 0;
        this.mouseY = 0;


        this.cornerRadius = 20;
        var horizontalSpacing = CANVAS_WIDTH*.01;
        this.verticalSpacing = 10;
        
        //Adjusting the Question Automatically adjust the Answer
        this.questionWidth = CANVAS_WIDTH*.45;
        this.questionHeight = this.questionWidth*.3;
        this.questionX = CANVAS_WIDTH*.05;
        this.questionY = 150;

        this.answerWidth = CANVAS_WIDTH - this.questionWidth - (this.questionX * 2) - horizontalSpacing;
        this.answerHeight = this.questionHeight;
        this.answerX = this.questionX + this.questionWidth + horizontalSpacing;
        this.answerY = this.questionY;
    }

    enter(enterParameters){
        this.questions = null;
        this.answers = null;
        this.numCorrectAnswers = 0;

        this.questions = enterParameters.questions;
        this.answers = enterParameters.answers;
        this.numCorrectAnswers = this.calculateResult();
        SaveManager.addHighScore(this.numCorrectAnswers);

        // Set canvas height to be below last question
        this.adjustedCanvasHeight = this.questionY + ((this.questionHeight+ this.verticalSpacing)*this.questions.length) + 105 ;
        if (this.adjustedCanvasHeight > CANVAS_HEIGHT){
            canvas.height = this.adjustedCanvasHeight
        }
            
        this.render();
    }

    saveScore(){

    }

    calculateResult(){
        var res = 0;
        for(var i = 0; i < this.questions.length; i++){
            if(this.questions[i].answerIndex == this.answers[i])
                res++;
        }
        return res;
    }

    exit(){
        this.mouseX = 0;
        this.mouseY = 0;
        this.clicked = false;
    }

    update(parameters){
        this.mouseX = parameters[0];
        this.mouseY = parameters[1];
        this.clicked = parameters[2];

        this.render();

        //Mouse check
        if(this.mouseX > 25 && this.mouseX < 240 && this.mouseY > 20 && this.mouseY < 100){
            
            this.setTextStyle('#F9D4E0', 'middle', 'center');
            context.font = '20px sans-serif';
            context.fillText('Back to Main Menu', 130, this.titleY);
            this.roundRect( 25,this.titleY -40 , 215, 70, 20, "#cccccc55", "#ffffff", true);
            
            if(this.clicked){
                canvas.height = this.defaultCanvasHeight;
                stateMachine.change(StateName.Menu);
            }
        }

        if(this.mouseX > 25 && this.mouseX < 240 && this.mouseY > this.adjustedCanvasHeight-90 && this.mouseY < this.adjustedCanvasHeight-90+70){
            
            this.setTextStyle('#F9D4E0', 'middle', 'center');
            context.font = '20px sans-serif';
            context.fillText('Back to Main Menu', 130, this.adjustedCanvasHeight-90+40);
            this.roundRect( 25,this.adjustedCanvasHeight-90 , 215, 70, 20, "#cccccc55", "#ffffff", true);

            
            if(this.clicked){
                canvas.height = this.defaultCanvasHeight;
                stateMachine.change(StateName.Menu);
            }
        }
    }

    render(){
        context.fillStyle = '#dc1d5d';
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Set the repeating background the appropriate amount of times
        var numOfBackground = Math.ceil(this.adjustedCanvasHeight / this.defaultCanvasHeight);
        for (let i = 0; i < numOfBackground; i++) {
            images.render(ImageName.Background, 0, CANVAS_HEIGHT*i, CANVAS_WIDTH, CANVAS_HEIGHT);
            /*if( i % 2 == 0 || i == 0){
                images.render(ImageName.Background, 0, CANVAS_HEIGHT*i, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            else {
                images.render(ImageName.BackgroundFlipped, 0, CANVAS_HEIGHT*i, CANVAS_WIDTH, CANVAS_HEIGHT);
            }*/
        }

        this.setTextStyle('#F9D4E0', 'middle', 'center');
        context.font = '50px ViceCitySans';

        if(this.numCorrectAnswers == 1)
            context.fillText("Results: " + this.numCorrectAnswers + " correct answer of " + this.questions.length, this.titleX, this.titleY);
        else
            context.fillText("Results: " + this.numCorrectAnswers + " correct answers of " + this.questions.length, this.titleX, this.titleY);

        context.font = '20px sans-serif';
        context.fillText('Back to Main Menu', 130, this.titleY);
        this.roundRect( 25,this.titleY -40 , 215, 70, 20, "#cccccc00", "#ffffff", true);

        for (let i = 0; i < this.questions.length; i++) {
            var backgroundColor
            var borderColor;
            if(this.questions[i].answerIndex == this.answers[i]){
                backgroundColor = "#00ff00";
                borderColor = "#009900";
            }
            else{
                backgroundColor = "#ed0c0c";
                borderColor = "#8a0101";
            }
            this.roundRect(this.questionX, this.questionY + ((this.questionHeight+ this.verticalSpacing)*i+1), this.questionWidth, this.questionHeight, this.cornerRadius, "#9F2C55", "#802646", true);
            this.roundRect(this.answerX, this.answerY + ((this.answerHeight+ this.verticalSpacing)*i+1), this.answerWidth, this.answerHeight, this.cornerRadius, backgroundColor, borderColor, true);

            context.font = '30px ViceCitySans';
            
            this.setTextStyle('#F9D4E0', 'middle', 'center');
            this.writeQuestion(this.questions[i].question, this.questionX + this.questionWidth/2, this.questionY + this.questionHeight/2 + ((this.questionHeight+ this.verticalSpacing)*i+1));
            
            this.setTextStyle('black', 'middle', 'center');
            this.writeAnswer(this.questions[i].choices[this.questions[i].answerIndex], this.answerX + this.answerWidth/2, this.answerY + this.answerHeight/2 + ((this.answerHeight+ this.verticalSpacing)*i+1));
        }

        this.setTextStyle('#F9D4E0', 'middle', 'center');
        context.font = '20px sans-serif';
        context.fillText('Back to Main Menu', 130, this.adjustedCanvasHeight-90+40);
        this.roundRect( 25,this.adjustedCanvasHeight-90 , 215, 70, 20, "#cccccc00", "#ffffff", true);
    }

    writeQuestion(question, x, y){
        let words = question.split(":");
        words = words[1].split(" ");
        let count = 0;
        let index = 0;
        let lines = [""];

        words.forEach(word => {
            count += word.length;

            if(count > 22){
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
            context.fillText(lines[0], x, y - 40);
            context.fillText(lines[1], x, y);

            if(lines.length > 3)
                context.fillText(lines[2] + "...", x, y + 40);
            else
                context.fillText(lines[2], x, y + 40);
        }
    }

    writeAnswer(answer, x, y){
        let words = answer.split(" ");
        let count = 0;
        let index = 0;
        let lines = [""];

        words.forEach(word => {
            count += word.length;

            if(count > 25){
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
            context.fillText(lines[0], x, y - 40);
            context.fillText(lines[1], x, y);
            context.fillText(lines[2], x, y + 40);
        }
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
}