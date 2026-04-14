FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend ./
COPY frontend ../frontend

EXPOSE 3000

CMD ["npm", "start"]
