// noinspection JSUnresolvedFunction

import { defineComponent, ref } from 'vue';
import VueMetamask from 'vue-metamask';
import TodoListJSON from '../../sol_build/TodoList.json';
import { globalVars } from '@/utils';

let contract = require('@truffle/contract');
// const web3 = ref(null);
export const load = async () => {
  const addressAccount = await loadAccount();
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
export const MetaMask = defineComponent({
  setup() {
    async function onComplete(data) {
      globalVars.web3 = data.web3;
      // let addr = await globalVars.web3.eth.getCoinbase();
      // console.log(addr);
    }

    const metamask = ref(null);
    return {onComplete, metamask};
  },
  components: {
    VueMetamask,
  },
  template:/*html*/`
    <vue-metamask @onComplete="onComplete" ref="metamask">
    </vue-metamask>
    <!--    <button @click="metamaskInit">init</button>-->
  `,
});