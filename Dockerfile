FROM node:16-alpine
LABEL maintainer="anil@xinfin.org"
WORKDIR /netstats
COPY ./ ./
RUN npm install && \
npm install -g grunt-cli && \
grunt
CMD ["npm", "start"]