// noinspection JSUnresolvedFunction

import { defineComponent, ref } from 'vue';
import VueMetamask from 'vue-metamask';
import TodoListJSON from '../../sol_build/TodoList.json';
import { globalVars, intervalIdManager } from '@/utils';
import Web3 from 'web3';

// let contract = require('@truffle/contract');
import contract from '@truffle/contract'
// const web3 = ref(null);
export const load = async () => {
  await loadWeb3();
  const addressAccount = await loadAccount();
  globalVars.account = addressAccount;
  const {todoContract, tasks} = await loadContract(addressAccount);

  return {addressAccount, todoContract, tasks};
};

const loadTasks = async (todoContract, addressAccount) => {
  const tasksCount = await todoContract.tasksCount(addressAccount);
  const tasks = [];
  for (let i = 0; i < tasksCount; i++) {
    const task = await todoContract.tasks(addressAccount, i);
    tasks.push(task);
  }
  return tasks;
};

const loadContract = async (addressAccount) => {
  const theContract = contract(TodoListJSON);
  theContract.setProvider(globalVars.web3.eth.currentProvider);
  const todoContract = await theContract.deployed();
  const tasks = await loadTasks(todoContract, addressAccount);

  return {todoContract, tasks};
};

const loadAccount = async () => {
  return await globalVars.web3.eth.getCoinbase();
};

const loadWeb3 = async () => {
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

      globalVars.web3 = await window.web3
      console.log(window.web3.eth.getCoinbase());
      console.log(2, globalVars);

      intervalId = intervalIdManager.pushId(async () => {
        globalVars.accountBuffer = await window.web3.eth.getCoinbase()
      }, 1000)
    } catch (error) {
      // User denied account access...
      console.log(error);
      console.log(3);
      globalVars.web3 = null
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Accounts always exposed
    // web3.eth.sendTransaction({/* ... */});
    console.log(4);
    globalVars.web3 = window.web3
  }
  // Non-dapp browsers...
  else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    globalVars.web3 = null
  }
  // let account = window.web3.eth.accounts[0];
  // let accountInterval = setInterval(function () {
  //     if (window.web3.eth.accounts[0] !== account) {
  //         account = window.web3.eth.accounts[0];
  //         location.reload()
  //     }
  // }, 100);
};