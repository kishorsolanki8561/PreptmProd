// Wrapper to start Angular SSR for production
// server.ts only exports app() — this script imports and starts it

import { app } from '/var/www/preptm/front/server/en/server.mjs';

const port = process.env['PORT'] || 4001;

app().listen(port, () => {
  console.log(`ProdFront SSR listening on http://localhost:${port}`);
});
