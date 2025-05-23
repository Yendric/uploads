FROM yendric/php-base:8.4 AS base

ENV PHP_OPCACHE_ENABLE=1
ENV AUTORUN_ENABLED=true
ENV PHP_UPLOAD_MAX_FILE_SIZE=5G
ENV UNIT_MAX_BODY_SIZE=5G
ENV PHP_POST_MAX_SIZE=5G

USER www-data

COPY --chown=www-data:www-data composer.json composer.lock ./

RUN composer install --no-interaction --optimize-autoloader --no-dev

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

COPY --from=frontend-builder /app/public /var/www/html/public

USER root

RUN chown -R www-data:www-data /var/www/html/public

RUN echo "opcache.jit=on" > /usr/local/etc/php/conf.d/zzz-custom-php.ini 
RUN php artisan optimize

USER www-data
