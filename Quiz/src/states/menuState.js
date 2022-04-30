import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, stateMachine } from "../../globals.js";
import State from "../../lib/State.js"
import ImageName from "../enums/ImageName.js";
import FontName from "../enums/FontName.js";
import StateName from "../enums/StateName.js";

export default class MenuState extends State{
    constructor(){
        super();
        
        this.playX = CANVAS_WIDTH / 2;
        this.playY = (CANVAS_HEIGHT / 2) + 20;
        this.topX = CANVAS_WIDTH / 2;
        this.topY = (CANVAS_HEIGHT / 2) + 75;
        this.symbolPad = 100;
        this.padding = 10;
        this.size = 60;
        
        this.mouseX = 0;
        this.mouseY = 0;
    }

    enter(){
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
    }

    render(){
        context.fillStyle = '#dc1d5d';
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.font = this.size + 'px ViceCitySans';
		context.fillStyle = '#F9D4E0';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Dictionary Quiz', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
        
        context.font = (this.size / 2) + 'px ViceCitySans';
        context.fillText('Start Quiz', this.playX, this.playY);
        context.fillText('Top Scores', this.topX, this.topY);

        //Check if mouse hovers over elements
        if(this.mouseY < this.playY + (this.size / 2) + this.padding && this.mouseY > this.playY - ((this.size / 2) + this.padding)){
            context.fillText('>', this.playX - this.symbolPad, this.playY);
            if(this.clicked){
                stateMachine.change(StateName.Quiz);
            }
        } else if(this.mouseY < this.topY + ((this.size) + (this.padding)) && this.mouseY > this.topY - (this.size / 2)){
                context.fillText('>', this.topX - this.symbolPad, this.topY);
                if(this.clicked){
                    stateMachine.change(StateName.Score);
                }
        }
    }
}