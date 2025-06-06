FROM node:22

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

# EXPOSE 4000

RUN yarn build-client

RUN yarn build-server

CMD yarn start-prod