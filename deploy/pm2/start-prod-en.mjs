// English SSR wrapper – imports app() and starts Express on PORT
import { app } from '/var/www/preptm/front/server/en/server.mjs';

const port = process.env['PORT'] || 4001;
app().listen(port, () => {
  console.log(`ProdFront-en SSR listening on http://localhost:${port}`);
});
