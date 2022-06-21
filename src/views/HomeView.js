import { defineComponent, nextTick, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { load, accountBuffer, loadWeb3, loadTodoList, putContract } from '@/api/contrast';
import TodoList from '@/components/TodoList';
import { globalVars } from '@/utils';

export default defineComponent({
  name: 'HomeView',
  setup() {
    // window.ethereum.on("accountsChanged", async function(accounts) {
    //   accountBuffer.value = await window.web3.eth.getCoinbase();
    //   globalVars.web3 = window.web3;//一旦切换账号这里就会执行
    // });
    const contractInfo = reactive({
      tasks: [],
      addressAccount: [],
      contract: null,
    });
    onMounted(async () => {
      loadWeb3().then(e => {
        loadContractInfo();
        window.ethereum.on('accountsChanged', function(accounts) {
          console.log('official listening', accounts[0]);//一旦切换账号这里就会执行
          loadContractInfo();
        });
      });
    });

    function loadContractInfo() {
      load().then((e) => {
        contractInfo.addressAccount = e.addressAccount;
        contractInfo.contract = e.todoContract;
        updateTodoList();
      });
    }

    // let checkId = intervalIdManager.pushId()
    const todoKey = ref(1);

    function updateTodoList() {
      loadTodoList(contractInfo.contract, contractInfo.addressAccount).then(e => {
        console.log('load todo list', e);
        contractInfo.tasks = e;
        refreshComponent(todoKey);
      }).catch(err => {
        contractInfo.contract = ref([]);
        console.log(err.message);
      });
    }

    function onTodoListChange(newVal) {
      console.log('newVal props', newVal);
      putContract(contractInfo.contract, contractInfo.addressAccount, newVal).then(() => {
        updateTodoList();
        refreshComponent(todoKey);
      }).catch(err => {
        console.log(err.message);
        updateTodoList();
        refreshComponent(todoKey);
      });

    }

    function refreshComponent(key) {
      key.value += 1;
    }

    return { onTodoListChange, contractInfo, todoKey };
  },
  components: {
    TodoList,
  },
  template:/*html*/`
    <todo-list @todoListChange="onTodoListChange" :data="contractInfo.tasks" :key="todoKey"></todo-list>
  `,
});