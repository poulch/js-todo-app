(function() {
  'use strict';

  var container = document.querySelector('.list-container'),
      list = document.querySelector('.list'),
      form = document.querySelector('.form-container form'),
      input = document.querySelector('.form-container input[name=title]'),
      restoreBtn,
      lastRemove = [];

  var getList = function() {
    var todos = [];
    var todos_str = localStorage.getItem('todo');
    if (todos_str !== null) {
      todos = JSON.parse(todos_str);
    }
    return todos;
  };

  var createElement = function(value) {
    var element = document.createElement('li'),
        cancelBtn = document.createElement('div'),
        span = document.createElement('span'),
        span2 = document.createElement('span');

    cancelBtn.classList.add('cancel-btn');
    cancelBtn.appendChild(span);
    cancelBtn.appendChild(span2);

    element.classList.add('list-item');
    element.textContent = value;
    element.appendChild(cancelBtn);
    list.appendChild(element);
  };

  var createRestoreBtn = function() {
    var restoreContainer = document.createElement('div');
    restoreContainer.classList.add('restore-container');

    var restoreBtn = document.createElement('button');
    restoreBtn.classList.add('restore-btn');
    restoreBtn.classList.add('hidden');
    restoreBtn.textContent = 'restore last 2 task';
    restoreContainer.appendChild(restoreBtn);
    container.appendChild(restoreContainer);

    restoreBtn = document.querySelector('.restore-btn');
    restoreBtn.addEventListener('click', restoreLast);
  };

  var removeElement = function(element) {
    var target = element.target;
    var parent = null;
    var restoreBtn = document.querySelector('.restore-btn');

    if (target.nodeName === 'DIV' || target.nodeName === 'SPAN') {
      parent = target.parentElement;
      if (target.tagName === 'SPAN') {
        parent = target.parentElement.parentElement;
      }

      var parentText = parent.textContent;

      lastRemove.unshift(parentText);
      list.removeChild(parent);

      localStorage.setItem('last', JSON.stringify(lastRemove));

      var todos = getList();
      var newTodos = todos.filter(function(element) {
        return element !== parentText;
      });

      localStorage.setItem('todo', JSON.stringify(newTodos));

      if (!restoreBtn) {
        createRestoreBtn();
      } else {
        restoreBtn.classList.remove('hidden');
      }

    }
  };

  var initListFromStorage = function() {
    var listItem = getList();
    listItem.forEach(function(element) {
      createElement(element);
    });
  };

  var formSubmit = function(e) {
    e.preventDefault();
    var value = input.value;
    input.value = '';

    var todos = getList();
    todos.push(value);
    localStorage.setItem('todo', JSON.stringify(todos));

    createElement(value);
  };

  var getLastRemoved = function() {
    var last = Array();
    var lastString = localStorage.getItem('last');
    if (lastString !== null) {
      last = JSON.parse(lastString);
    }
    if (last.length > 2) {
      last.length = 2;
    }

    return last;

  };

  var restoreLast = function() {
    var last = getLastRemoved();
    var itemInList = getList();
    var restoreBtn = document.querySelector('.restore-btn');
    restoreBtn.classList.add('hidden');

    last.forEach(function(element) {
      createElement(element);
      itemInList.push(element);
    });

    localStorage.setItem('todo', JSON.stringify(itemInList));
    localStorage.setItem('last', JSON.stringify(Array()));
  };

  document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', formSubmit);
    list.addEventListener('click', removeElement);
    initListFromStorage();
    createRestoreBtn();
    var restoreBtn = document.querySelector('.restore-btn');
    var lastRemove = getLastRemoved();

    if (lastRemove.length !== 0) {
      restoreBtn.classList.remove('hidden');
    }
  });

}());
