// PM2 Ecosystem – PreptM Production Angular SSR
// ProdFront: port 4001 (cluster, 2 instances)
// Deploy to: /var/www/preptm/pm2/ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'ProdFront',
      script: '/var/www/preptm/front/server/en/server.mjs',
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
