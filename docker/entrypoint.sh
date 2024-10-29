#!/bin/sh

if [ "$ENABLE_SSL" = "true" ]; then
    envsubst '${ENABLE_SSL}' </etc/nginx/nginx.conf.template >/etc/nginx/nginx.conf
else
    sed '/{% if $ENABLE_SSL == "true" %}/,/{% endif %}/d' /etc/nginx/nginx.conf.template >/etc/nginx/nginx.conf
fi

nginx -g "daemon off;"
