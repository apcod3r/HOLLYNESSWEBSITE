# Hollyness & Respishers — Ubuntu Server Deployment Guide

**Target OS:** Ubuntu 24.04 LTS / 26.04  
**Stack:** FastAPI · PostgreSQL 16 · Nginx · Python 3.13 · Node.js 20  
**Domain:** hollyrespishers.com  
**Last updated:** June 2026

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Connect to the Server](#2-connect-to-the-server)
3. [System Update & Core Packages](#3-system-update--core-packages)
4. [Install Node.js 20](#4-install-nodejs-20)
5. [Install Python 3.13](#5-install-python-313)
6. [Install & Configure PostgreSQL](#6-install--configure-postgresql)
7. [Create Database and User](#7-create-database-and-user)
8. [Clone the Repository](#8-clone-the-repository)
9. [Configure Environment Variables](#9-configure-environment-variables)
10. [Python Virtual Environment & Dependencies](#10-python-virtual-environment--dependencies)
11. [Build the Frontend](#11-build-the-frontend)
12. [Initialise the Database Schema](#12-initialise-the-database-schema)
13. [Create the Systemd Service](#13-create-the-systemd-service)
14. [Configure Nginx](#14-configure-nginx)
15. [Firewall & AWS Security Groups](#15-firewall--aws-security-groups)
16. [Obtain SSL Certificate (HTTPS)](#16-obtain-ssl-certificate-https)
17. [Transfer Uploaded Files](#17-transfer-uploaded-files)
18. [Create the Hidden Superuser Account](#18-create-the-hidden-superuser-account)
19. [Set Up Automated Database Backups](#19-set-up-automated-database-backups)
20. [Verify the Deployment](#20-verify-the-deployment)
21. [Day-to-Day Maintenance](#21-day-to-day-maintenance)
22. [Future Recommendations](#22-future-recommendations)

---

## 1. Prerequisites

Before starting, ensure you have:

| Requirement | Detail |
|---|---|
| Ubuntu server | AWS EC2, DigitalOcean Droplet, or equivalent — minimum 1 vCPU / 1 GB RAM |
| SSH key pair | `.pem` file (AWS) or `~/.ssh/id_rsa` (standard) |
| Domain name | DNS A record pointing to the server's public IP |
| GitHub access | Read access to `https://github.com/apcod3r/HOLLYNESSWEBSITE.git` |
| Local machine | `rsync` installed (for transferring uploaded files) |

> **Note on Python version:** Ubuntu 26.04 ships Python 3.14 by default. This project requires Python 3.13 because `psycopg2-binary` and `pydantic-core` do not yet support 3.14. Always verify with `python3 --version` after installation.

---

## 2. Connect to the Server

```bash
# AWS EC2
ssh -i /path/to/your-key.pem ubuntu@<SERVER_PUBLIC_IP>

# Standard VPS (password or key-based)
ssh ubuntu@<SERVER_PUBLIC_IP>
```

All remaining commands in this guide are run **on the server** unless stated otherwise.

---

## 3. System Update & Core Packages

```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y \
    git curl wget unzip build-essential \
    libpq-dev libssl-dev libffi-dev \
    nginx certbot python3-certbot-nginx \
    ca-certificates gnupg lsb-release
```

---

## 4. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # should print v20.x.x
npm --version
```

---

## 5. Install Python 3.13

Ubuntu 26.04 ships Python 3.14. Install 3.13 from the deadsnakes PPA:

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.13 python3.13-venv python3.13-dev

python3.13 --version   # Python 3.13.x
```

> If `deadsnakes` does not yet carry 3.13 for your Ubuntu release, Python 3.13 is also available via the official Ubuntu repository on 24.04. Check with `apt-cache policy python3.13`.

---

## 6. Install & Configure PostgreSQL

```bash
# Install PostgreSQL 16
sudo apt install -y postgresql postgresql-contrib

# Start and enable on boot
sudo systemctl enable --now postgresql

# Verify
sudo systemctl status postgresql
```

---

## 7. Create Database and User

```bash
sudo -u postgres psql <<'SQL'
CREATE USER hollynessadmin WITH PASSWORD 'YOUR_STRONG_DB_PASSWORD';
CREATE DATABASE hollynessdb OWNER hollynessadmin;
GRANT ALL PRIVILEGES ON DATABASE hollynessdb TO hollynessadmin;
\q
SQL
```

> Replace `YOUR_STRONG_DB_PASSWORD` with a secure password. Use the same value in the `.env` file in step 9.

Test the connection:

```bash
PGPASSWORD=YOUR_STRONG_DB_PASSWORD psql \
  -U hollynessadmin -h localhost -d hollynessdb -c "\conninfo"
```

---

## 8. Clone the Repository

```bash
sudo mkdir -p /var/www/hollyness
sudo chown ubuntu:ubuntu /var/www/hollyness

git clone https://github.com/apcod3r/HOLLYNESSWEBSITE.git /var/www/hollyness
cd /var/www/hollyness
```

Create directories that git ignores:

```bash
mkdir -p uploads/blog uploads/testimonials uploads/team uploads/partners uploads/hero
mkdir -p backups
```

---

## 9. Configure Environment Variables

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

## 10. Python Virtual Environment & Dependencies

```bash
cd /var/www/hollyness/hollyness-api

python3.13 -m venv venv
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt
```

Verify the key packages loaded correctly:

```bash
venv/bin/python -c "import fastapi, sqlalchemy, psycopg2; print('OK')"
```

---

## 11. Build the Frontend

```bash
cd /var/www/hollyness/hollyness-web

npm install
npm run build
```

Confirm the output:

```bash
ls dist/          # should contain index.html and assets/
```

---

## 12. Initialise the Database Schema

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

## 13. Create the Systemd Service

```bash
sudo cp /var/www/hollyness/deploy/hollyness-api.service \
        /etc/systemd/system/hollyness-api.service

# Edit the User line if you are NOT running as root
sudo nano /etc/systemd/system/hollyness-api.service
# Change: User=root  →  User=ubuntu  (or whichever user owns /var/www/hollyness)

sudo systemctl daemon-reload
sudo systemctl enable --now hollyness-api

# Verify it is running
sudo systemctl status hollyness-api
```

Check the API is responding locally:

```bash
curl -s http://127.0.0.1:8000/api/health
# Expected: {"status":"ok","service":"Hollyness & Respishers API"}
```

---

## 14. Configure Nginx

```bash
sudo cp /var/www/hollyness/deploy/nginx.conf \
        /etc/nginx/sites-available/hollyness

sudo ln -s /etc/nginx/sites-available/hollyness \
           /etc/nginx/sites-enabled/hollyness

# Remove the default site if still active
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t          # must print "syntax is ok"
sudo systemctl reload nginx
```

---

## 15. Firewall & AWS Security Groups

### UFW (on the server)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'    # opens ports 80 and 443
sudo ufw enable
sudo ufw status
```

### AWS EC2 Security Group (in AWS Console)

Navigate to **EC2 → Security Groups → your instance's security group → Inbound rules** and add:

| Type | Protocol | Port | Source |
|---|---|---|---|
| SSH | TCP | 22 | Your IP (not 0.0.0.0) |
| HTTP | TCP | 80 | 0.0.0.0/0 and ::/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 and ::/0 |

> **Security practice:** Restrict SSH source to your IP address rather than allowing the entire internet. Rotate the key pair if it is ever exposed.

---

## 16. Obtain SSL Certificate (HTTPS)

Ensure DNS is propagated first (`ping hollyrespishers.com` should reach the server IP):

```bash
sudo certbot --nginx \
  -d hollyrespishers.com \
  -d www.hollyrespishers.com \
  --agree-tos --no-eff-email \
  -m your-admin-email@example.com
```

Certbot will automatically update the nginx config and set up auto-renewal. Test renewal:

```bash
sudo certbot renew --dry-run
```

Confirm auto-renewal is scheduled:

```bash
sudo systemctl status snap.certbot.renew.timer   # or
sudo systemctl status certbot.timer
```

---

## 17. Transfer Uploaded Files

User-uploaded files (blog images, team photos, testimonials, partner logos) live in `uploads/` which is excluded from git. Transfer them from your local machine:

```bash
# Run this on your LOCAL machine, not the server
rsync -avz -e "ssh -i /path/to/your-key.pem" \
  /path/to/local/HOLLYNESSWEBSITE/uploads/ \
  ubuntu@<SERVER_PUBLIC_IP>:/var/www/hollyness/uploads/
```

Set correct permissions:

```bash
# On the server
sudo chown -R ubuntu:ubuntu /var/www/hollyness/uploads/
chmod -R 755 /var/www/hollyness/uploads/
```

---

## 18. Create the Hidden Superuser Account

```bash
cd /var/www/hollyness/hollyness-api

# Edit the script first to set your desired superuser password
nano create_superuser.py   # change SUPERUSER_PASSWORD

venv/bin/python create_superuser.py
```

Keep the superuser credentials private. This account is invisible in the admin user list.

---

## 19. Set Up Automated Database Backups

The backup script syncs the local PostgreSQL database to Neon (cloud PostgreSQL) every Monday and Thursday at 23:00, skipping if no data has changed.

```bash
# Verify the script is executable
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

## 20. Verify the Deployment

```bash
# API health
curl -s https://hollyrespishers.com/api/health

# Frontend (should return HTML, not 502)
curl -s -o /dev/null -w "%{http_code}" https://hollyrespishers.com/

# SSL certificate
curl -vI https://hollyrespishers.com 2>&1 | grep -E "SSL|issuer|expire"

# Service status
sudo systemctl status hollyness-api nginx postgresql
```

All three services should show `active (running)`.

---

## 21. Day-to-Day Maintenance

### Deploying Updates

```bash
cd /var/www/hollyness
bash deploy/update.sh
```

The script handles: git pull → frontend build → pip install → DB migrations → service restart.

### Viewing Live Logs

```bash
# Application logs
sudo journalctl -u hollyness-api -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
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
sudo systemctl restart hollyness-api
sudo systemctl reload nginx
sudo systemctl restart postgresql
```

### Checking Disk & Resource Usage

```bash
df -h                              # disk usage
free -h                            # RAM
top -b -n1 | head -20             # CPU / process snapshot
du -sh /var/www/hollyness/uploads/ # upload folder size
```

---

## 22. Future Recommendations

The following recommendations follow industry-standard software engineering practices and should be addressed as the platform grows.

### Security

| Priority | Recommendation |
|---|---|
| High | Move `.env` secrets to **AWS Secrets Manager** or **HashiCorp Vault** — never store plaintext passwords in files on disk |
| High | Restrict SSH access to a specific IP range or use **AWS Systems Manager Session Manager** to eliminate the need for port 22 entirely |
| High | Enable **automatic OS security updates**: `sudo apt install unattended-upgrades && sudo dpkg-reconfigure unattended-upgrades` |
| Medium | Add **fail2ban** to block brute-force SSH attempts: `sudo apt install fail2ban` |
| Medium | Rotate the `SECRET_KEY` in `.env` periodically; doing so invalidates all existing login sessions |
| Medium | Implement API **rate limiting** in FastAPI using `slowapi` to prevent abuse of public endpoints |
| Low | Enable **PostgreSQL SSL connections** by configuring `sslmode=require` in the `DATABASE_URL` |

### Infrastructure

| Priority | Recommendation |
|---|---|
| High | Move user-uploaded files to **Amazon S3** or **Cloudflare R2** — local disk storage is lost if the instance is replaced or terminated |
| High | Take a **snapshot of the EC2 instance** before any major upgrade or schema change |
| Medium | Place the app behind **AWS CloudFront** or **Cloudflare** CDN for global edge caching, DDoS protection and better performance |
| Medium | Set up a **read replica** of PostgreSQL for analytics queries to avoid impacting the production database |
| Medium | Move to a `t3.small` or `t3.medium` instance if the site grows; the current single-instance architecture will handle moderate traffic |
| Low | Enable **PostgreSQL connection pooling** with PgBouncer when concurrent users regularly exceed 50 |

### CI/CD & Development Workflow

| Priority | Recommendation |
|---|---|
| High | Implement a **GitHub Actions** workflow to run `tsc --noEmit` and `pytest` on every pull request before merging |
| High | Create a **staging environment** — a second server or branch where updates are tested before going to production |
| Medium | Add **automated database migration** tooling (Alembic for SQLAlchemy) to replace the manual `ALTER TABLE` approach in `update.sh` |
| Medium | Containerise the application with **Docker** and `docker-compose` to make deployments reproducible across environments |
| Low | Publish a `CHANGELOG.md` to document changes per release, enabling rollback decisions |

### Observability & Monitoring

| Priority | Recommendation |
|---|---|
| High | Set up **uptime monitoring** (UptimeRobot free tier or AWS CloudWatch) to alert you when the site goes down |
| Medium | Forward application logs to **AWS CloudWatch Logs** or a hosted logging service for historical analysis |
| Medium | Add **error tracking** with Sentry (free tier) — wrap the FastAPI app so unhandled exceptions are captured with full stack traces |
| Low | Set up a Grafana + Prometheus dashboard once traffic grows to understand response times and DB query performance |

### Backup Strategy

The current setup backs up to Neon every Monday and Thursday. As the system matures:

- Keep **daily** backups with a 30-day retention window
- Store backups in **two locations** (e.g., Neon + S3) following the 3-2-1 backup rule
- Document and **test the restore procedure** — a backup that has never been restored is unverified
- Before any schema migration, always take a manual backup

---

*Document maintained by the development team. Update this guide whenever infrastructure changes are made.*
