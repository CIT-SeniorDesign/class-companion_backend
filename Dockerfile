# Use node docker image from sub-set "slim"
FROM node:18-buster-slim

# Set working app directory
WORKDIR /app

# Copy dependency listing and install
COPY  package.json .
RUN npm install

# Copy codebase from current local directory
COPY . .
