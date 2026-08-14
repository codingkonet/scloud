import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 2) {
    console.error('Usage: node pair-upload.js <uploadUrl?token=...> <file> [remotePath]');
    process.exit(2);
  }
  const uploadUrl = argv[0];
  const filePath = argv[1];
  const remotePath = argv[2] || path.basename(filePath);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(2);
  }
  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);
  try {
    const res = await fetch(`${uploadUrl}&path=${encodeURIComponent(remotePath)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(stat.size) },
      body: stream,
    });
    if (!res.ok) {
      console.error('Upload failed', res.status, await res.text());
      process.exit(2);
    }
    const data = await res.json();
    console.log('Uploaded:', data.path, data.size);
  } catch (err) {
    console.error('Upload error:', err.message);
    process.exit(2);
  }
}

main();
