FROM node:8

COPY package*.json ./

RUN npm install
RUN npm install -g @mapbox/geojson-merge

COPY . .
RUN mkdir /sharedfolder

ENTRYPOINT sh process.sh
