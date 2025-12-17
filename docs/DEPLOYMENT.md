# Deployment Guide

This guide covers various deployment options for TodoApp.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Docker Deployment](#docker-deployment)
  - [Traditional Deployment](#traditional-deployment)
  - [Cloud Platforms](#cloud-platforms)
- [Post-Deployment](#post-deployment)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Docker (for containerized deployment)
- A domain name (recommended for production)
- SSL certificate (Let's Encrypt recommended)

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with production values:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-a-strong-random-secret>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://yourdomain.com
```

**Important:** Generate a strong JWT secret using:
```bash
openssl rand -base64 32
```

### Database Configuration

For production, consider using PostgreSQL or MySQL instead of SQLite:

1. Update `backend/src/config/database.js` to use your production database
2. Run migrations to set up the schema
3. Configure database connection pooling
4. Set up regular backups

## Deployment Options

### Option 1: Docker Deployment

Docker provides the easiest deployment method.

#### Using Docker Compose

1. **Clone the repository:**
```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp
```

2. **Set environment variables:**
```bash
export JWT_SECRET=$(openssl rand -base64 32)
```

3. **Build and start:**
```bash
docker-compose up -d
```

4. **Check status:**
```bash
docker-compose ps
docker-compose logs -f
```

The application will be available at `http://localhost:3000`

#### Using Docker Only

1. **Build the image:**
```bash
docker build -t todoapp:latest .
```

2. **Run the container:**
```bash
docker run -d \
  --name todoapp \
  -p 3000:3000 \
  -e JWT_SECRET="your-secret-key" \
  -e NODE_ENV=production \
  -v $(pwd)/data:/app/data \
  todoapp:latest
```

### Option 2: Traditional Deployment

#### On a VPS (Ubuntu/Debian)

1. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone and build:**
```bash
git clone https://github.com/andrewyk/testing_mcp.git
cd testing_mcp

# Backend
cd backend
npm ci --production
cd ..

# Frontend
cd frontend
npm ci
npm run build
cd ..
```

3. **Set up as a service:**

Create `/etc/systemd/system/todoapp.service`:

```ini
[Unit]
Description=TodoApp Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/todoapp/backend
Environment=NODE_ENV=production
Environment=JWT_SECRET=your-secret-key
Environment=PORT=3000
ExecStart=/usr/bin/node src/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

4. **Start the service:**
```bash
sudo systemctl enable todoapp
sudo systemctl start todoapp
sudo systemctl status todoapp
```

5. **Configure Nginx as reverse proxy:**

Create `/etc/nginx/sites-available/todoapp`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Frontend static files
    root /var/www/todoapp/frontend/dist;
    index index.html;
    
    # Try to serve static files, fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

6. **Enable and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/todoapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Cloud Platforms

#### Heroku

1. **Install Heroku CLI**
2. **Create Heroku app:**
```bash
heroku create todoapp-yourname
```

3. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set NODE_ENV=production
```

4. **Deploy:**
```bash
git push heroku main
```

#### AWS (EC2)

1. Launch an EC2 instance (Ubuntu 22.04 LTS)
2. Configure security groups (ports 80, 443, 22)
3. Follow the VPS deployment steps above
4. Consider using AWS RDS for the database
5. Use AWS Certificate Manager for SSL

#### DigitalOcean

1. Create a Droplet (Ubuntu 22.04)
2. Follow the VPS deployment steps
3. Use DigitalOcean Managed Databases for production database
4. Set up monitoring with DigitalOcean Monitoring

#### Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
```bash
cd frontend
vercel
```

**Backend on Railway:**
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Post-Deployment

### SSL Certificate Setup

Using Let's Encrypt (Certbot):

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
sudo systemctl reload nginx
```

### Database Migration

If using a production database:

1. Backup existing data
2. Run migration scripts
3. Verify data integrity
4. Update connection strings

### Initial Data Setup

Create initial admin user if needed:

```bash
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"secure-password","name":"Admin"}'
```

## Monitoring and Maintenance

### Health Checks

Set up monitoring for:
- `/health` endpoint
- Response times
- Error rates
- Database connections

Recommended tools:
- **Uptime Robot**: Free uptime monitoring
- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking
- **DataDog**: Infrastructure monitoring

### Logging

Configure application logging:

```javascript
// backend/src/config/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export default logger;
```

### Backup Strategy

**Database Backups:**
```bash
# Daily cron job
0 2 * * * /usr/local/bin/backup-database.sh
```

**Backup script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
sqlite3 /app/data/database.sqlite ".backup /backups/database-$DATE.sqlite"
# Keep only last 30 days
find /backups -name "database-*.sqlite" -mtime +30 -delete
```

### Performance Optimization

1. **Enable Gzip compression** in Nginx
2. **Set up CDN** for static assets (CloudFlare, AWS CloudFront)
3. **Implement caching** (Redis for sessions/API responses)
4. **Database indexing** for frequently queried fields
5. **Connection pooling** for database connections

### Security Hardening

1. **Firewall configuration:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Regular updates:**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Fail2ban** to prevent brute force:
```bash
sudo apt install fail2ban
```

4. **Regular security audits:**
```bash
npm audit
npm audit fix
```

### Scaling Considerations

**Horizontal Scaling:**
- Use a load balancer (Nginx, HAProxy, AWS ELB)
- Deploy multiple application instances
- Use a centralized database (not SQLite)
- Implement Redis for session storage

**Vertical Scaling:**
- Increase server resources (CPU, RAM)
- Optimize database queries
- Enable caching

## Troubleshooting

### Application won't start
- Check logs: `docker logs todoapp` or `journalctl -u todoapp`
- Verify environment variables
- Check port availability: `netstat -tulpn | grep 3000`

### Database connection errors
- Verify database credentials
- Check network connectivity
- Ensure database service is running

### 502 Bad Gateway
- Backend service not running
- Check Nginx configuration
- Verify proxy settings

### High memory usage
- Check for memory leaks
- Implement connection pooling
- Monitor with `htop` or cloud metrics

## Rollback Procedure

If deployment fails:

1. **Docker:**
```bash
docker-compose down
docker-compose up -d --force-recreate
```

2. **Git-based:**
```bash
git revert HEAD
systemctl restart todoapp
```

3. **Database:**
```bash
sqlite3 database.sqlite < backup.sql
```

## Continuous Deployment

Set up automatic deployments:

1. Configure GitHub Actions
2. Run tests on every push
3. Deploy to staging automatically
4. Manual approval for production
5. Automated rollback on failure

## Support and Maintenance

- Monitor error logs daily
- Review performance metrics weekly
- Update dependencies monthly
- Security audits quarterly
- Full backup testing quarterly

## Conclusion

Choose the deployment method that best fits your needs and infrastructure. Start with Docker for simplicity, then move to more complex setups as your application scales.

For production use, always:
- Use HTTPS
- Set strong secrets
- Enable monitoring
- Configure backups
- Plan for scalability

Good luck with your deployment! 🚀
