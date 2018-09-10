FROM alpine:3.8

RUN apk add --update \
    pkgconfig \
    build-base \
    libressl-dev \
    curl \
    coturn  \
    rust \
    cargo \
    git \
    nodejs \
    npm

WORKDIR /app

# Configures coturn
COPY config /app/config/
WORKDIR /app/config

    # Environment variables
ARG DOMAIN='example.com'
ARG COTURN_USER='testlol'
ARG COTURN_PASSWORD='secretpassword'

RUN EXTERNAL_IP="$(curl -10 http://icanhazip.com 2>/dev/null)" \
    INTERNAL_IP="$(ip a | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')" \
    node set-vars.js
RUN cp turnserver.conf /etc/
RUN turnadmin -a -u ${COTURN_USER} -r ${DOMAIN} -p ${COTURN_PASSWORD}

# Build Server

    # This is done to cache Cargo dependencies http://whitfin.io/speeding-up-rust-docker-builds/
RUN USER=root cargo new simbol-demo --bin
WORKDIR /app/simbol-demo
COPY server/Cargo.toml ./Cargo.toml
COPY server/Cargo.lock ./Cargo.lock
RUN cargo build
RUN rm src/*.rs

    # Proper compilation
COPY server/src ./src
RUN cargo build --release

# Build Client

    # Cache npm depenencies
COPY client/package.json /app/client/

WORKDIR /app/client

RUN npm install npm@latest -g
RUN npm install

    # Proper compilation
COPY client/assets ./assets
COPY client/index.html client/main.css client/rollup.config.js ./
COPY client/src ./src

RUN npm run js

EXPOSE 3000 8000 3478 3478/udp 3479

WORKDIR /app/
COPY start_script.sh ./
RUN chmod +x ./start_script.sh
CMD ["./start_script.sh"]
