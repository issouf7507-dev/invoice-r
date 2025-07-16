module.exports = {
  apps: [
    {
      name: "facturer",
      script: "npm",
      args: "start",
      cwd: "/var/www/webapp/facturer/current",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/www/webapp/facturer/logs/err.log",
      out_file: "/var/www/webapp/facturer/logs/out.log",
      log_file: "/var/www/webapp/facturer/logs/combined.log",
      time: true,
    },
  ],
};
