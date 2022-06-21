import TodoListJSON from '../../sol_build/TodoListUpgrade.json';
import Web3 from 'web3';
import contract from '@truffle/contract';

/**
 * load smart contrast
 * @returns {Promise<{addressAccount: *, todoContract: *}>}
 */
export const load = async () => {
  const todoContract = await loadContract();
  const addressAccount = await loadAccount();
  return { addressAccount, todoContract };
};

/**
 *
 * @param todoContract: 合约
 * @param address: 地址
 * @returns {Promise<Object>} 返回一个json对象
 */
export const loadTodoList = async (todoContract, address) => {
  const tasksJsonString = await todoContract.tasks(address);
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
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });

    } catch (error) {
      console.log(error);
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};

/**
 * modify todolist contract
 * @param contract: todolist contract
 * @param address: account address
 * @param data: data
 * @returns {Promise<void>}
 */
export async function putContract(contract, address, data) {
  console.log("putContract", data);
  const dataStr = JSON.stringify(data);
  await contract.put(dataStr, {from: address})
}
