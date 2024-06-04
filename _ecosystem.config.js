module.exports = {
    apps: [
      {
        name: "Yescoin",
        script: "./yescoin.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "200M",
      },
    ],
  };
  