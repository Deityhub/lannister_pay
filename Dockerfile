# Pull base image nodejs image.
FROM node:16-alpine
LABEL Author Jude Ojini <judoc96@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm ci --only=production

EXPOSE 3000

CMD [ "npm", "start"]
