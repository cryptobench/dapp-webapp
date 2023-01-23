import environment from "../constants/environment.js";

//This compares with env variables but once we will go out of vue probably we will
//load config diffrent way and then it will need refactor
// TODO : refactor on change config loading
export default {
  isDevelopment() {
    return process.env.ENVIRONMENT === environment.DEVELOPMENT;
  },
  isProduction() {
    return process.env.ENVIRONMENT === environment.PRODUCTION;
  },
  isTest() {
    return process.env.ENVIRONMENT === environment.TEST;
  },
  isProxyInUse() {
    return !this.isDevelopment();
  },
};
