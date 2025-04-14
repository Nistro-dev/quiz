import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

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
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

Quiz.addHook("beforeCreate", (quiz, options) => {
  if (quiz.questions && Array.isArray(quiz.questions)) {
    if (quiz.questions.length < 3 || quiz.questions.length > 10) {
      throw new Error("Un quiz doit comporter entre 3 et 10 questions.");
    }
  }

  if (!quiz.title) {
    throw new Error("Le titre du quiz est requis.");
  }

  const validThemes = ["SCIENCE", "HISTORY", "SPORT", "GEOGRAPHY"];
  if (!validThemes.includes(quiz.theme)) {
    throw new Error("Le thème du quiz est invalide.");
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