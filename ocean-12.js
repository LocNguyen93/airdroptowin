const sui = require("@mysten/sui.js");

const Ed25519Keypair = sui.Ed25519Keypair
const JsonRpcProvider = sui.JsonRpcProvider
const RawSigner = sui.RawSigner
const TransactionBlock = sui.TransactionBlock
const Connection = sui.Connection

const contractAddress = "0x2c68443db9e8c813b194010c11040a3ce59f47e4eb97a2ec805371505dad7459"
const So = "0x4846a1f1030deffd9dea59016402d832588cf7e0c27b9e4c1a63d2b5e152873a"
const oceanCt = "0xa8816d3a6e3136e86bc2873b1f94a15cadc8af2703c075f2d546c2ae367f4df9::ocean::OCEAN"

const interval = 43205 * 1000;

let accounts = [
    {
        index: 0,
        walletKeys: ["couch timber alone pave mango stadium recipe fossil luggage fame mail humble"]
    },
];

const connection = new Connection({
    fullnode: 'https://fullnode.mainnet.sui.io',
    faucet: 'https://faucet.testnet.sui.io/gas',
});
const provider = new JsonRpcProvider(connection);

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
async function getChange(key) {
    const txn = await provider.getTransactionBlock({
        digest: key,
        options: {
            showEffects: false,
            showInput: false,
            showEvents: false,
            showObjectChanges: true,
            showBalanceChanges: true,
        },
    });
    let change = txn["balanceChanges"]
    const totalAmount = change
        .filter(item => item.coinType === oceanCt)
        .reduce((sum, item) => sum + parseInt(item.amount, 10), 0);
    return totalAmount / 1000000000
}

async function main() {
    for (let index = 0; index < accounts.length; index++) {
        let account = accounts[index];
        console.log("start account --> ", index);
        for (let i = 0; i < account?.walletKeys.length; i++) {
            const key = account?.walletKeys[i]
            const keypair = Ed25519Keypair.deriveKeypair(key, `m/44'/784'/0'/0'/0'`);
            const signer = new RawSigner(keypair, provider);
    
            const suiAdd = keypair.getPublicKey().toSuiAddress()
    
            try {
                const tx = new TransactionBlock();
                let a = tx.object(So)
                let d = tx.object("0x6")
                tx.moveCall({
                    target: `${contractAddress}::game::claim`,
                    arguments: [a, d],
                    typeArguments: []
                })
                const result = await signer.signAndExecuteTransactionBlock({ transactionBlock: tx, requestType: "WaitForLocalExecution" });
                await sleep(5000)
                let amount = await getChange(result["digest"])
                const currentDate = new Date();
                const dateNow = currentDate.toISOString()
                console.log(`${suiAdd} claimed at: ${dateNow} ${amount}`)
            } catch (e) {
                console.log(`Claim Error: ${suiAdd} - ${e}`)
            }
        }
    }
    
}

async function run() {
    for (; ;) {
        await main();
        await sleep(interval);
    }
}

void run();
