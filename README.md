XDC Network Stats
============

This is a visual interface for tracking XinFin Network status. It uses WebSockets to receive stats from running nodes and output them through an angular interface.

## Prerequisite
* node
* npm

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


## Run in local

```bash
docker-compose up mongo -d
npm run dev
```
see the interface at http://localhost:2000

## Run standalone container on server
NOTE: Require mongodb installed first

```bash
docker-compose up -d --no-deps --build web-server
```