FROM node:20-alpine
WORKDIR /usr/src/app
COPY ../apps/web/package*.json ./
COPY ../apps/web/next.config.ts ./
COPY ../apps/web/tsconfig.json ./
RUN npm ci
COPY ../apps/web .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
