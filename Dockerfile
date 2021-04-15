FROM alpine:3.13.5

#MAINTAINER Cidney Marbella, cidney.marbella.178@my.csun.edu # <name>

# RUN mkdir /app/src
# WORKDIR /app/src

RUN apt-get update

COPY  package.json .

RUN npm install

COPY . . 

