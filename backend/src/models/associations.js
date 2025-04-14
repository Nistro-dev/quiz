import Quiz from "./quizModel.js";
import User from "./userModel.js";
import Question from "./questionModel.js";
import QuizResponse from "./quizResponseModel.js";

Quiz.belongsTo(User, { foreignKey: "ownerId" });
User.hasMany(Quiz, { foreignKey: "ownerId" });

Quiz.hasMany(Question, { foreignKey: "quizId", as: "questions" });
Question.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

Quiz.hasMany(QuizResponse, { foreignKey: "quizId", as: "responses" });
QuizResponse.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

export function setupAssociations() {}