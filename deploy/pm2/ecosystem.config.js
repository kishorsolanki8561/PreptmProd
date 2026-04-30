// PM2 Ecosystem – PreptM Production Angular SSR
// Single ProdFront handles both EN and HI on port 4001
// Deploy to: /var/www/preptm/pm2/ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'ProdFront',
      script: '/var/www/preptm/pm2/start-prod.mjs',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
      error_file: '/var/log/preptm/pm2-prod-error.log',
      out_file:   '/var/log/preptm/pm2-prod-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
