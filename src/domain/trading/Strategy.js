module.exports = class Strategy {
  async execute(environment) {
    // To override
    console.log(environment);
  }
};
