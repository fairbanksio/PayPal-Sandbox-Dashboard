

FROM node:14-alpine
MAINTAINER Brandon Sorgdrager <https://github.com/bsord>, Jon Fairbanks <https://github.com/jonfairbanks>
ENV NODE_ENV=production
EXPOSE 3000
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node . .

# Install client dependencies and build
RUN cd /app/client
RUN npm install
RUN npm run build

# Install server depedencies
RUN cd /app
RUN npm install

EXPOSE 3000
# And go
CMD ["npm", "run", "serve"]
