const config = {
    app: {
      version: '1.0.0',
      port: 9000,
    },
    db: {
      type: 'mysql',
      // host: 'localhost',
      host: '192.168.1.11',
      user: 'roott',
      pwd: 'root',
      MAX_POOL: 10,
      MIN_POOL: 0,
      IDLE: 10000,
      Port: 3306,
      database: 'dev_pj',
      // database: 'cep',
      logging: false,
    },
  };
  
  module.exports = config;

  
  
  