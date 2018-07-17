FROM node:8

COPY package*.json ./

RUN npm install

COPY . .
RUN mkdir /sharedfolder

ENTRYPOINT sh process.sh
