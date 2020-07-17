const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, './.env')
})
const net = require('net')
const Web3 = require("xdc3")

const THRESHOLD = parseFloat(process.env.DELAY_THRESHOLD)

let RPCEndPoints = ["localhost:8545","localhost:8546"]
console.log(RPCEndPoints.length)
const main = async () => {
    let web3, localWeb3, latestBlockNumber, localLatestBlockNumber, diffBlock
    try {
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_ENDPOINT))
        latestBlockNumber = await web3.eth.getBlockNumber()
    } catch (err) {
        console.log("Unable to connect public rpc at ", process.env.RPC_ENDPOINT)
        console.log(err)
        let msg = "Cannot connect public rpc " + process.env.RPC_ENDPOINT
        alertTelegram(msg, process.env.TELEGRAM_TOKEN, process.env.TELEGRAM_CHAT)
    }
    for(let i=0;i<RPCEndPoints.length;i++){
        let rpcEndpoint = "http://"+RPCEndPoints[i]
    try {
        localWeb3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint))
        localLatestBlockNumber = await localWeb3.eth.getBlockNumber()
    } catch (err) {
        let msg = "Your node seems to be down. Your RPC_ENDPOINT: " + rpcEndpoint
        console.log(msg)
        console.log(err)
        alertTelegram(msg, process.env.TELEGRAM_TOKEN, process.env.TELEGRAM_CHAT)
    }
    diffBlock =  latestBlockNumber-localLatestBlockNumber
    if (localLatestBlockNumber < latestBlockNumber - THRESHOLD) {
        let coinbase = await localWeb3.eth.getCoinbase()
        let msg = "Coinbase :- " + coinbase + " \nRPCEndPoint :- " + rpcEndpoint +"\nDiffrenace :- "+diffBlock +" \nRPCCurrentBlock :- " + latestBlockNumber + "\nYourCurrentBlock :- " + localLatestBlockNumber+"\nTime :- "+new(Date)
        alertTelegram(msg, process.env.TELEGRAM_TOKEN, process.env.TELEGRAM_CHAT)
        console.log(msg)
    } else {
        console.log("Your node is up to date at block " + localLatestBlockNumber)
    }
    }
}
setInterval(main, 5000);

let {
    exec
} = require('child_process')
const alertTelegram = (msg, token, target) => {
    if (token != '' && target != '') {
        let cmd = "curl -X POST -H 'Content-Type: application/json' -d '{\"chat_id\": \"" + target + "\", \"text\": \"" + msg + "\"}' https://api.telegram.org/bot" + token + "/sendMessage"
        console.log(cmd)
        exec(cmd)
    }
}