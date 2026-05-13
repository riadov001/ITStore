module.exports = {
  apps: [
    {
      name: "adil-smart-store",
      script: "dist/index.mjs",
      instances: 1,
      exec_mode: "fork",
      node_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Auto-restart on crash
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      // Logs
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
  ],
};
