import app from "./src/app.js";
import sequelize from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("📦 Base de données synchronisée");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion DB :", err);
  });
