//Creating private key
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()

const restapiURL='http://localhost:8008'
const signer =new CryptoFactory(context).newSigner(privateKey)
console.info("Signer ",signer)
console.log("priv- ",privateKey)

console.log("First signature- ",signer.sign("abcdefgh"))

var hexPriv=privateKey.asHex();

console.log("In hexadecimal?- ",hexPriv)
var decodedPriv=Buffer.from(hexPriv,'hex')


var privateBuffer = {
    privateKeyBytes: decodedPriv
  }
  console.log("after decoding hexadecimal- ",privateBuffer)

var signer1 = new CryptoFactory(context).newSigner(privateBuffer);
console.log("Signer-",signer1);
console.log("Second signature- ",signer1.sign("abcdefgh"))



//Encoding of Payload
const cbor = require('cbor')

const process = require("process");
console.log("Command line arguments were: ", process.argv);
console.log("Value was: ", process.argv[4]);
// client set arshad 15 
const Verb = process.argv[2];
const User = process.argv[3];
let payload;
if ( Verb === "register" ) {
    // client register arshad
    payload = {
        Verb: "set",
        Name: User,
        Value: 0
    };
} else if ( Verb === "set" ) {
    // client set arshad 15
    payload = {
        Verb: "set",
        Name: User,
        Value: process.argv[4]
    };
} else if ( Verb === "inc" ) {
    // client inc arshad 15
    payload = {
        Verb: "inc",
        Name: User,
        Value: process.argv[4]
    };
} else if ( Verb === "dec" ) {
    // client inc arshad 15
    payload = {
        Verb: "dec",
        Name: User,
        Value: process.argv[4]
    };
} else if ( Verb === "transfer" ) {
    // client transfer arshad utkarsh 15
    const Receiver = process.argv[3];
    const Value = process.argv[4];  // transfer amount

    payload = {
        Verb: "transfer",
        Name: User,
        Receiver: Receiver,
        Value: Value
    };
}
    const payloadBytes = cbor.encode(payload)

    console.log("payload Bytes-",payloadBytes)
    
    
    
    const {createHash} = require('crypto')
    const {protobuf} = require('sawtooth-sdk')
    
    function get_address(name) {
        let prefix = createHash('sha512').update("intkey").digest('hex').toLowerCase().substring(0, 6);
        let name_address = createHash('sha512').update(name).digest('hex').toLowerCase().slice(-64);
        return prefix + name_address // thik h
    }
    
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        batcherPublicKey: signer.getPublicKey().asHex(),
        dependencies: [],
        familyName: 'intkey',
        familyVersion: '1.0',
        inputs: [get_address(payload["Name"])], 
        nonce:getNonce(),
        outputs: [get_address(payload["Name"])],
        payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
        signerPublicKey: signer.getPublicKey().asHex()
    }).finish()
    
    console.log("Transaction header- ",get_address(payload["Name"]))
    
    
    
    const signature = signer.sign(transactionHeaderBytes)
    
    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
    })
    
    
    console.log("Transaction- ",transaction);
    
    const transactions = [transaction]
    
    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()
    
    console.log("batch header bytes- ",batchHeaderBytes);
    
    const batchSignature = signer.sign(batchHeaderBytes)
    
    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: batchSignature,
        transactions: transactions,
        trace:true
        
    });


/*const payload = {
    Verb: 'set',
    Name: 'Arshad',
    Value: 20
}*/
//const payloadBytes =Buffer.from(JSON.stringify(payload))
/*const payloadBytes = cbor.encode(payload)

console.log("payload Bytes-",payloadBytes)



const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')

function get_address(name) {
    let prefix = createHash('sha512').update("intkey").digest('hex').toLowerCase().substring(0, 6);
    let name_address = createHash('sha512').update(name).digest('hex').toLowerCase().slice(-64);
    return prefix + name_address // thik h
}

const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    familyName: 'intkey',
    familyVersion: '1.0',
    inputs: [get_address(payload["Name"])], 
    nonce:getNonce(),
    outputs: [get_address(payload["Name"])],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
    signerPublicKey: signer.getPublicKey().asHex()
}).finish()

console.log("Transaction header- ",get_address(payload["Name"]))



const signature = signer.sign(transactionHeaderBytes)

const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
})


console.log("Transaction- ",transaction);

const transactions = [transaction]

const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()

console.log("batch header bytes- ",batchHeaderBytes);

const batchSignature = signer.sign(batchHeaderBytes)

const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions,
    trace:true
    
});*/
//Will try to create another batch

/*const payload1 = {
    Verb: 'set',
    Name: 'Aditya',
    Value: 25
}

const payloadBytes1 = cbor.encode(payload1)

console.log("payload Bytes-",payloadBytes1)

const transactionHeaderBytes1 = protobuf.TransactionHeader.encode({
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    familyName: 'intkey',
    familyVersion: '1.0',
    inputs: [get_address(payload1["Name"])], 
    nonce:getNonce(),
    outputs: [get_address(payload1["Name"])],
    payloadSha512: createHash('sha512').update(payloadBytes1).digest('hex'),
    signerPublicKey: signer.getPublicKey().asHex()
}).finish()

console.log("Transaction header- ",get_address(payload1["Name"]))



const signature1 = signer.sign(transactionHeaderBytes1)

const transaction1 = protobuf.Transaction.create({
    header: transactionHeaderBytes1,
    headerSignature: signature1,
    payload: payloadBytes1
})


console.log("Transaction- ",transaction1);

const transactions1 = [transaction1]

const batchHeaderBytes1 = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions1.map((txn) => txn.headerSignature),
}).finish()

console.log("batch header bytes- ",batchHeaderBytes1);

const batchSignature1 = signer.sign(batchHeaderBytes1)

const batch1 = protobuf.Batch.create({
    header: batchHeaderBytes1,
    headerSignature: batchSignature1,
    transactions: transactions1,
    trace:true
    
});*/
/////////

//Will change this for the transfer verb
const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]  // earlier I kept it as [batch, batch1] for the double testing     
}).finish()

console.log("BatchListAsbytes- ",batchListBytes)

const request = require('request')

request.post({
    url: restapiURL+'/batches',
    body: batchListBytes,
    headers: {'Content-Type': 'application/octet-stream'}
}, (err, response) => {
    if (err) return console.log(err)
    console.log(response.body)
})


function getNonce() {
    var dateString = Date.now().toString(36).slice(-5);
    var randomString = Math.floor(Math.random() * 46655).toString(36);
    return dateString + ('00' + randomString).slice(-3);
}
