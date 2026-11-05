import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'], '/ledger.js': ['ledger.js', 'text/javascript'] };
createServer(async (req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(new URL(`public/${file[0]}`, import.meta.url)); res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'X-Content-Type-Options': 'nosniff' }); res.end(body); }
  catch { res.writeHead(500); res.end('Unable to load application'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Lite Account listening on port ' + (process.env.PORT || 3000)));
