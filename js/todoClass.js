class todoClass {
  constructor() {
    this.todoList = this.fetchList();
    this.lastRemoved = this.fetchRemoved();
    this.list = document.querySelector('.list');
    this.form = document.querySelector('.form-container form');
    this.input = document.querySelector('.form-container .form-input');
    this.restoreBtn;

    this.formSubmit = this.formSubmit.bind(this);
    this.removeElementFromDOM = this.removeElementFromDOM.bind(this);
    this.restoreLastItem = this.restoreLastItem.bind(this);
  }

  addItem(item) {
    this.todoList.push(item);
    this.saveList(this.todoList);
  }
  removeItem(value) {
    const indexRemovedElement = this.todoList.indexOf(value);
    const removedElement = this.todoList.splice(indexRemovedElement, 1);
    this.restoreBtn = document.querySelector('.restore-btn');
    this.lastRemoved.unshift(removedElement[0]);
    this.saveList(this.todoList);
    this.saveRemoved(this.lastRemoved);

    if (this.lastRemoved.length > 0) {
      if (this.restoreBtn.classList.contains('hidden')) {
        this.restoreBtn.classList.remove('hidden');
      }

    }
  }
  fetchList() {
    let todoArray = [];
    const todo_str = localStorage.getItem('todo');
    todo_str ? todoArray = JSON.parse(todo_str) : [];
    return todoArray;
  }
  fetchRemoved() {
    let last = [];
    const lastString = localStorage.getItem('last');
    lastString ? last = JSON.parse(lastString) : [];
    if (last.length > 2) {
      last.length = 2;
    }

    return last;
  }
  saveList(list) {
    localStorage.setItem('todo', JSON.stringify(list));
  }
  saveRemoved(array) {
    localStorage.setItem('last', JSON.stringify(array));
  }
  restoreLastItem(element) {
    if (this.lastRemoved.length > 0) {
      const removedElement = this.lastRemoved.splice(0, 1);
      const listItem = this.createListItem(removedElement[0]);
      this.list.appendChild(listItem);
      this.addItem(removedElement[0]);
      this.saveRemoved(this.lastRemoved);
    } else {
      element.target.classList.add('hidden');
    }
  }
  createListItem(value) {
    const listItem = document.createElement('li');
    const cancelBtn = document.createElement('div');
    const span = document.createElement('span');
    const span2 = document.createElement('span');

    cancelBtn.classList.add('cancel-btn');
    cancelBtn.appendChild(span);
    cancelBtn.appendChild(span2);

    listItem.classList.add('list-item');
    listItem.textContent = value;
    listItem.appendChild(cancelBtn);

    return listItem;
  }
  createRestoreBtn() {
    const restoreContainer = document.createElement('div');
    const restoreBtn = document.createElement('button');

    restoreContainer.classList.add('restore-container');
    restoreBtn.classList.add('restore-btn');
    restoreBtn.textContent = 'restore last task';
    restoreContainer.appendChild(restoreBtn);
    return restoreContainer;
  }
  removeElementFromDOM(element) {
    const target = element.target;
    let parent = null;

    if (target.nodeName === 'DIV' || target.nodeName === 'SPAN') {
      parent = target.parentElement;
      if (target.tagName === 'SPAN') {
        parent = target.parentElement.parentElement;
      }
      this.list.removeChild(parent);
      this.removeItem(parent.textContent);
    }
  }
  formSubmit(e) {
    e.preventDefault();
    const value = this.input.value;
    this.input.value = '';
    this.list.appendChild(this.createListItem(value));
    this.addItem(value);
  }
  init(container) {
    const todoContainer = document.querySelector(container);
    const unorderList = document.createElement('ul');
    const restoreBtn = this.createRestoreBtn();

    unorderList.classList.add('list');
    todoContainer.appendChild(unorderList);
    this.list = unorderList;


    const listItemsFragment = document.createDocumentFragment();
    const createLI = this.createListItem.bind(this);
    this.todoList.forEach(function (element) {
      listItemsFragment.appendChild(createLI(element));
    });
    this.list.appendChild(listItemsFragment);

    document.querySelector('.todo-container').appendChild(restoreBtn);
    this.restoreBtn = document.querySelector('.restore-btn');
    this.restoreBtn.classList.add('hidden');
    this.restoreBtn.addEventListener('click', this.restoreLastItem);

    if (this.lastRemoved.length > 0) {
      this.restoreBtn.classList.remove('hidden');
    }

    this.form.addEventListener('submit', this.formSubmit);
    this.list.addEventListener('click', this.removeElementFromDOM);
  }
}