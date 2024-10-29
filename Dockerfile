FROM node:20-slim AS base

WORKDIR /app
RUN npm install -g pnpm

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml /temp/prod/
RUN cd /temp/prod && pnpm install

FROM base AS build
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

ARG VITE_WEBSOCKET_URL

ENV VITE_BACKEND=WEBSOCKET
ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}

RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]