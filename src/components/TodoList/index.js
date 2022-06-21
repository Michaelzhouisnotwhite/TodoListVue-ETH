import { defineComponent, ref, computed, watchEffect, watch } from 'vue';
import './style.css';

export default defineComponent({
  name: 'TodoList',
  emits: ['todoListChange'],
  props: {
    data: {
      require: true,
    },
  },
  setup(props, ctx) {
    // const STORAGE_KEY = 'vue-todomvc';
    const filters = {
      all: (todos) => todos,
      active: (todos) => todos.filter((todo) => !todo.completed),
      completed: (todos) => todos.filter((todo) => todo.completed),
    };

    // state
    // const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    const propsTodoList = ref(props.data)

    const todos =  ref(JSON.parse(JSON.stringify(propsTodoList.value)));

    const visibility = ref('all');
    const editedTodo = ref();

    // derived state
    const filteredTodos = computed(() => filters[visibility.value](todos.value));
    const remaining = computed(() => filters.active(todos.value).length);

    // handle routing
    window.addEventListener('hashchange', onHashChange);
    onHashChange();

    // persist state
    // Don't need for blockchain
    // watchEffect(() => {
    //   localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
    // });

    function toggleAll(e) {
      todos.value.forEach((todo) => (todo.completed = e.target.checked));
      ctx.emit('todoListChange', todos.value);
    }

    function addTodo(e) {
      const value = e.target.value.trim();
      if (value) {
        todos.value.push({
          id: Date.now(),
          title: value,
          completed: false,
        });
        ctx.emit('todoListChange', todos.value);
        e.target.value = '';
      }
    }

    function removeTodo(todo) {
      todos.value.splice(todos.value.indexOf(todo), 1);
      ctx.emit('todoListChange', todos.value);
    }

    let beforeEditCache = '';

    function editTodo(todo) {
      beforeEditCache = todo.title;
      editedTodo.value = todo;
    }

    function cancelEdit(todo) {
      editedTodo.value = null;
      todo.title = beforeEditCache;
    }

    function doneEdit(todo) {
      if (editedTodo.value) {
        editedTodo.value = null;
        todo.title = todo.title.trim();
        if (!todo.title) removeTodo(todo);
        ctx.emit('todoListChange', todos.value);
      }
    }

    function removeCompleted() {
      todos.value = filters.active(todos.value);
    }

    function onHashChange() {
      const route = window.location.hash.replace(/#\/?/, '');
      if (filters[route]) {
        visibility.value = route;
      } else {
        window.location.hash = '';
        visibility.value = 'all';
      }
    }

    // watch(
    //     () => todos,
    //     (newVal) => {
    //       ctx.emit('todoListChange', newVal.value);
    //     },
    //     {
    //       deep: true,
    //     },
    // );
    function toggleTodo(todo) {
      console.log(todo);
      todo.completed = !todo.completed;
      ctx.emit('todoListChange', todos.value);
    }

    return {
      todos,
      visibility,
      propsTodoList,
      editedTodo,
      filteredTodos,
      remaining,
      toggleAll,
      addTodo,
      removeTodo,
      editTodo,
      doneEdit,
      cancelEdit,
      removeCompleted,
      toggleTodo,
    };
  },

  template:/*html*/`
    <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
          class="new-todo"
          autofocus
          placeholder="What needs to be done?"
          @keyup.enter="addTodo"
      >
    </header>
    <section class="main" v-show="todos.length">
      <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          :checked="remaining === 0"
          @change="toggleAll"
      >
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
            v-for="todo in filteredTodos"
            class="todo"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" @change="toggleTodo(todo)" :checked="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
              v-if="todo === editedTodo"
              class="edit"
              type="text"
              v-model="todo.title"
              @vnode-mounted="({ el }) => el.focus()"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
          >
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        <span>{{ remaining === 1 ? 'item' : 'items' }} left</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
    </section>`,
});
