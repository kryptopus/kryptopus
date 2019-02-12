module.exports = {
  apps: [
    {
      name: "BTC",
      script: "docker-compose",

      args: "up btc",
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};
