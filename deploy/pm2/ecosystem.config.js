// PM2 Ecosystem – PreptM Angular SSR
// English SSR: port 4001  |  Hindi SSR: port 4002
// Deploy to: /var/www/preptm/pm2/ecosystem.config.js
// Usage: pm2 start ecosystem.config.js  (first run)
//        pm2 restart preptm-en preptm-hi (on redeploy)

module.exports = {
  apps: [
    {
      name: 'preptm-en',
      script: '/var/www/preptm/front/server/en/server.mjs',
      instances: 2,
      exec_mode: 'cluster',
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
      name: 'preptm-hi',
      script: '/var/www/preptm/front/server/hi/server.mjs',
      instances: 2,
      exec_mode: 'cluster',
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
