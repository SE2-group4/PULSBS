FROM ubuntu:latest

# Install nodejs

RUN apt update
RUN apt-get install -y nodejs
RUN apt-get install -y npm

# Bundle app source

COPY . .

## Installing Client dependecies

WORKDIR /client
RUN npm install

## Installing Server dependecies

WORKDIR /server
RUN npm install


EXPOSE 3000 3000

# Run the app (both client and server)
WORKDIR /
CMD ./DockerCMD_Wrapper.sh