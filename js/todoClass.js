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
    var indexRemovedElement = this.todoList.indexOf(value);
    var removedElement = this.todoList.splice(indexRemovedElement, 1);
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
    var todoArray = [];
    var todo_str = localStorage.getItem('todo');
    todo_str ? todoArray = JSON.parse(todo_str) : [];
    return todoArray;
  }
  fetchRemoved() {
    var last = Array();
    var lastString = localStorage.getItem('last');
    if (lastString !== null) {
      last = JSON.parse(lastString);
    }
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
      var removedElement = this.lastRemoved.splice(0, 1);
      var listItem = this.createListItem(removedElement[0]);
      this.list.appendChild(listItem);
      this.addItem(removedElement[0]);
      this.saveRemoved(this.lastRemoved);
    } else {
      element.target.classList.add('hidden');
    }
  }
  createListItem(value) {
    var listItem = document.createElement('li'),
      cancelBtn = document.createElement('div'),
      span = document.createElement('span'),
      span2 = document.createElement('span');

    cancelBtn.classList.add('cancel-btn');
    cancelBtn.appendChild(span);
    cancelBtn.appendChild(span2);

    listItem.classList.add('list-item');
    listItem.textContent = value;
    listItem.appendChild(cancelBtn);

    return listItem;
  }
  createRestoreBtn() {
    var restoreContainer = document.createElement('div'),
      restoreBtn = document.createElement('button');

    restoreContainer.classList.add('restore-container');
    restoreBtn.classList.add('restore-btn');
    restoreBtn.textContent = 'restore last task';
    restoreContainer.appendChild(restoreBtn);
    return restoreContainer;
  }
  removeElementFromDOM(element) {
    var target = element.target;
    var parent = null;

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
    var value = this.input.value;
    this.input.value = '';
    var listElement = this.createListItem(value);
    this.list.appendChild(listElement);
    this.addItem(value);
  }
  init(container) {
    var todoContainer = document.querySelector(container),
      unorderList = document.createElement('ul'),
      restoreBtn = this.createRestoreBtn();

    unorderList.classList.add('list');
    todoContainer.appendChild(unorderList);
    this.list = unorderList;


    var listItems = document.createDocumentFragment();
    var createLi = this.createListItem.bind(this);
    this.todoList.forEach(function (element) {
      listItems.appendChild(createLi(element));
    });
    this.list.appendChild(listItems);

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
