import Sequelize from "sequelize";
import sequelize from "../config/database.js";

import User from "./userModel.js";
import Quiz from "./quizModel.js";
import Question from "./questionModel.js";
import QuizResponse from "./quizResponseModel.js";

import "./associations.js";

export {
  sequelize,
  Sequelize,
  User,
  Quiz,
  Question,
  QuizResponse,
};
