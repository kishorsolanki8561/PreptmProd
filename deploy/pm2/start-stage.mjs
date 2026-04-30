// StageFront wrapper – handles both English and Hindi SSR
// /hi/* → Hindi SSR   (stage/server/hi/server.mjs)
// /*    → English SSR (stage/server/en/server.mjs)

import { app as appEn } from '/var/www/preptm/stage/server/en/server.mjs';
import { app as appHi } from '/var/www/preptm/stage/server/hi/server.mjs';
import express from 'express';

const port = process.env['PORT'] || 4003;
const server = express();

// Hindi routes
server.use('/hi', appHi());

// English routes (everything else)
server.use('/', appEn());

server.listen(port, () => {
  console.log(`StageFront SSR (EN + HI) listening on http://localhost:${port}`);
});
