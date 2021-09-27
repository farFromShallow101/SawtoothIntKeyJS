# SawtoothIntKeyJS

## IntKey Transaction Processor with an added "transfer" and "register" verb and functional client side application

### STEPS TO RUN THE APPLICATION

1. On one terminal, run yaml up command: <br>docker-compose -f modified-sawtooth.yaml up
2. Open another terminal (preferably in split mode), change directory to client side and transaction processor side (sawtooth-sdk-js) respectively, and do the following:
3. On one terminal, run : nvm install 12
4. On both the terminals: nvm use 12
5. On the transaction processor side, run <br> npm install<br> After this, run the following:<br> npm run start tcp://localhost:4004
6. On the client side, run the following:<br>npm install<br>node index.js set var1 25 --url http://rest-api:8008
<br> to increment: node index.js inc var 5 --url http://rest-api:8008
<br> to decrement: node index.js dec var 5 --url http://rest-api:8008
<br> to transfer: node index.js transfer var var2 5 --url http://rest-api:8008

### TO CHECK THE STATE DATA:
From a new terminal, use this command: <br>
docker exec -it sawtooth-shell-default bash <br>
sawtooth state list --url http://rest-api:8008

### After using the application, abort the existing process on the transaction processor terminal. After this, close the client, transaction processor and state data terminal.
### In the yaml terminal, abort the existing process, and after successful abortion, run the following command:<br>docker-compose -f modified-sawtooth.yaml down
<br>Here, your sawtooth application has finally "gracefully" stopped ;-)