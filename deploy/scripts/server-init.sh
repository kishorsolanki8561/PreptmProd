#!/bin/bash
# ─── PreptM Server One-Time Setup ──────────────────────────────────────────────
# Run once on a fresh server (188.241.62.206) as root.
# Prerequisites: nginx, pm2, .NET 6 runtime already installed.
# ──────────────────────────────────────────────────────────────────────────────
set -e

echo "==> Creating directory structure..."
mkdir -p /var/www/preptm/front
mkdir -p /var/www/preptm/admin
mkdir -p /var/www/preptm/api/gateway
mkdir -p /var/www/preptm/api/alldropdown
mkdir -p /var/www/preptm/api/frontapi
mkdir -p /var/www/preptm/api/master
mkdir -p /var/www/preptm/api/translation
mkdir -p /var/www/preptm/api/fileuploader/Content
mkdir -p /var/www/preptm/pm2
mkdir -p /var/log/preptm
mkdir -p /var/cache/nginx/ssr
mkdir -p /var/cache/nginx/dropdown
mkdir -p /var/cache/nginx/front_api

echo "==> Copying nginx configs..."
cp /var/www/preptm/deploy/nginx/preptm.conf      /etc/nginx/sites-available/preptm.conf
cp /var/www/preptm/deploy/nginx/admin.preptm.conf /etc/nginx/sites-available/admin.preptm.conf
cp /var/www/preptm/deploy/nginx/api.preptm.conf   /etc/nginx/sites-available/api.preptm.conf
cp /var/www/preptm/deploy/nginx/file.preptm.conf  /etc/nginx/sites-available/file.preptm.conf

echo "==> Enabling nginx sites..."
ln -sf /etc/nginx/sites-available/preptm.conf      /etc/nginx/sites-enabled/preptm.conf
ln -sf /etc/nginx/sites-available/admin.preptm.conf /etc/nginx/sites-enabled/admin.preptm.conf
ln -sf /etc/nginx/sites-available/api.preptm.conf   /etc/nginx/sites-enabled/api.preptm.conf
ln -sf /etc/nginx/sites-available/file.preptm.conf  /etc/nginx/sites-enabled/file.preptm.conf

# Remove default site if present
rm -f /etc/nginx/sites-enabled/default

echo "==> Testing nginx config..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo "==> Copying systemd service files..."
cp /var/www/preptm/deploy/systemd/gateway.service     /etc/systemd/system/preptm-gateway.service
cp /var/www/preptm/deploy/systemd/alldropdown.service /etc/systemd/system/preptm-alldropdown.service
cp /var/www/preptm/deploy/systemd/frontapi.service    /etc/systemd/system/preptm-frontapi.service
cp /var/www/preptm/deploy/systemd/master.service      /etc/systemd/system/preptm-master.service
cp /var/www/preptm/deploy/systemd/translation.service /etc/systemd/system/preptm-translation.service
cp /var/www/preptm/deploy/systemd/fileuploader.service /etc/systemd/system/preptm-fileuploader.service

echo "==> Enabling systemd services (start on boot)..."
systemctl daemon-reload
systemctl enable preptm-gateway preptm-alldropdown preptm-frontapi \
                 preptm-master preptm-translation preptm-fileuploader

echo "==> Copying PM2 ecosystem config..."
cp /var/www/preptm/deploy/pm2/ecosystem.config.js /var/www/preptm/pm2/ecosystem.config.js

echo ""
echo "==> Server init complete."
echo "    Next steps:"
echo "    1. Push code to GitHub → CI/CD will deploy each service automatically."
echo "    2. After first deploy of front app, run:"
echo "         pm2 start /var/www/preptm/pm2/ecosystem.config.js"
echo "         pm2 save"
echo "         pm2 startup systemd"
echo "    3. Start .NET services after first deploy:"
echo "         systemctl start preptm-gateway preptm-alldropdown preptm-frontapi preptm-master preptm-translation preptm-fileuploader"
