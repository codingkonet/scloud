Run helper to expose storage over WebDAV

This folder contains helper scripts to quickly serve the project's `storage/` folder (or a single account subfolder) as a WebDAV endpoint using `rclone`.

Scripts:
- `tools/run-webdav.sh` — POSIX shell wrapper (Linux/macOS). Make executable: `chmod +x tools/run-webdav.sh`.
- `tools/run-webdav.ps1` — PowerShell wrapper (Windows).

Examples

```bash
# Serve entire storage on localhost:8080
tools/run-webdav.sh --port 8080 --user alice --pass S3cret

# Serve only a specific account folder
tools/run-webdav.sh --account 09b29824-d09a-4214-940e-1bcaddf9f553 --port 8081
```

Windows (PowerShell)

```powershell
# Serve entire storage on localhost:8080
.\tools\run-webdav.ps1 -Port 8080 -User alice -Pass S3cret
```

Ensure `rclone` is installed and available on the PATH before using the scripts.
