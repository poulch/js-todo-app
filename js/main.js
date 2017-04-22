var todoApp = function () { 

  var todoList = fetchSavedList();
  var lastRemoved = fetchLastRemoved();
  
 
  

  function addItem(item) {
    // podajesz obiekt czy tam string i ta funkcja ma za zadanie wrzucić go do listy
    todoList.push(item);
    saveCurrentList(todoList);
  }

  function removeItem(index) {
    // usuwa element z listy na danej pozycji
    var removeElement = todoList[index];
    lastRemoved.unshift(removeElement);
    todoList.splice(index, 1);
    saveCurrentList(todoList);
    saveLastRemoved(lastRemoved);

    if (lastRemoved.length > 0 && lastRemoved.length < 2) {
      createRestoreBtn();
    }
  }

  function restoreLastItem() {
    // przywraca ostatni usunięty wpis
    if (lastRemoved.length > 0) {
      var lastElement = lastRemoved[0];
      var currentList = fetchSavedList();
      currentList.push(lastElement);
      var listLenght = todoList.length;
      createListHtmlElement(document.querySelector('.list'), lastElement, listLenght);
      saveCurrentList()
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

  function createListHtmlElement(container, value, index) {
    var element = document.createElement('li'),
      cancelBtn = document.createElement('div'),
      span = document.createElement('span'),
      span2 = document.createElement('span');

    cancelBtn.classList.add('cancel-btn');
    cancelBtn.appendChild(span);
    cancelBtn.appendChild(span2);

    element.classList.add('list-item');
    element.setAttribute('data-id', index);
    element.textContent = value;
    element.appendChild(cancelBtn);
    container.appendChild(element);
  }

  function createRestoreBtn() {
    var restoreContainer = document.createElement('div');
    restoreContainer.classList.add('restore-container');
    var restoreBtn = document.createElement('button');
    restoreBtn.classList.add('restore-btn');
    restoreBtn.textContent = 'restore last task';
    restoreContainer.appendChild(restoreBtn);
    document.querySelector('.todo-container').appendChild(restoreContainer);

  };

  function removeItemFormList(element) {
    var target = element.target;
    var parent = null;



    if (target.nodeName === 'DIV' || target.nodeName === 'SPAN') {
      parent = target.parentElement;
      if (target.tagName === 'SPAN') {
        parent = target.parentElement.parentElement;
      }
      var parentText = parent.textContent;
      var id = parent.getAttribute('data-id');
      var list = document.querySelector('.list');
      var child = document.querySelector('.list-item[data-id="' + id + '"]');

      list.removeChild(child);

      removeItem(id);



    }
  }

  function init(container) {

    var list = document.createElement('ul');
    var form = document.querySelector('.form-container form');
    var input = document.querySelector('.form-container input[name=title]');
    var restoreBtn;
    list.classList.add('list');





    todoList.map(function (element, index) {
      createListHtmlElement(list, element, index);
    });

    var con = document.querySelector(container);
    con.appendChild(list);

    if (lastRemoved.length > 0) {
      createRestoreBtn();
      restoreBtn = document.querySelector('.restore-btn');
    }


    function formSubmit(e) {
      var list = document.querySelector('.list');
      e.preventDefault();
      var value = input.value;
      input.value = '';
      var listLeght = fetchSavedList().length;
      createListHtmlElement(list, value, listLeght);
      addItem(value);

    }


    form.addEventListener('submit', formSubmit);
    list.addEventListener('click', removeItemFormList);
    restoreBtn.addEventListener('click', restoreLastItem);
  }

  return {
    init: init
  }
}();

;
(function () {
  var mainTodoApp = todoApp.init('.todo-container');
})();



