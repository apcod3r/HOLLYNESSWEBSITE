# Hollyness & Respishers — AlmaLinux 9 Deployment Guide

**Target OS:** AlmaLinux 9 (64-bit)  
**Stack:** FastAPI · PostgreSQL 16 · Nginx · Python 3.11 · Node.js 20  
**Domain:** hollyrespishers.com  
**Last updated:** June 2026

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Connect to the Server](#2-connect-to-the-server)
3. [System Update & Core Packages](#3-system-update--core-packages)
4. [Install Node.js 20](#4-install-nodejs-20)
5. [Install Python 3.11](#5-install-python-311)
6. [Install & Configure PostgreSQL 16](#6-install--configure-postgresql-16)
7. [Create Database and User](#7-create-database-and-user)
8. [Install & Configure Nginx](#8-install--configure-nginx)
9. [Clone the Repository](#9-clone-the-repository)
10. [Configure Environment Variables](#10-configure-environment-variables)
11. [Python Virtual Environment & Dependencies](#11-python-virtual-environment--dependencies)
12. [Build the Frontend](#12-build-the-frontend)
13. [Initialise the Database Schema](#13-initialise-the-database-schema)
14. [Configure SELinux](#14-configure-selinux)
15. [Configure the Firewall](#15-configure-the-firewall)
16. [Create the Systemd Service](#16-create-the-systemd-service)
17. [Configure Nginx Virtual Host](#17-configure-nginx-virtual-host)
18. [Obtain SSL Certificate (HTTPS)](#18-obtain-ssl-certificate-https)
19. [Transfer Uploaded Files](#19-transfer-uploaded-files)
20. [Create the Hidden Superuser Account](#20-create-the-hidden-superuser-account)
21. [Set Up Automated Database Backups](#21-set-up-automated-database-backups)
22. [Verify the Deployment](#22-verify-the-deployment)
23. [Day-to-Day Maintenance](#23-day-to-day-maintenance)
24. [Future Recommendations](#24-future-recommendations)

---

## 1. Prerequisites

Before starting, ensure you have:

| Requirement | Detail |
|---|---|
| AlmaLinux 9 VPS | Namecheap, Hostinger, or equivalent — minimum 1 vCPU / 1 GB RAM |
| Root SSH access | Namecheap VPS typically provides root login by default |
| Domain name | DNS A record pointing to the server's public IP |
| GitHub access | Read access to `https://github.com/apcod3r/HOLLYNESSWEBSITE.git` |
| Local machine | `rsync` installed (for transferring uploaded files) |

> **Note on AlmaLinux vs RHEL/Rocky:** AlmaLinux 9 is 1:1 binary compatible with RHEL 9. All commands in this guide also work on Rocky Linux 9 and RHEL 9.

> **Note on Python:** AlmaLinux 9 ships Python 3.11 by default — this is compatible with all project dependencies including `psycopg2-binary` and `pydantic-core`. Do **not** upgrade to Python 3.14.

---

## 2. Connect to the Server

```bash
# Root login (Namecheap VPS default)
ssh root@<SERVER_PUBLIC_IP>

# With SSH key
ssh -i /path/to/your-key root@<SERVER_PUBLIC_IP>
```

All remaining commands in this guide are run **on the server** as root unless stated otherwise.

---

## 3. System Update & Core Packages

```bash
dnf update -y

dnf install -y \
    git curl wget unzip \
    gcc gcc-c++ make \
    libpq-devel openssl-devel libffi-devel \
    nginx \
    ca-certificates
```

---

## 4. Install Node.js 20

```bash
# Add the NodeSource repository for Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -

dnf install -y nodejs

node --version   # should print v20.x.x
npm --version
```

---

## 5. Install Python 3.11

AlmaLinux 9 includes Python 3.11. Verify it is present:

```bash
python3 --version        # Python 3.11.x
python3 -m venv --help   # should not error
```

If `venv` is missing:

```bash
dnf install -y python3 python3-venv python3-devel
```

---

## 6. Install & Configure PostgreSQL 16

AlmaLinux 9's default repositories include PostgreSQL 13. Install version 16 from the official PGDG repository:

```bash
# Add PGDG repository
dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# Disable the built-in PostgreSQL module to avoid conflicts
dnf -qy module disable postgresql

# Install PostgreSQL 16
dnf install -y postgresql16-server postgresql16

# Initialise the database cluster
/usr/pgsql-16/bin/postgresql-16-setup initdb

# Enable and start
systemctl enable --now postgresql-16

# Verify
systemctl status postgresql-16
```

### Allow password authentication

By default, PostgreSQL on AlmaLinux only allows `peer` authentication. Edit `pg_hba.conf` to allow password logins from localhost:

```bash
nano /var/lib/pgsql/16/data/pg_hba.conf
```

Find the lines for `local` and `127.0.0.1/32` and change `ident` / `peer` to `md5`:

```
# TYPE  DATABASE  USER      ADDRESS        METHOD
local   all       all                      md5
host    all       all       127.0.0.1/32   md5
host    all       all       ::1/128        md5
```

Restart PostgreSQL to apply:

```bash
systemctl restart postgresql-16
```

---

## 7. Create Database and User

```bash
sudo -u postgres /usr/pgsql-16/bin/psql <<'SQL'
CREATE USER hollynessadmin WITH PASSWORD 'YOUR_STRONG_DB_PASSWORD';
CREATE DATABASE hollynessdb OWNER hollynessadmin;
GRANT ALL PRIVILEGES ON DATABASE hollynessdb TO hollynessadmin;
\q
SQL
```

> Replace `YOUR_STRONG_DB_PASSWORD` with a secure password. Use the same value in the `.env` file in step 10.

Test the connection:

```bash
PGPASSWORD=YOUR_STRONG_DB_PASSWORD /usr/pgsql-16/bin/psql \
  -U hollynessadmin -h localhost -d hollynessdb -c "\conninfo"
```

Add the PostgreSQL 16 binaries to `PATH` so `pg_dump` and `psql` are available system-wide:

```bash
echo 'export PATH=/usr/pgsql-16/bin:$PATH' >> /etc/profile.d/pgsql.sh
source /etc/profile.d/pgsql.sh
which pg_dump   # should print /usr/pgsql-16/bin/pg_dump
```

---

## 8. Install & Configure Nginx

```bash
systemctl enable --now nginx
systemctl status nginx
```

---

## 9. Clone the Repository

```bash
mkdir -p /var/www/hollyness

git clone https://github.com/apcod3r/HOLLYNESSWEBSITE.git /var/www/hollyness
cd /var/www/hollyness
```

Create directories that git ignores:

```bash
mkdir -p uploads/blog uploads/testimonials uploads/team uploads/partners uploads/hero
mkdir -p backups
```

---

## 10. Configure Environment Variables

```bash
cd /var/www/hollyness/hollyness-api

cp .env.example .env
nano .env
```

Fill in every value:

```env
DATABASE_URL=postgresql://hollynessadmin:YOUR_STRONG_DB_PASSWORD@localhost:5432/hollynessdb
SECRET_KEY=<output of: python3 -c "import secrets; print(secrets.token_hex(64))">
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=https://hollyrespishers.com
```

Restrict file permissions — this file contains secrets:

```bash
chmod 600 /var/www/hollyness/hollyness-api/.env
```

---

## 11. Python Virtual Environment & Dependencies

```bash
cd /var/www/hollyness/hollyness-api

python3 -m venv venv
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt
```

Verify the key packages loaded correctly:

```bash
venv/bin/python -c "import fastapi, sqlalchemy, psycopg2; print('OK')"
```

---

## 12. Build the Frontend

```bash
cd /var/www/hollyness/hollyness-web

npm install
npm run build
```

Confirm the output:

```bash
ls dist/    # should contain index.html and assets/
```

---

## 13. Initialise the Database Schema

```bash
cd /var/www/hollyness/hollyness-api

venv/bin/python - <<'EOF'
from app.database import engine, Base
import app.models.blog, app.models.career, app.models.contact
import app.models.faq, app.models.industry, app.models.job_opening
import app.models.newsletter, app.models.partner, app.models.process_step
import app.models.service, app.models.setting, app.models.team_member
import app.models.testimonial, app.models.user
Base.metadata.create_all(bind=engine)
print("Schema created.")
EOF
```

Alternatively, restore from the production schema dump:

```bash
PGPASSWORD=YOUR_STRONG_DB_PASSWORD psql \
  -U hollynessadmin -h localhost -d hollynessdb \
  -f /var/www/hollyness/deploy/schema.sql
```

---

## 14. Configure SELinux

AlmaLinux 9 ships with SELinux in **Enforcing** mode by default. Without the following, Nginx will be blocked from connecting to the FastAPI backend.

```bash
# Allow nginx to make network connections (proxy to FastAPI on port 8000)
setsebool -P httpd_can_network_connect 1

# Allow nginx to serve files from /var/www/hollyness/uploads/
semanage fcontext -a -t httpd_sys_content_t "/var/www/hollyness/uploads(/.*)?"
restorecon -Rv /var/www/hollyness/uploads/

# Verify SELinux is still enforcing (do NOT set to Permissive in production)
getenforce   # should print: Enforcing
```

> **Important:** Do not disable SELinux system-wide to work around permission issues — this removes a critical security layer. Always fix the specific SELinux policy instead.

---

## 15. Configure the Firewall

AlmaLinux uses `firewalld` instead of `ufw`:

```bash
# Allow SSH, HTTP, and HTTPS
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# Apply the rules
firewall-cmd --reload

# Verify
firewall-cmd --list-all
```

> Do **not** expose port 8000 (FastAPI) to the public internet. It must only be reachable via Nginx on 127.0.0.1.

---

## 16. Create the Systemd Service

```bash
cp /var/www/hollyness/deploy/hollyness-api.service \
   /etc/systemd/system/hollyness-api.service

# On a Namecheap root VPS the User=root line is already correct.
# If you created a separate app user, change it here:
# nano /etc/systemd/system/hollyness-api.service

systemctl daemon-reload
systemctl enable --now hollyness-api

# Verify
systemctl status hollyness-api
```

Check the API responds locally:

```bash
curl -s http://127.0.0.1:8000/api/health
# Expected: {"status":"ok","service":"Hollyness & Respishers API"}
```

---

## 17. Configure Nginx Virtual Host

On AlmaLinux, Nginx uses `/etc/nginx/conf.d/` — no symlink step is needed:

```bash
cp /var/www/hollyness/deploy/nginx.conf \
   /etc/nginx/conf.d/hollyness.conf

# Test configuration
nginx -t    # must print "syntax is ok"

systemctl reload nginx
```

At this point, visiting `http://hollyrespishers.com` should serve the site over HTTP.

---

## 18. Obtain SSL Certificate (HTTPS)

Install Certbot via the EPEL repository and the Nginx plugin:

```bash
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx
```

Ensure DNS is propagated first (`ping hollyrespishers.com` should reach the server IP):

```bash
certbot --nginx \
  -d hollyrespishers.com \
  -d www.hollyrespishers.com \
  --agree-tos --no-eff-email \
  -m your-admin-email@example.com
```

Certbot will automatically update `/etc/nginx/conf.d/hollyness.conf` and set up a cron for auto-renewal.

Test renewal:

```bash
certbot renew --dry-run
```

Confirm the renewal timer:

```bash
systemctl status certbot-renew.timer   # or
cat /etc/cron.d/certbot
```

---

## 19. Transfer Uploaded Files

User-uploaded files live in `uploads/` which is excluded from git. Transfer from your local machine:

```bash
# Run this on your LOCAL machine, not the server
rsync -avz -e "ssh -i /path/to/your-key" \
  /path/to/local/HOLLYNESSWEBSITE/uploads/ \
  root@<SERVER_PUBLIC_IP>:/var/www/hollyness/uploads/
```

Set correct permissions and SELinux context:

```bash
# On the server
chmod -R 755 /var/www/hollyness/uploads/
restorecon -Rv /var/www/hollyness/uploads/
```

---

## 20. Create the Hidden Superuser Account

```bash
cd /var/www/hollyness/hollyness-api

# Edit the script first to set your desired superuser password
nano create_superuser.py   # change SUPERUSER_PASSWORD

venv/bin/python create_superuser.py
```

Keep the superuser credentials private. This account is invisible in the admin user list and cannot be edited or deleted through the admin panel.

---

## 21. Set Up Automated Database Backups

The backup script syncs the local PostgreSQL database to Neon (cloud PostgreSQL) every Monday and Thursday at 23:00, skipping if no data has changed since the last backup.

```bash
# Make the script executable
chmod +x /var/www/hollyness/deploy/backup.sh

# Open the crontab editor
crontab -e

# Add this line:
0 23 * * 1,4 /bin/bash /var/www/hollyness/deploy/backup.sh
```

Test manually:

```bash
/bin/bash /var/www/hollyness/deploy/backup.sh
cat /var/www/hollyness/backups/backup.log
```

---

## 22. Verify the Deployment

```bash
# API health over HTTPS
curl -s https://hollyrespishers.com/api/health

# Frontend (should return 200, not 502)
curl -s -o /dev/null -w "%{http_code}" https://hollyrespishers.com/

# SSL certificate details
curl -vI https://hollyrespishers.com 2>&1 | grep -E "SSL|issuer|expire"

# All three services should show active (running)
systemctl status hollyness-api nginx postgresql-16

# SELinux should still be Enforcing
getenforce
```

---

## 23. Day-to-Day Maintenance

### Deploying Updates

```bash
cd /var/www/hollyness
bash deploy/update.sh
```

The script handles: git pull → frontend build → pip install → DB migrations → service restart.

If git reports a conflict on `package-lock.json`:

```bash
git checkout hollyness-web/package-lock.json
bash deploy/update.sh
```

### Viewing Live Logs

```bash
# Application logs
journalctl -u hollyness-api -f

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

### Database Operations

```bash
# Connect to the database
PGPASSWORD=YOUR_STRONG_DB_PASSWORD psql \
  -U hollynessadmin -h localhost -d hollynessdb

# Manual backup
/bin/bash /var/www/hollyness/deploy/backup.sh

# View backup log
cat /var/www/hollyness/backups/backup.log
```

### Restarting Services

```bash
systemctl restart hollyness-api
systemctl reload nginx
systemctl restart postgresql-16
```

### Checking Disk & Resource Usage

```bash
df -h                               # disk usage
free -h                             # RAM
top -b -n1 | head -20              # CPU / process snapshot
du -sh /var/www/hollyness/uploads/  # upload folder size
ls -t /var/www/hollyness/backups/   # recent backup files
```

### SELinux Troubleshooting

If pages or uploads stop loading after a system update, SELinux may have reset contexts:

```bash
# Check for SELinux denials in the last 10 minutes
ausearch -m avc -ts recent | grep nginx

# Reapply contexts
restorecon -Rv /var/www/hollyness/uploads/
setsebool -P httpd_can_network_connect 1
```

---

## 24. Future Recommendations

The following recommendations follow industry-standard software engineering practices and should be addressed as the platform grows.

### Security

| Priority | Recommendation |
|---|---|
| High | Move `.env` secrets to **HashiCorp Vault** or an encrypted secrets store — never store plaintext passwords in files on disk |
| High | **Create a non-root user** for running the application service: `useradd -m -s /bin/bash hollyness`. Change `User=root` in `hollyness-api.service` to `User=hollyness`. Running services as root violates the principle of least privilege |
| High | Enable **automatic security updates**: `dnf install -y dnf-automatic && systemctl enable --now dnf-automatic.timer` |
| High | Keep SELinux in **Enforcing** mode. If an SELinux denial blocks something, investigate and add the minimum required policy rather than disabling SELinux |
| Medium | Add **fail2ban** to block brute-force SSH attempts: `dnf install -y fail2ban && systemctl enable --now fail2ban` |
| Medium | Rotate the `SECRET_KEY` in `.env` periodically; doing so invalidates all existing login sessions |
| Medium | Implement API **rate limiting** in FastAPI using `slowapi` to prevent abuse of public endpoints |
| Low | Enable **PostgreSQL SSL connections** by configuring `sslmode=require` in the `DATABASE_URL` |

### Infrastructure

| Priority | Recommendation |
|---|---|
| High | Move user-uploaded files to **Cloudflare R2** or **AWS S3** — local disk storage is lost if the VPS is replaced or terminated. R2 has no egress fees and integrates cleanly with a FastAPI backend |
| High | Take a **VPS snapshot** (Namecheap control panel) before any major upgrade or schema change |
| Medium | Place the app behind **Cloudflare** for DDoS protection, global CDN caching and free SSL termination |
| Medium | Set up a **read replica** or offload analytical queries to Neon to avoid impacting the production database |
| Medium | Upgrade to at least 2 GB RAM before enabling more than 2 Uvicorn workers |
| Low | Enable **PostgreSQL connection pooling** with PgBouncer when concurrent users regularly exceed 50 |

### CI/CD & Development Workflow

| Priority | Recommendation |
|---|---|
| High | Implement a **GitHub Actions** workflow to run `tsc --noEmit` and `pytest` on every pull request before merging to `main` |
| High | Create a **staging environment** — a second server or branch where updates are tested before going to production |
| Medium | Replace the manual `ALTER TABLE` approach in `update.sh` with **Alembic** database migrations for proper version-controlled schema changes |
| Medium | Containerise the application with **Docker** and `docker-compose` to make deployments reproducible and portable across operating systems |
| Low | Publish a `CHANGELOG.md` to document changes per release, enabling informed rollback decisions |

### Observability & Monitoring

| Priority | Recommendation |
|---|---|
| High | Set up **uptime monitoring** (UptimeRobot free tier or Better Uptime) to receive instant alerts when the site goes down |
| Medium | Forward application logs to a hosted logging service such as **Papertrail** or **Grafana Loki** for historical analysis and alerting |
| Medium | Add **error tracking** with Sentry (free tier) — wrap the FastAPI app so unhandled exceptions are captured with stack traces |
| Low | Set up a **Grafana + Prometheus** dashboard once traffic grows to visualise response times, DB query latency and server resources |

### Backup Strategy

The current setup backs up to Neon every Monday and Thursday. As the system matures:

- Increase to **daily backups** with a 30-day retention window
- Store backups in **two locations** (e.g., Neon + local encrypted `.sql.gz` in Namecheap object storage) following the 3-2-1 backup rule
- Document and **test the restore procedure** at least quarterly — a backup that has never been restored is unverified
- Always take a manual backup immediately before any schema migration
- Include the `uploads/` directory in backup strategy (not just the database)

### AlmaLinux-Specific Long-Term Notes

- **OS lifecycle:** AlmaLinux 9 is supported until **May 2032**. Plan an OS upgrade evaluation from 2030 onward
- **PostgreSQL upgrades:** When upgrading PostgreSQL major versions (e.g., 16 → 17), use `pg_upgrade` — never `dnf upgrade` across major versions as it will destroy the data directory
- **EPEL dependency:** Certbot relies on EPEL. Keep the EPEL repo enabled and updated
- **Kernel updates** on Namecheap VPS sometimes require a manual reboot from the control panel; the server may not respond to `reboot` over SSH during kernel upgrades

---

*Document maintained by the development team. Update this guide whenever infrastructure changes are made.*
