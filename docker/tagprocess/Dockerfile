FROM node:8

COPY package*.json ./

RUN npm install

COPY . .
ENTRYPOINT sh process.sh
