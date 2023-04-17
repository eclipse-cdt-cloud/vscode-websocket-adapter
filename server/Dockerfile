FROM node:lts

RUN apt-get update && apt-get install -y \
    gdb \
    gdbserver

RUN npm install -g \
    cdt-gdb-adapter \
    git+https://github.com/endpointservices/websockify-js
