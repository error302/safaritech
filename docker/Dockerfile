FROM node:20-alpine

WORKDIR /app

# Copy workspace root files
COPY package.json package-lock.json ./
COPY prisma prisma/
COPY apps/web/package.json apps/web/
COPY apps/web/next.config.* apps/web/
COPY apps/web/tsconfig.json apps/web/
COPY apps/web/tailwind.config.* apps/web/
COPY apps/web/postcss.config.* apps/web/
COPY apps/web/public apps/web/public
COPY apps/web/src apps/web/src

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build Next.js app (runs prisma generate automatically via postinstall)
WORKDIR /app/apps/web
RUN npm run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "start"]