FROM node:8-alpine
LABEL maintainer="anil@xinfin.org"
ENV WS_SECRET ''
WORKDIR /netstats
COPY ./ ./
RUN npm install && \
npm install -g grunt-cli && \
grunt
ENTRYPOINT ["npm" "start"]