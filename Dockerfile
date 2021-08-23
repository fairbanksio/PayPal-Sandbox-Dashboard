
FROM node:16-slim as client-base
RUN mkdir /app && chown -R node:node /app
ENV NODE_ENV=production
WORKDIR /app
RUN npm i npm@latest -g
USER node
COPY --chown=node:node ./client/package*.json ./
RUN npm install --no-optional --silent && npm cache clean --force > "/dev/null" 2>&1

FROM node:16-slim as server-base
RUN apt-get -qq update; apt-get -qq install wget gpg -y
ENV NODE_ENV=production
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc /tini.asc
RUN gpg --batch --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 \
  && gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini
RUN npm i npm@latest -g
RUN apt-get -qq purge wget gpg -y; apt-get -qq autoremove -y; apt-get -qq autoclean; rm -rf /var/lib/{apt,dpkg,cache,log}/
# apt-get is unavailable after this point
EXPOSE 8080
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node ./package*.json ./
RUN  npm install --no-optional --silent && npm cache clean --force > "/dev/null" 2>&1

# Development ENV
FROM server-base as server-dev
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
RUN npm install --only=development --no-optional --silent && npm cache clean --force > "/dev/null" 2>&1
CMD ["nodemon", "index.js", "--inspect=0.0.0.0:9229"]

# Development ENV
FROM client-base as client-dev
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
RUN npm install --only=development --no-optional --silent && npm cache clean --force > "/dev/null" 2>&1
CMD ["npm", "start"]

FROM client-base as client-source
ENV NODE_ENV=production
COPY --chown=node:node ./client .
RUN npm run build

FROM server-base as server-source
COPY --chown=node:node . .

# Production ENV
FROM server-source as prod
COPY --from=client-source /app/build ./client/build
ENTRYPOINT ["/tini", "--"]
CMD ["node", "index.js"]