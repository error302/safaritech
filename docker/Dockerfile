FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma prisma/
COPY apps/web/package.json apps/web/
COPY apps/web/next.config.* apps/web/
COPY apps/web/tsconfig.json apps/web/
COPY apps/web/tailwind.config.* apps/web/
COPY apps/web/postcss.config.* apps/web/
COPY apps/web/public apps/web/public
COPY apps/web/src apps/web/src

RUN npm install --legacy-peer-deps

WORKDIR /app/apps/web
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/prisma prisma/
COPY --from=builder /app/apps/web apps/web/
COPY --from=builder /app/node_modules node_modules/

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "--prefix", "apps/web", "run", "start"]