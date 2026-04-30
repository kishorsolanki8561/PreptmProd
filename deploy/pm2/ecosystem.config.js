// PM2 Ecosystem – PreptM Production Angular SSR
// ProdFront-en : port 4001 (English)
// ProdFront-hi : port 4002 (Hindi)
// Deploy to: /var/www/preptm/pm2/ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'ProdFront-en',
      script: '/var/www/preptm/pm2/start-prod-en.mjs',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
      error_file: '/var/log/preptm/pm2-en-error.log',
      out_file:   '/var/log/preptm/pm2-en-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'ProdFront-hi',
      script: '/var/www/preptm/pm2/start-prod-hi.mjs',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4002,
      },
      error_file: '/var/log/preptm/pm2-hi-error.log',
      out_file:   '/var/log/preptm/pm2-hi-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
