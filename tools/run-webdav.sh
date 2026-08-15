#!/usr/bin/env bash
set -euo pipefail

# Helper to quickly serve the workspace storage as WebDAV using rclone.
# Usage: ./run-webdav.sh [--dir DIR] [--port PORT] [--bind ADDR] [--user USER] [--pass PASS] [--account ACCOUNT_ID]

DIR="$(cd "$(dirname "$0")/.." && pwd)/storage"
PORT=8080
BIND=127.0.0.1
USER=webdav
PASS=webdav
ACCOUNT=""

print_usage() {
  cat <<EOF
Usage: $0 [--dir DIR] [--port PORT] [--bind ADDR] [--user USER] [--pass PASS] [--account ACCOUNT_ID]

Serves a folder over WebDAV using rclone. By default it serves the repository's storage folder.

Examples:
  $0 --port 8080 --user alice --pass S3cret
  $0 --account 09b29824-d09a-4214-940e-1bcaddf9f553 --port 8081

EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir) DIR="$2"; shift 2;;
    --port) PORT="$2"; shift 2;;
    --bind) BIND="$2"; shift 2;;
    --user) USER="$2"; shift 2;;
    --pass) PASS="$2"; shift 2;;
    --account) ACCOUNT="$2"; shift 2;;
    -h|--help) print_usage; exit 0;;
    *) echo "Unknown arg: $1"; print_usage; exit 2;;
  esac
done

if [[ -n "$ACCOUNT" ]]; then
  DIR="$DIR/accounts/$ACCOUNT"
fi

if [[ ! -d "$DIR" ]]; then
  echo "Directory not found: $DIR"
  exit 2
fi

echo "Serving WebDAV from: $DIR"
echo "Bind: $BIND:$PORT  User: $USER"

exec rclone serve webdav "$DIR" --addr "$BIND:$PORT" --user "$USER" --pass "$PASS" --vfs-cache-mode writes
