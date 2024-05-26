export const EnvConfiguration = () => ({
  evironment: process.env.ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
});
