FROM node:12-alpine
RUN mkdir -p /home/node/cms/node_modules && chown -R node:node /home/node/cms
WORKDIR /home/node/cms
COPY package*.json ./

USER node
RUN npm install
COPY --chown=node:node . .

VOLUME .:/home/node/cms

EXPOSE 24040

CMD [ "npm", "start" ]