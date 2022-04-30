//import Question from "./Question";

export default class Questions {  
    constructor() {
		this.questions = new Array();
	}

	load(questionDefinitions) {
        questionDefinitions.forEach((questionDefinition) => {
			this.questions.push( //new Question(questionDefinition.question, questionDefinition.choices, questionDefinition.answerIndex)
                {
                question: questionDefinition.question,
                choices: questionDefinition.choices,
                answerIndex: questionDefinition.answerIndex,
                answer: questionDefinition.choices[questionDefinition.answerIndex]
            })
		});
	}
}