#!/bin/bash

# Run migrations and seeders
php artisan migrate --force
php artisan db:seed --force

# Start PHP-FPM
php-fpm &

# Start Nginx
nginx -g "daemon off;"