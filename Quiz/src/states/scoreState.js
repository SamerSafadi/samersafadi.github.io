import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, stateMachine } from "../../globals.js";
import State from "../../lib/State.js"
import ImageName from "../enums/ImageName.js";
import FontName from "../enums/FontName.js";
import StateName from "../enums/StateName.js";
import SaveManager from "../services/SaveManager.js";

export default class ScoreState extends State{
    constructor(){
        super();
        
        this.titleX = CANVAS_WIDTH / 2;
        this.titleY = CANVAS_HEIGHT / 5;
        this.distance = 40;
        this.padding = 10;
        this.size = 60;
        
        this.mouseX = 0;
        this.mouseY = 0;

        this.scores = [];
    }

    enter(){
        this.scores = SaveManager.loadHighScores();
        this.render();
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
        if(this.mouseX > this.titleX - 300 && this.mouseX < this.titleX - 200 && this.mouseY > this.titleY -35 && this.mouseY < this.titleY +35){
            this.roundRect( this.titleX - 300,this.titleY -35 , 100, 70, 20, "#cccccc55", "#ffffff", true);

            context.font = '30px ViceCitySans';
            context.fillStyle = '#F9D4E0';
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.fillText('←', this.titleX - 250, this.titleY);

            if(this.clicked){
                stateMachine.change(StateName.Menu);
            }
        }
    }

    render(){
        context.fillStyle = '#dc1d5d';
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.font = '30px ViceCitySans';
        context.fillStyle = '#F9D4E0';
        context.textBaseline = 'middle';
		context.textAlign = 'center';
        context.fillText('←', this.titleX - 250, this.titleY);
        this.roundRect( this.titleX - 300,this.titleY -35 , 100, 70, 20, "#cccccc00", "#ffffff", true);
        
        context.font = '30px ViceCitySans';
        context.fillStyle = '#F9D4E0';
        context.textBaseline = 'middle';
		context.textAlign = 'center';

        context.font = this.size + 'px ViceCitySans';
		context.fillText('Top Scores', this.titleX, this.titleY);
        context.fillText('Top Scores', this.titleX, this.titleY);
        
        this.y = this.titleY
        context.font = (this.size / 2) + 'px ViceCitySans';
        
        this.y += this.distance;
        this.score = 0;
        for(var i = 0; i < 10; i++){
            if(i < this.scores.length)
                this.score = this.scores[i].score;
            
                this.y += this.distance;
            context.fillText((i + 1) + '. ' + this.score, this.titleX, this.y);
        }
    }

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