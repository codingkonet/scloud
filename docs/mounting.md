Mounting SavelyCLOUD storage as a network drive (Windows & Linux)

This document shows two pragmatic ways to expose the `storage/` folder so users can mount it as a network drive on Windows and Linux:

- Option A (recommended): use `rclone serve webdav` to expose a WebDAV endpoint from the machine running SavelyCLOUD.
- Option B: run a system WebDAV server (davfs2 on Linux, or a WebDAV-capable service) pointing to the `storage/` folder.

Prerequisites
- Access to the machine running SavelyCLOUD (or a server with access to the repository `storage/` folder).
- `rclone` installed for Option A. See https://rclone.org/install/.
- (Linux clients) `davfs2` for mounting WebDAV via the kernel's VFS, or `rclone` client.
- (Windows clients) ability to connect to a WebDAV endpoint (Map Network Drive or `net use`).

Option A — Quick WebDAV server with rclone (recommended)

1. On the SavelyCLOUD host, run a WebDAV server that serves the `storage` folder (or a specific account folder).

PowerShell / CMD example (serve entire storage directory on port 8080):

```powershell
rclone serve webdav "C:\\path\\to\\savelycloud\\storage" --addr :8080 --user myuser --pass mypass
```

Linux shell example:

```bash
rclone serve webdav "/home/savely/savelycloud/storage" --addr :8080 --user myuser --pass mypass
```

Notes:
- Replace the path with your workspace `storage` folder (for example, `c:\\Users\\Fujitsu\\Documents\\test\\storage`).
- Choose a strong username/password and limit network exposure (bind to localhost or firewall the port).

2. Mount from Windows

- Using File Explorer: "Map network drive" → enter the folder as `http://HOST:8080/` and provide the username/password.
- Or using `net use` (run in an elevated cmd):

```cmd
net use Z: http://HOST:8080/ /user:myuser mypass
```

If Windows prompts about WebDav and needs additional configuration, ensure "WebClient" service is running.

3. Mount from Linux

- Using `davfs2` (system-wide mount):

```bash
sudo apt install davfs2
sudo mkdir -p /mnt/savely
sudo mount -t davfs http://HOST:8080/ /mnt/savely -o username=myuser,password=mypass
```

- Or use `rclone mount` as a client:

```bash
rclone --vfs-cache-mode writes mount webdav_remote: /mnt/savely
# where webdav_remote is an rclone remote configured with the WebDAV endpoint
```

Option B — Run a dedicated WebDAV server on the host

- You may prefer to run a small WebDAV server process that integrates authentication and maps user directories under `storage/accounts/<user-id>`.
- Recommended approach: use `webdav-server` (Node) or an existing system WebDAV solution and point its storage root to `storage/accounts`.
- This option is more involved (you must integrate authentication with SavelyCLOUD accounts.json or reuse existing credentials).

Security and recommendations
- Prefer binding the WebDAV service to `127.0.0.1` and use SSH tunnels or reverse proxies (nginx) with TLS for production exposure.
- Use strong credentials and consider per-account mounts (serve only a specific account subfolder) instead of exposing entire `storage/`.
- If you want the server to enforce existing SavelyCLOUD login credentials, consider implementing a WebDAV endpoint inside the app that authenticates against `accounts.json` and maps authenticated users to their account folder.

Next steps I can take for you
- Add a helper script `tools/run-webdav.js` that starts a WebDAV server for a specific account using Basic auth (quick implementation using `rclone` or a Node WebDAV package).
- Implement an integrated `/webdav/` route in `server.js` that enforces SavelyCLOUD sessions and exposes the per-user storage via WebDAV.

Which option do you want me to implement? If you prefer the quick `rclone` approach I can add helper scripts and example commands; if you want integrated WebDAV in the app I can implement server-side support and a `npm` script.
