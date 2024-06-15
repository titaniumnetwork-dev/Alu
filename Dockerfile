FROM node:lts

WORKDIR /usr/src/app

# Copying package.json and pnpm-lock helps with caching
COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]