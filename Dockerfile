FROM node:18

WORKDIR /usr/src


COPY package*.json .

RUN yarn install --legacy-peer-deps

COPY prisma ./prisma/

RUN yarn prisma generate

COPY . .

# private port sẽ chạy 
EXPOSE 8080

#node index.js => khởi chạy server 
CMD [ "node","main.ts" ]


