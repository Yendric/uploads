FROM serversideup/php:8.4-fpm-nginx AS base

ENV PHP_OPCACHE_ENABLE=1
ENV AUTORUN_ENABLED=1
ENV PHP_UPLOAD_MAX_FILE_SIZE=5G
ENV UNIT_MAX_BODY_SIZE=5G
ENV PHP_POST_MAX_SIZE=5G

USER root

COPY --chown=www-data:www-data composer.json composer.lock ./

RUN install-php-extensions intl

USER www-data

RUN composer install --no-interaction --optimize-autoloader --no-dev

USER root

COPY --chown=www-data:www-data . /var/www/html

FROM node:22-alpine AS frontend-builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

COPY --from=base /var/www/html/vendor /app/vendor

COPY . . 
RUN pnpm run build

FROM base AS final

USER root

COPY --from=frontend-builder /app/public /var/www/html/public

RUN chown -R www-data:www-data /var/www/html/public



USER www-data
