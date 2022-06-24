# todo-list-eth

## Get Started

### First, start a new workspace in Ganache

### Second, edit the truffle-config.js

```js
 development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 10545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

```
Set the port to the same value as the Ganache.

### Third, compile and run

Install truffle as a global package

```powershell
npm install -g truffle
```

compile the solidity.

```powershell
truffle compile
```

migrate the smart contrast

```powershell
truffle migrate --reset
```

### Check the migration(Optional).

```
truffle console
```

In truffle console, deloyed the smart contrast

```
truffle(development)> todoContract = await TodoListUpgrade.deployed()
```

Call a function in smart contrast

```
truffle(development)> todoContract.get()
'[{"id": 1233124, "title": "get up early", "completed": true}]'
```

### Last, Run Vue.js server

```
npm run serve
```

Usually, it will start a server on `http://127.0.0.1:3000`

You have to install MetaMask to run normally.

You also have to pick a local accout from Ganache and import in the MetaMask.
