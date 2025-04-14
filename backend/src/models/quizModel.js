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
});

export default Quiz;
