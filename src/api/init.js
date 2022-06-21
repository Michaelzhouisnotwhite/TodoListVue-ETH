import Web3 from 'web3';
import { reactive } from 'vue';

const initData = reactive({
  web3: null,
  MetaMaskId: '1', // main net netID
  netID: '1', // user metamask id
  MetaMaskAddress: '', // user Address
  stateLog: null,
  isComplete: false,
  type: 'INIT',
  MetamaskMsg: {
    LOAD_MATAMASK_WALLET_ERROR: 'Loading metamask error, please try later',
    EMPTY_METAMASK_ACCOUNT:
        'Please log in to your metamask to continue with this app.',
    NETWORK_ERROR: 'The connection is abnormal, please try again',
    METAMASK_NOT_INSTALL: 'Please install metamask for this application',
    METAMASK_TEST_NET: 'Currently not in the main network.',
    METAMASK_MAIN_NET: 'Currently Main network',
    USER_DENIED_ACCOUNT_AUTHORIZATION: 'User denied account authorization',
  },
});

export const callBackData = reactive({
  web3:null,
  type:null,
  message:null,
});

function checkWeb3() {
  let web3 = window.web3;
  if (typeof web3 === 'undefined') {
    web3 = null;
    Log(initData.MetamaskMsg.METAMASK_NOT_INSTALL, 'NO_INSTALL_METAMASK');
  }
}


function checkAccounts() {
  if (web3 === null) return;
  web3.eth.getAccounts((err, accounts) => {
    console.log();

    if (err != null)
      return Log(initData.MetamaskMsg.NETWORK_ERROR, 'NETWORK_ERROR');
    if (accounts.length === 0) {
      initData.MetaMaskAddress = '';
      Log(initData.MetamaskMsg.EMPTY_METAMASK_ACCOUNT, 'NO_LOGIN');
      return;
    }
    initData.MetaMaskAddress = accounts[0]; // user Address
  });
}


function checkNetWork() {
  try {
    // Main Network: 1
    // Ropsten Test Network: 3
    // Kovan Test Network: 42
    // Rinkeby Test Network: 4
    // Goerli Test Network: 5
    web3.eth.net.getId().then((netId) => {
      initData.netID = String(netId);
      if (initData.MetaMaskAddress !== '' && netId === 1)
        return Log(initData.MetamaskMsg.METAMASK_TEST_NET, 'MAINNET');
      if (initData.MetaMaskAddress !== '' && netId === 3)
        return Log(initData.MetamaskMsg.METAMASK_TEST_NET, 'ROPSTEN');
      if (initData.MetaMaskAddress !== '' && netId === 42)
        return Log(initData.MetamaskMsg.METAMASK_TEST_NET, 'KOVAN');
      if (initData.MetaMaskAddress !== '' && netId === 4)
        return Log(initData.MetamaskMsg.METAMASK_TEST_NET, 'RINKEBY');
      if (initData.MetaMaskAddress !== '' && netId === 5)
        return Log(initData.MetamaskMsg.METAMASK_TEST_NET, 'GOERLI');
      if (initData.MetaMaskAddress !== '')
        Log(initData.MetamaskMsg.METAMASK_MAIN_NET, 'MAINNET');
    });
  } catch (err) {
    Log(initData.MetamaskMsg.NETWORK_ERROR, 'NETWORK_ERROR');
  }
}


function Log(msg, type = '') {
  if (initData.type === type) return;
  const message = msg;
  initData.type = type;
  $emit('onComplete', {
    web3: initData.web3,
    type,
    message,
    netID: initData.netID,
  });
}


function web3TimerCheck(web3) {
  initData.web3 = web3;
  checkAccounts();
  checkNetWork();

  setInterval(() => checkWeb3(), 1000);
  setInterval(() => checkAccounts(), 1000);
  setInterval(() => checkNetWork(), 1000);

}


export async function init() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({method: 'eth_requestAccounts'});
      web3TimerCheck(window.web3);
    } catch (error) {
      Log(
          initData.MetamaskMsg.USER_DENIED_ACCOUNT_AUTHORIZATION,
          'USER_DENIED_ACCOUNT_AUTHORIZATION',
      );
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    web3TimerCheck(window.web3);
  } else {
    initData.web3 = null;
    Log(initData.MetamaskMsg.METAMASK_NOT_INSTALL, 'NO_INSTALL_METAMASK');
    console.error(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
    );
  }
}

