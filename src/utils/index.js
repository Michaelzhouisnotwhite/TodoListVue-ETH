import { reactive, ref } from 'vue';

export const globalVars = reactive({
  web3: null,
  account:null,
  accountBuffer:"",
});

export const intervalIdManager = reactive({
  intervals: [],
  pushId(handler, timeout, name = null) {
    let id = setInterval(handler, timeout);
    this.intervals.push(id);
    return id;
  },
  popId(id) {
    let pos = this.intervals.indexOf(id);
    if (pos !== -1) {
      this.intervals.splice(pos, 1);
      clearInterval(id);
    }
  },
  clearAll() {
    for (let i = 0; i < this.intervals.length; i++) {
      let id = this.intervals.pop();
      clearInterval(id);
    }
  },
});