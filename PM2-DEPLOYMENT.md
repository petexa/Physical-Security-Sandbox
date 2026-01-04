# Item 14: PM2 Log Rotation Deployment Guide

## Overview
This document outlines the deployment and configuration of PM2 log rotation for automatic log management on the production server.

## Prerequisites
- SSH access to sandbox.petefox.co.uk
- PM2 globally installed on server
- Root or sudo privileges

## Installation & Configuration

### Step 1: Install PM2 Log Rotate Module
```bash
pm2 install pm2-logrotate
```

### Step 2: Configure Log Rotation Settings
```bash
# Set maximum log file size to 10MB
pm2 set pm2-logrotate:max_size 10M

# Keep 7 days of historical logs
pm2 set pm2-logrotate:retain 7

# Enable compression of old logs (saves space)
pm2 set pm2-logrotate:compress true

# Save PM2 configuration
pm2 save
```

### Step 3: Verify Installation
```bash
# Check that pm2-logrotate is running
pm2 list

# View pm2-logrotate configuration
pm2 describe pm2-logrotate

# Check logs directory
ls -lah ~/.pm2/logs/

# Should see .gz files for compressed old logs
file ~/.pm2/logs/*.gz
```

## Monitoring

### View Current Logs
```bash
# Tail last 20 lines of gallagher-api logs
pm2 logs gallagher-api --lines 20

# Tail integration-api logs
pm2 logs integration-api --lines 20

# View all logs
pm2 logs
```

### Check Log Size
```bash
# Calculate total log size
du -sh ~/.pm2/logs/

# List all log files with size
ls -lh ~/.pm2/logs/
```

## Troubleshooting

### If logs not rotating after 24 hours
1. Check pm2-logrotate status:
   ```bash
   pm2 describe pm2-logrotate
   ```

2. Restart pm2-logrotate:
   ```bash
   pm2 restart pm2-logrotate
   pm2 save
   ```

3. Check PM2 logs for errors:
   ```bash
   tail -50 ~/.pm2/logs/pm2-logrotate-error.log
   ```

### If old logs not compressing
1. Verify compression is enabled:
   ```bash
   pm2 get pm2-logrotate:compress
   # Should output: true
   ```

2. Manual compression of existing logs:
   ```bash
   gzip ~/.pm2/logs/*.log.*.log
   ```

## Timeline

**After Installation:**
- Logs will begin rotating when they exceed 10MB
- Old logs will compress automatically after 24 hours
- Logs older than 7 days will be deleted

## Deployment Commands

Full deployment script to run on production server:

```bash
#!/bin/bash
# Deploy PM2 log rotation

echo "Installing PM2 Log Rotate module..."
pm2 install pm2-logrotate

echo "Configuring log rotation..."
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true

echo "Saving PM2 configuration..."
pm2 save

echo "Verifying installation..."
pm2 list
echo ""
echo "✅ PM2 log rotation configured successfully"
echo ""
echo "Current logs directory size:"
du -sh ~/.pm2/logs/
```

## Success Criteria
- [x] pm2-logrotate module installed
- [x] max_size set to 10M
- [x] retain set to 7 (days)
- [x] compress enabled
- [x] pm2 save executed
- [x] Logs verified and monitoring
- [x] No console errors

## Notes
- Log rotation runs automatically, no manual intervention needed
- Configuration persists across PM2 restarts (saved with `pm2 save`)
- Compressed logs saved as `.gz` files (e.g., gallagher-api-error.log.1.gz)
- Storage space freed automatically when old logs deleted (7-day retention)
