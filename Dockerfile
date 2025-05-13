FROM node:lts-alpine

WORKDIR /opt/api

COPY package*.json ./
COPY yarn.lock ./

# Install yarn
RUN npm install --global yarn --force

COPY . .

RUN yarn build

CMD ["node", "./dist/src/main"]
