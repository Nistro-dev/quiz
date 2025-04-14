import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Quiz from "./quizModel.js";

const Question = sequelize.define("Question", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  choices: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isArrayWithProperLength(value) {
        if (!Array.isArray(value)) {
          throw new Error("Les options (choices) doivent être un tableau.");
        }
        if (value.length < 3 || value.length > 5) {
          throw new Error("Une question doit avoir entre 3 et 5 propositions.");
        }
      }
    }
  },
  correctAnswerIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Question.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });
Quiz.hasMany(Question, { foreignKey: "quizId", as: "questions" });

export default Question;