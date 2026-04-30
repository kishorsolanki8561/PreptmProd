// Single ProdFront wrapper – handles both English and Hindi SSR
// /hi/* → Hindi SSR   (server/hi/server.mjs)
// /*    → English SSR (server/en/server.mjs)

import { app as appEn } from '/var/www/preptm/front/server/en/server.mjs';
import { app as appHi } from '/var/www/preptm/front/server/hi/server.mjs';
import express from 'express';

const port = process.env['PORT'] || 4001;
const server = express();

// Hindi routes
server.use('/hi', appHi());

// English routes (everything else)
server.use('/', appEn());

server.listen(port, () => {
  console.log(`ProdFront SSR (EN + HI) listening on http://localhost:${port}`);
});
