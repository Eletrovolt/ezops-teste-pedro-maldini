FROM node:lts
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3002
CMD [ "node", "server.js" ]
