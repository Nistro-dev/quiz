import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Quiz = sequelize.define("Quiz", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  theme: {
    type: DataTypes.ENUM("SCIENCE", "HISTORY", "SPORT", "GEOGRAPHY"),
    allowNull: false,
  },
});

Quiz.addHook("beforeCreate", (quiz, options) => {
  if (quiz.questions && Array.isArray(quiz.questions)) {
    if (quiz.questions.length < 3 || quiz.questions.length > 10) {
      throw new Error("Un quiz doit comporter entre 3 et 10 questions.");
    }
  }
});

Quiz.addHook("beforeUpdate", (quiz, options) => {
  if (quiz.questions && Array.isArray(quiz.questions)) {
    if (quiz.questions.length < 3 || quiz.questions.length > 10) {
      throw new Error("Un quiz doit comporter entre 3 et 10 questions.");
    }
  }
});

export default Quiz;