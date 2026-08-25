# syntax=docker/dockerfile:1

ARG app_dir="/home/node/app"

FROM node:24-alpine
ARG app_dir
WORKDIR ${app_dir}

COPY . .

RUN npm ci

RUN npm run build

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080

CMD ["node", "--enable-source-maps", ".output/server/index.mjs"]
