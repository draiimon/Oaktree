FROM node:20-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm install --production

COPY app/ ./

EXPOSE 3000

CMD ["node", "server.js"]