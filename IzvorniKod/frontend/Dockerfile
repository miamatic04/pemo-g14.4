FROM node:alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g serve

COPY . .

RUN npm run build

ENTRYPOINT [ "npx", "serve", "-s", "build" ]
#ENTRYPOINT [ "npm", "run", "start" ]
