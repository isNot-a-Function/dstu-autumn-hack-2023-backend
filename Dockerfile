FROM node:20

WORKDIR /usr/src/backend

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production=true && yarn add typescript -g

COPY . .

RUN yarn generate:prisma

RUN NODE_OPTIONS="--max-old-space-size=2048" yarn build

EXPOSE 3000

CMD ["yarn", "start"]