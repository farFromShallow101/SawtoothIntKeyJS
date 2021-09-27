# SawtoothIntKeyJS

## IntKey Transaction Processor with an added "transfer" and "register" verb and functional client side application

### STEPS TO RUN THE APPLICATION

1. Yaml up command (docker-compose -f modified-sawtooth.yaml up)
On both client side and transaction processor side, do the following:
2. nvm install 12
3. nvm use 12
4. On the transaction processor side, run <br> npm install
5. On the client side, run the following:<br> npm run start tcp://localhost:4004
<br>node index.js set var 25 --url http://rest-api:8008
<br> to increment: node index.js inc var 5 --url http://rest-api:8008
<br> to decrement: node index.js dec var 5 --url http://rest-api:8008
<br> to transfer: node index.js transfer var var2 5 --url http://rest-api:8008

### TO CHECK THE STATE DATA:
From a new terminal, use this command: <br>
docker exec -it sawtooth-shell-default bash <br>
sawtooth state list --url http://rest-api:8008
