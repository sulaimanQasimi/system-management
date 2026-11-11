#!/usr/bin/env python3
"""Finish Excel deploy: upload full vendor + clear caches on 10.77.16.24."""

from __future__ import annotations

import sys
from pathlib import Path

import paramiko

HOST = "10.77.16.24"
USER = "users_servers_mgmt"
PASSWORD = "Modkbl@123"
APP_DIR = "/var/www/system-management"
ROOT = Path(r"e:\system management\system-management")
VENDOR_TGZ = ROOT / "deploy" / "vendor-full.tgz"


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if not VENDOR_TGZ.exists():
        print("missing vendor-full.tgz", flush=True)
        return 1

    print(f"vendor archive: {VENDOR_TGZ.stat().st_size / 1024 / 1024:.1f} MB", flush=True)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("connecting...", flush=True)
    client.connect(HOST, username=USER, password=PASSWORD, timeout=45)

    print("uploading vendor...", flush=True)
    sftp = client.open_sftp()
    sftp.put(str(VENDOR_TGZ), "/tmp/vendor-full.tgz")

    script = f"""#!/bin/bash
set -e
APP_DIR="{APP_DIR}"
cd "$APP_DIR"
rm -rf vendor
tar -xzf /tmp/vendor-full.tgz -C "$APP_DIR"
rm -f /tmp/vendor-full.tgz

php artisan package:discover --ansi
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

test -d vendor/maatwebsite/excel && echo OK-excel
php -r 'require "vendor/autoload.php"; echo class_exists("Maatwebsite\\\\Excel\\\\Facades\\\\Excel") ? "OK-class\\n" : "MISSING-class\\n";'
php artisan route:list --name=ad-users --no-ansi | head -20
ls -la public/build/manifest.json app/Exports/ActiveDirectoryUsersExport.php
grep '^APP_NAME=' .env
rm -f /tmp/sm_finish.sh
"""
    with sftp.file("/tmp/sm_finish.sh", "w") as f:
        f.write(script)
    sftp.close()

    print("extracting + clearing caches...", flush=True)
    cmd = "chmod +x /tmp/sm_finish.sh && bash /tmp/sm_finish.sh"
    stdin, stdout, _ = client.exec_command(
        f"sudo -S -p '' bash -lc {repr(cmd)}",
        timeout=600,
        get_pty=True,
    )
    stdin.write(PASSWORD + "\n")
    stdin.flush()
    out = stdout.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    print(out[-8000:], flush=True)
    print(f"exit {code}", flush=True)
    client.close()
    return code


if __name__ == "__main__":
    raise SystemExit(main())
