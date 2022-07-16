XDC Network Stats
============

This is a visual interface for tracking XinFin Network status. It uses WebSockets to receive stats from running nodes and output them through an angular interface.

## Prerequisite
* node
* npm
* MongoDB(Forensics purpose)

## Installation
Make sure you have node.js and npm installed.

Clone the repository and install the dependencies

```bash
git clone https://github.com/XinFinOrg/XDCStats
cd XDCStats
npm install
sudo npm install -g grunt-cli
```

## Build the resources
NetStats features two versions: the full version and the lite version. In order to build the static files you have to run grunt tasks which will generate dist or dist-lite directories containing the js and css files, fonts and images.


To build the full version run
```bash
grunt
```

## Run in server
1. Copy paste `.env_sample` and rename to `.env`. Set the relevant environment variables. To enable Forensics, put `ENABLE_FORENSICS=true`, otherwise default to `false`
2. If Forensics is enabled:
  - Download and set up mongoDB: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition
  - Set monggoDB url to `MONGODBURL` in .env , default to `localhost:27017`
3. Start the docker to run the application: `npm run start:docker`


## Run in local

```bash
npm run dev
```
see the interface at http://localhost:2000