#!/usr/bin/env bash
scp nginx.conf root@peeper:/etc/nginx/
ssh -tt root@peeper <<'ENDSSH'
nginx -t && systemctl restart nginx
ENDSSH
