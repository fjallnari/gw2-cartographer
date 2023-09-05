FROM node:16

WORKDIR /app

COPY package*.json ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD pnpm run dev