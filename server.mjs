import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { networkInterfaces } from 'node:os';

const root = process.cwd();
const PORT = Number(process.env.PORT) || 5173;
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
let currentLiveState = null;
const clients = new Set();
const lanAddresses = Object.values(networkInterfaces()).flat().filter(item => item?.family === 'IPv4' && !item.internal).map(item => item.address);
const primaryLan = lanAddresses[0] || '未检测到局域网 IPv4';

const encodeFrame = text => {
  const payload = Buffer.from(text); const length = payload.length;
  if (length < 126) return Buffer.concat([Buffer.from([0x81, length]), payload]);
  if (length < 65536) { const header = Buffer.alloc(4); header[0] = 0x81; header[1] = 126; header.writeUInt16BE(length, 2); return Buffer.concat([header, payload]); }
  const header = Buffer.alloc(10); header[0] = 0x81; header[1] = 127; header.writeBigUInt64BE(BigInt(length), 2); return Buffer.concat([header, payload]);
};
const send = (socket, payload) => socket.writable && socket.write(encodeFrame(JSON.stringify(payload)));
const broadcast = () => clients.forEach(socket => send(socket, { type: 'live-state', payload: currentLiveState }));
const handleMessage = (socket, text) => {
  try {
    const message = JSON.parse(text);
    if (message.type === 'hello') {
      socket.role = message.role;
      socket.authorized = message.role === 'admin' && (!ADMIN_KEY || message.adminKey === ADMIN_KEY);
      send(socket, { type: 'admin-auth', payload: { ok: socket.authorized, required: Boolean(ADMIN_KEY) } });
      if (!currentLiveState && socket.authorized && message.role === 'admin' && message.payload?.moments?.length) { currentLiveState = message.payload; broadcast(); }
      send(socket, { type: 'live-state', payload: currentLiveState });
    }
    if (message.type === 'ping') send(socket, { type: 'pong' });
    if (message.type === 'live-state' && socket.authorized && message.payload?.moments?.length) { currentLiveState = message.payload; broadcast(); }
  } catch { /* Ignore malformed client messages. */ }
};
const consumeFrames = socket => {
  while (socket.buffer.length >= 2) {
    const first = socket.buffer[0], second = socket.buffer[1]; let offset = 2; let length = second & 0x7f;
    if (length === 126) { if (socket.buffer.length < 4) return; length = socket.buffer.readUInt16BE(2); offset = 4; }
    if (length === 127) { if (socket.buffer.length < 10) return; length = Number(socket.buffer.readBigUInt64BE(2)); offset = 10; }
    const masked = Boolean(second & 0x80); const fullLength = offset + (masked ? 4 : 0) + length;
    if (socket.buffer.length < fullLength) return;
    const mask = masked ? socket.buffer.subarray(offset, offset + 4) : null; offset += masked ? 4 : 0;
    const payload = Buffer.from(socket.buffer.subarray(offset, offset + length)); socket.buffer = socket.buffer.subarray(fullLength);
    if ((first & 0x0f) === 0x8) { socket.end(); return; }
    if ((first & 0x0f) !== 0x1) continue;
    if (mask) for (let index = 0; index < payload.length; index += 1) payload[index] ^= mask[index % 4];
    handleMessage(socket, payload.toString('utf8'));
  }
};
const server = createServer(async (req, res) => {
  if (req.url?.split('?')[0] === '/health' || req.url?.split('?')[0] === '/network-test') { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify({ ok: true, service: 'novel-roast-live' })); return; }
  try {
    const requestPath = req.url.split('?')[0]; const path = requestPath === '/' || !extname(requestPath) ? '/index.html' : requestPath;
    const target = normalize(join(root, 'src', path === '/index.html' ? 'index.html' : path.replace(/^\//, '')));
    if (!target.startsWith(join(root, 'src'))) throw new Error('Bad path');
    const content = await readFile(target); res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream' }); res.end(content);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); }
});
server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key']; if (!key) { socket.destroy(); return; }
  const accept = createHash('sha1').update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  socket.buffer = Buffer.alloc(0); clients.add(socket);
  socket.on('data', data => { socket.buffer = Buffer.concat([socket.buffer, data]); consumeFrames(socket); });
  socket.on('close', () => clients.delete(socket)); socket.on('error', () => clients.delete(socket));
});
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Novel Roast Console listening on 0.0.0.0:${PORT}`); console.log(`Local: http://localhost:${PORT}`); console.log(`Network: http://${primaryLan}:${PORT}`); console.log(`Phone live: http://${primaryLan}:${PORT}/live`); console.log(`Computer admin: http://${primaryLan}:${PORT}/admin`); console.log(`WebSocket: ws://${primaryLan}:${PORT}`);
});
