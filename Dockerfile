FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN apk update && apk add build-base g++ cairo-dev pango-dev giflib-dev libpng-dev jpeg-dev librsvg-dev

RUN yarn install 

COPY . .

EXPOSE 4000

RUN yarn build-client

RUN yarn build-server

CMD yarn start-prod