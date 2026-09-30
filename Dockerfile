FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY backend ./backend
COPY frontend ./frontend
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "backend/src/server.mjs"]
