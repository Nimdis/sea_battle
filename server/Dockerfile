FROM node:12.18.3

RUN mkdir /serv

WORKDIR /serv

COPY package.json /serv/package.json
COPY package-lock.json /serv/package-lock.json

RUN npm i