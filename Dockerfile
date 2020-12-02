FROM node:12

# Bundle app source

RUN mkdir -p /client/tmp
COPY ./client/package.json /client/tmp/package.json
RUN cd /client/tmp && npm install
RUN mkdir /client/node_modules && cp -a /client/tmp/node_modules /client

RUN mkdir -p /server/tmp
COPY ./server/package.json /server/tmp/package.json
RUN cd /server/tmp && npm install
RUN mkdir /server/node_modules && cp -a /server/tmp/node_modules /server

COPY . .

EXPOSE 3000

# Run the app (both client and server)
WORKDIR /
CMD npm start --prefix ./server & npm start --prefix ./client