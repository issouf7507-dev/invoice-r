module.exports = {
  apps: [
    {
      name: "facturer",
      script: "server.js",
      cwd: "/home/dev-issouf/apps/facturer/current",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3999,
        HOSTNAME: "127.0.0.1",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3999,
        HOSTNAME: "127.0.0.1",
      },
      error_file: "/home/dev-issouf/apps/facturer/logs/err.log",
      out_file: "/home/dev-issouf/apps/facturer/logs/out.log",
      log_file: "/home/dev-issouf/apps/facturer/logs/combined.log",
      time: true,
    },
  ],
};
