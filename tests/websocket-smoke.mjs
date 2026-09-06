const payload = { moments: [{ id: 'sync-test' }], activeId: 'sync-test', stage: 'score' };
const admin = new WebSocket('ws://localhost:5173');
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('WebSocket timeout')), 5000);
  admin.addEventListener('open', () => admin.send(JSON.stringify({ type: 'hello', role: 'admin', payload })));
  admin.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.type === 'admin-auth' && message.payload.ok) admin.send(JSON.stringify({ type: 'live-state', payload }));
    if (message.payload?.activeId === 'sync-test') { clearTimeout(timer); resolve(); }
  });
});
const live = new WebSocket('ws://localhost:5173');
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('WebSocket timeout')), 5000);
  live.addEventListener('open', () => live.send(JSON.stringify({ type: 'hello', role: 'live' })));
  live.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.payload?.activeId === 'sync-test') { clearTimeout(timer); resolve(); } });
});
admin.close();
live.close();
console.log('websocket-sync=ok');
