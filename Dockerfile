FROM node:20

WORKDIR /blogging/src/app

COPY package*.json ./

RUN npm install

COPY .env .

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/main.js" ]