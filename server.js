const path = require("path");
const buildApp = require("./src/app");
const {nodeRoutes,userRoutes} = require('./src/routes/routes')
require("dotenv").config();

const startApp = async () => {
  const appOptions = {
    logger: true,
  };

  const app = buildApp(appOptions);

  const port = /*process.env.APP_PORT || */9000;
  const host = process.env.DB_HOST;
  // const host = `172.24.163.45`;
  nodeRoutes(app);
  userRoutes(app);
  try {
    app.listen(port, host, () => {
      console.log(`Server is running on port ${port} ${host}`);
    });
  } catch (error) {
    throw error;
  }
};

startApp();
