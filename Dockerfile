

FROM node:12-slim
MAINTAINER Brandon Sorgdrager <Brandon.Sorgdrager@gmail.com>
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
