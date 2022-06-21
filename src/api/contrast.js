import { ref } from 'vue';
import TodoListJSON from '../../sol_build/TodoListUpgrade.json';
import { globalVars, intervalIdManager } from '@/utils';
import Web3 from 'web3';
import contract from '@truffle/contract';

// check the account when it had been changed
export const accountBuffer = ref('');


/**
 * load smart contrast
 * @returns {Promise<{addressAccount: *, todoContract: *}>}
 */
export const load = async () => {
  const addressAccount = await loadAccount();
  const todoContract = await loadContract();

  return { addressAccount, todoContract };
};

/**
 *
 * @param todoContract: 合约
 * @returns {Promise<Object>} 返回一个json对象
 */
export const loadTodoList = async (todoContract) => {
  const tasksJsonString = await todoContract.get();
  return (tasksJsonString === '') ? JSON.parse('[]') : JSON.parse(tasksJsonString);
};

/**
 * load contract
 * @returns {Promise<Contract>}
 */
const loadContract = async () => {
  const theContract = contract(TodoListJSON);
  theContract.setProvider(window.web3.eth.currentProvider);
  return await theContract.deployed();
};

const loadAccount = async () => {
  return await window.web3.eth.getCoinbase();
};

/**
 * 载入web3组件
 * @returns {Promise<void>}: no returns
 */
export const loadWeb3 = async () => {
  // Modern dapp browsers...
  let intervalId = null;
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    // console.log("1", window.web3.eth.getCoinbase());
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Accounts now exposed
      // web3.eth.sendTransaction({/* ... */});

      // globalVars.web3 = await window.web3;
      // console.log(2, globalVars);

      // 添加
      // intervalId = intervalIdManager.pushId(async () => {
      //   accountBuffer.value = await window.web3.eth.getCoinbase();
      //   globalVars.web3 = window.web3
      // }, 1000);

    } catch (error) {
      // User denied account access...
      console.log(error);
      console.log(3);
      // intervalIdManager.popId(intervalId);
      globalVars.web3 = null;
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Accounts always exposed
    // web3.eth.sendTransaction({/* ... */});
    console.log(4);
    // globalVars.web3 = window.web3;

    // intervalId = intervalIdManager.pushId(async () => {
    //   accountBuffer.value = await window.web3.eth.getCoinbase();
    // }, 1000);

    // window.ethereum.on("accountsChanged", async function(accounts) {
    //   accountBuffer.value = await window.web3.eth.getCoinbase();
    //   globalVars.web3 = window.web3;//一旦切换账号这里就会执行
    // });
  }
  // Non-dapp browsers...
  else {
    // intervalIdManager.popId(intervalId);

    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    globalVars.web3 = null;
  }
};


export async function putContract(contract, address, data) {
  const dataStr = JSON.stringify(data);
  await contract.put(dataStr, {from: address})
}
