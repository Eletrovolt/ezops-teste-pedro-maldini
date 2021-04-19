FROM node:lts
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3001:3001
CMD [ "node", "server.js" ]
