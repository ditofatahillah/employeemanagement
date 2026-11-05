# ==========================================================
# MAISSTACK APPS - DOCKERFILE PHP-FPM RUNTIME
# ----------------------------------------------------------
# Maintainer: Waysolve Team
# ==========================================================

FROM php:8.3-fpm

# Install System Dependencies & PHP Extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        bcmath \
        zip \
        opcache \
        gd \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set Working Directory
WORKDIR /var/www/html

CMD ["php-fpm"]
