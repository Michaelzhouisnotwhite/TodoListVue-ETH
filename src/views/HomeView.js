import { defineComponent, onMounted } from 'vue';
import { load } from '@/api/contrast';
import { globalVars, intervalIdManager } from '@/utils';

export default defineComponent({
  name: 'HomeView',
  setup() {
    onMounted(()=>{
      load().then(e => {
        console.log(e.addressAccount);
        console.log(e.tasks);
        console.log(e.todoContract);
      });
    })

    // let checkId = intervalIdManager.pushId()
    function onClicked() {
      load().then(e => {
        console.log(e.addressAccount);
        console.log(e.tasks);
        console.log(e.todoContract);
      });
    }

    return {onClicked};
  },
  components: {
  },
  //language=HTML
  template: `
    <h1>Home View</h1>
<!--    <meta-mask></meta-mask>-->
    <button @click="onClicked">Button</button>
    <div>
      <h2></h2>
    </div>
  `,
});