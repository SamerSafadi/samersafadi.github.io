import { MAX_HIGH_SCORES } from "../../globals.js";

export default class SaveManager{      
    static loadHighScores(){
        let highScrores = JSON.parse(localStorage.getItem('highScores'));

        if(highScrores == null || highScrores.length == 0){
            highScrores = [];
            
            for(let i = 0; i < MAX_HIGH_SCORES; i++){
                highScrores.push({score: 0});
            }

            localStorage.setItem('highScores', JSON.stringify(highScrores));
        }

        return highScrores;
    }

    static addHighScore(score){
        let highScores = SaveManager.loadHighScores();

        highScores.push({score: score});
        highScores = highScores.sort((a, b) => b.score - a.score);
        highScores.splice(MAX_HIGH_SCORES, 1);

        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    static resetScore(){
        localStorage.clear();
    }
}