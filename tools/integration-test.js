import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8787';
const bodyA = 'Integration test A ' + Date.now();
const bodyB = 'Integration test B ' + Date.now();

function ok(v) { if (!v) throw new Error('Assertion failed'); }

(async () => {
  try {
    // Register
    const email = `itest+${Date.now()}@example.com`;
    const register = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'ITest', email, password: 'password123', planId: 'free' }) });
    ok(register.status === 201);
    const setCookie = register.headers.get('set-cookie') || '';
    const cookie = setCookie.split(';')[0];
    console.log('Registered user', email);

    // Upload fileA
    const uploadRes = await fetch(`${BASE}/api/files?path=${encodeURIComponent('itest-a.txt')}`, { method: 'PUT', headers: { 'Content-Type': 'text/plain', 'Cookie': cookie }, body: bodyA });
    ok(uploadRes.status === 201);
    const uploadJson = await uploadRes.json();
    console.log('Uploaded fileA:', uploadJson.path, uploadJson.size);
    await new Promise((r) => setTimeout(r, 200));

    // Create share for fileA
    const shareRes = await fetch(`${BASE}/api/files/share`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookie }, body: JSON.stringify({ path: 'itest-a.txt', expiresHours: 1 }) });
    ok(shareRes.status === 201);
    const shareJson = await shareRes.json();
    console.log('Created share:', shareJson.url);

    // Anonymous fetch of share
    const anon = await fetch(shareJson.url);
    ok(anon.status === 200);
    const blob = await anon.text();
    console.log('Anonymous download length:', blob.length);

    // Create local pair token
    const pairRes = await fetch(`${BASE}/api/local/pair`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookie }, body: JSON.stringify({ expiresHours: 1 }) });
    ok(pairRes.status === 201);
    const pairJson = await pairRes.json();
    console.log('Pair token created. uploadUrl:', pairJson.uploadUrl);

    // Upload fileB using uploadUrl
    const up = await fetch(`${pairJson.uploadUrl}&path=${encodeURIComponent('itest-b.txt')}`, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: bodyB });
    ok(up.status === 201);
    const upJson = await up.json();
    console.log('Pair upload succeeded:', upJson.path, upJson.size);
    await new Promise((r) => setTimeout(r, 200));

    // List shares
    const listRes = await fetch(`${BASE}/api/shares`, { headers: { 'Cookie': cookie } });
    ok(listRes.status === 200);
    const listJson = await listRes.json();
    console.log('Shares count for user:', (listJson.shares || []).length);

    // Revoke share
    const token = shareJson.url.split('/').pop();
    const revoke = await fetch(`${BASE}/api/shares/${encodeURIComponent(token)}`, { method: 'DELETE', headers: { 'Cookie': cookie } });
    ok(revoke.status === 204);
    console.log('Share revoked');

    console.log('\nINTEGRATION TESTS PASSED');
    process.exit(0);
  } catch (err) {
    console.error('Integration test failed:', err.message || err);
    process.exit(2);
  }
})();
