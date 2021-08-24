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
var payload = {
    Verb: Verb,
    Name: User,
    Value: 0
};
var payload1 = {
    Verb: Verb,
    Name: User,
    Value: 0
};
if ( Verb === "register" ) {
    payload.verb = "set",
    payload.Value= 0
    
} else if ( Verb === "set" ) {
    payload.Value= parseInt(process.argv[4])
    
} else if ( Verb === "inc" ) {
    payload.Value= parseInt(process.argv[4])

} else if ( Verb === "dec" ) {
    payload.Value= parseInt(process.argv[4])

} //will test transfer later. UPDATE: THAT LATER IS NOW
else if ( Verb === "transfer" ) {
    // client transfer arshad utkarsh 15
    const Receiver = process.argv[4];
    const Value = parseInt(process.argv[5]);  // transfer amount
    payload.Verb = "dec";
    payload.Value = Value;
    payload1.Name = Receiver;
    payload1.Verb = "inc";
    payload1.Value = Value;
}else {
    console.log("Invalid verb");
}

/*const payload = {
    Verb: 'set',
    Name: 'Arshad',
    Value: 20
}*/
//const payloadBytes =Buffer.from(JSON.stringify(payload))
const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')

// *****************PROCESS PAYLOAD MUL FUNCTION EITU****************************

function processPayload(payload){

    const payloadBytes = cbor.encode(payload)

    console.log("payload Bytes-",payloadBytes)




    //Will create the get_address function here

    function get_address(name) {
        let prefix = createHash('sha512').update("intkey").digest('hex').toLowerCase().substring(0, 6);    // dekh lena js me kaise karte hai ye
        let name_address = createHash('sha512').update(name).digest('hex').toLowerCase().slice(-64);
        return prefix + name_address // thik h
    }

    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        batcherPublicKey: signer.getPublicKey().asHex(),
        dependencies: [],
        familyName: 'intkey',
        familyVersion: '1.0',
        inputs: [get_address(payload["Name"])], //won't use the get_address function, will try with createHash first. Update: That didn't work. Gave "Exception creating context"
        nonce:getNonce(),
        outputs: [get_address(payload["Name"])],
        payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
        signerPublicKey: signer.getPublicKey().asHex()
        // In this example, we're signing the batch with the same private key,
        // but the batch can be signed by another party, in which case, the
        // public key will need to be associated with that key.
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

    return protobuf.Batch.create({   //eyat assign korar thait return korim
        header: batchHeaderBytes,
        headerSignature: batchSignature,
        transactions: transactions,
        trace:true
        
    });
}
//now, I'll give this statement in the if else ladder itself. UPDATE: Naah kaam nookorile
const batch0 = processPayload(payload);

//will test transfer later. Update: that later is now
var batchListBytes;
if(Verb==="transfer")
{
    const batch1 = processPayload(payload1);

    batchListBytes = protobuf.BatchList.encode({
        batches: [batch0, batch1]
    }).finish()
    console.log("BatchListAsbytes- ",batchListBytes)
}
else{
    batchListBytes = protobuf.BatchList.encode({
        batches: [batch0]
    }).finish()
    console.log("BatchListAsbytes- ",batchListBytes)
}


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
