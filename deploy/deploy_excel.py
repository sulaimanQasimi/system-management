#!/usr/bin/env python3
"""Deploy AD Excel feature + vendor packages (offline) to 10.77.16.24."""

from __future__ import annotations

import io
import sys
import tarfile
from pathlib import Path

import paramiko

HOST = "10.77.16.24"
USER = "users_servers_mgmt"
PASSWORD = "Modkbl@123"
APP_DIR = "/var/www/system-management"
ROOT = Path(r"e:\system management\system-management")

FILES = [
    "composer.json",
    "composer.lock",
    "config/excel.php",
    "routes/web.php",
    "app/Http/Controllers/ActiveDirectoryUserController.php",
    "app/Http/Requests/ImportActiveDirectoryUsersRequest.php",
    "app/Exports/ActiveDirectoryUsersExport.php",
    "app/Imports/ActiveDirectoryUsersImport.php",
    "resources/js/pages/ad-users/index.tsx",
    "resources/js/locales/en.ts",
    "resources/js/locales/fa.ts",
    "resources/js/locales/types.ts",
]

DIRS = [
    "public/build",
    "resources/js/routes",
    "vendor/maatwebsite",
    "vendor/phpoffice",
    "vendor/maennchen",
    "vendor/markbaker",
    "vendor/composer",
]


def connect() -> paramiko.SSHClient:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASSWORD, timeout=45)
    return client


def run_script(client: paramiko.SSHClient, script: str, timeout: int = 300) -> int:
    sftp = client.open_sftp()
    with sftp.file("/tmp/sm_deploy.sh", "w") as f:
        f.write(script)
    sftp.close()

    cmd = "chmod +x /tmp/sm_deploy.sh && bash /tmp/sm_deploy.sh"
    print(">>> running /tmp/sm_deploy.sh", flush=True)
    stdin, stdout, _ = client.exec_command(
        f"sudo -S -p '' bash -lc {repr(cmd)}",
        timeout=timeout,
        get_pty=True,
    )
    stdin.write(PASSWORD + "\n")
    stdin.flush()
    out = stdout.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out[-8000:], flush=True)
    print(f"exit {code}", flush=True)
    return code


def add_path(tar: tarfile.TarFile, rel: str) -> None:
    path = ROOT / rel
    if not path.exists():
        print(f"skip missing: {rel}", flush=True)
        return
    if path.is_dir():
        count = 0
        for child in path.rglob("*"):
            if child.is_file():
                tar.add(child, arcname=child.relative_to(ROOT).as_posix())
                count += 1
        print(f"added dir {rel} ({count} files)", flush=True)
    else:
        tar.add(path, arcname=rel)
        print(f"added {rel}", flush=True)


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    print("packing...", flush=True)

    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as tar:
        for rel in FILES:
            add_path(tar, rel)
        for rel in DIRS:
            add_path(tar, rel)

    payload = buf.getvalue()
    print(f"archive size: {len(payload) / 1024 / 1024:.2f} MB", flush=True)

    print("connecting...", flush=True)
    client = connect()
    print("uploading archive...", flush=True)
    sftp = client.open_sftp()
    with sftp.file("/tmp/sm-excel-deploy.tgz", "wb") as remote:
        remote.write(payload)
    sftp.close()
    print("uploaded", flush=True)

    script = f"""#!/bin/bash
set -e
APP_DIR="{APP_DIR}"
tar -xzf /tmp/sm-excel-deploy.tgz -C "$APP_DIR"
rm -f /tmp/sm-excel-deploy.tgz

python3 <<'PY'
from pathlib import Path
p = Path("/var/www/system-management/.env")
lines = p.read_text(encoding="utf-8").splitlines()
out, found = [], False
for line in lines:
    if line.startswith("APP_NAME="):
        out.append('APP_NAME="System Management"')
        found = True
    else:
        out.append(line)
if not found:
    out.insert(0, 'APP_NAME="System Management"')
p.write_text("\\n".join(out) + "\\n", encoding="utf-8")
print([l for l in out if l.startswith("APP_NAME=")][0])
PY

cd "$APP_DIR"
php artisan package:discover --ansi
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

test -d vendor/maatwebsite/excel && echo OK-excel
php -r 'require "vendor/autoload.php"; echo class_exists("Maatwebsite\\\\Excel\\\\Facades\\\\Excel") ? "OK-class\\n" : "MISSING-class\\n";'
php artisan route:list --name=ad-users --no-ansi | head -20
ls -la public/build/manifest.json
grep '^APP_NAME=' .env
rm -f /tmp/sm_deploy.sh
"""

    code = run_script(client, script, timeout=300)
    client.close()
    return code


if __name__ == "__main__":
    raise SystemExit(main())
