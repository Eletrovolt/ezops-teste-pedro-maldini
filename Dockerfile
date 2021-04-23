FROM node:12
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3001
CMD [ "node", "server.js" ]
