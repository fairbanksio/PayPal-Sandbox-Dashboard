FROM alpine

MAINTAINER Brandon Sorgdrager <Brandon.Sorgdrager@gmail.com>

# Install dependencies
RUN apk update && apk upgrade \
  && apk add git \
  && apk add nodejs \
  && apk add npm \
  && npm install -g yarn

# Create user
RUN adduser -h /sandbox-dashboard -s /bin/bash -S sandbox-dashboard
USER  sandbox-dashboard
WORKDIR /sandbox-dashboard

# Clone source code
RUN git clone https://github.com/Fairbanks-io/PayPal-Sandbox-Dashboard .

EXPOSE 3000
# And go
CMD ["yarn", "start"]
