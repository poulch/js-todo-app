var todoApp = function() {

  var todoList = fetchSavedList(),
      lastRemoved = fetchLastRemoved(),
      form = document.querySelector('.form-container form'),
      input = document.querySelector('.form-container input[name=title]'),
      restoreBtnElement;

  function addItem(item) {
    todoList.push(item);
    saveCurrentList(todoList);
  }

  function removeItem(value) {

    var indexRemovedElement = todoList.indexOf(value);
    var removedElement = todoList.splice(indexRemovedElement, 1);
    lastRemoved.unshift(removedElement[0]);
    saveCurrentList(todoList);
    saveLastRemoved(lastRemoved);

    if (lastRemoved.length > 0) {
      if (restoreBtnElement.classList.contains('hidden')) {
        restoreBtnElement.classList.remove('hidden');
      }

    }
  }

  function restoreLastItem(element) {

    if (lastRemoved.length > 0) {
      var listHtml = document.querySelector('.list');
      var removedElement = lastRemoved.splice(0, 1);
      todoList.push(removedElement[0]);
      var listItem = createListHtmlElement(removedElement[0]);
      listHtml.appendChild(listItem);

      saveCurrentList(todoList);
      saveLastRemoved(lastRemoved);
    } else {
      element.target.classList.add('hidden');
    }

  }

  function saveCurrentList(array) {
    localStorage.setItem('todo', JSON.stringify(array));
  }

  function saveLastRemoved(array) {
    localStorage.setItem('last', JSON.stringify(array));
  }

  function fetchSavedList() {
    var todo = [];
    var todo_str = localStorage.getItem('todo');

    if (todo_str !== null && todo_str !== undefined) {
      todo = JSON.parse(todo_str);
    }
    return todo;
  }

  function fetchLastRemoved() {
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

  function createListHtmlElement(value) {
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

  function createRestoreBtn() {
    var restoreContainer = document.createElement('div'),
        restoreBtn = document.createElement('button');

    restoreContainer.classList.add('restore-container');
    restoreBtn.classList.add('restore-btn');
    restoreBtn.textContent = 'restore last task';
    restoreContainer.appendChild(restoreBtn);
    return restoreContainer;

  };

  function removeItemFormList(element) {
    var target = element.target;
    var parent = null;
    //var listHtml = document.querySelector('ul');

    if (target.nodeName === 'DIV' || target.nodeName === 'SPAN') {
      parent = target.parentElement;
      if (target.tagName === 'SPAN') {
        parent = target.parentElement.parentElement;
      }
      this.removeChild(parent);
      removeItem(parent.textContent);
    }
  }

  function init(container) {
    var todoContainer = document.querySelector(container),
        listElement = document.createElement('ul'),
        restoreBtn = createRestoreBtn();

    listElement.classList.add('list');
    todoContainer.appendChild(listElement);
    var listHtml = document.querySelector('.list');


    var listItems = document.createDocumentFragment();
    todoList.forEach(function(element) {
      listItems.appendChild(createListHtmlElement(element));
    });
    listHtml.appendChild(listItems);

//RESTORE ITEMS

    document.querySelector('.todo-container').appendChild(restoreBtn);
     restoreBtnElement = document.querySelector('.restore-btn');
    restoreBtnElement.classList.add('hidden');
    restoreBtnElement.addEventListener('click', restoreLastItem);

    if (lastRemoved.length > 0) {
      restoreBtnElement.classList.remove('hidden');
    }

    function formSubmit(e) {
      e.preventDefault();
      var value = input.value;
      input.value = '';
      var listElement = createListHtmlElement(value);
      listHtml.appendChild(listElement);

      todoList.push(value);
      saveCurrentList(todoList);

    }

    form.addEventListener('submit', formSubmit);
    listHtml.addEventListener('click', removeItemFormList);

  }

  return {
    init: init
  };
}();


(function() {
  var mainTodoApp = todoApp.init('.todo-container');
})();
