FROM node:22-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npx tsc

EXPOSE 3000

CMD node build/src/app.js