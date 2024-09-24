module.exports = {
    apps: [
      {
        name: "Yescoin",
        script: "./yescoin_golld/index.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "50M",
      },
    ],
  };
  