//import { spreadSheetManager } from "../globals.js";

export default class Quiz {
    constructor(statemachine, context, width, height){
        this.stateMachine = statemachine;
        this.context = context;
        this.width = width;
        this.height = height;
    }

    start(){
        //spreadSheetManager.sendToGoogleSheets(["hello", "goodbye", "test", 1]);
        this.update();
    }

    update(){
        //this.stateMachine.update();
        this.context.clearRect(0, 0, this.width, this.height);
        this.stateMachine.render();
    }
}