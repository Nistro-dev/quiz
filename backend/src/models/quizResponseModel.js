import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Quiz from "./quizModel.js";

const QuizResponse = sequelize.define("QuizResponse", {
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  responses: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

QuizResponse.addHook("beforeSave", async (quizResponse, options) => {
  let totalCorrect = 0;
  if (!quizResponse.responses || !Array.isArray(quizResponse.responses)) {
    return;
  }

  const quiz = await quizResponse.getQuiz({ include: [{ association: "questions" }] });
  if (quiz && quiz.questions) {
    for (const response of quizResponse.responses) {
      const question = quiz.questions.find(q => q.id === response.questionId);
      if (question && question.correctAnswerIndex === response.selectedChoiceIndex) {
        totalCorrect += 1;
      }
    }
  }
  quizResponse.score = totalCorrect;
});

export default QuizResponse;