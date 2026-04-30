// Hindi SSR wrapper – imports app() and starts Express on PORT
import { app } from '/var/www/preptm/front/server/hi/server.mjs';

const port = process.env['PORT'] || 4002;
app().listen(port, () => {
  console.log(`ProdFront-hi SSR listening on http://localhost:${port}`);
});
