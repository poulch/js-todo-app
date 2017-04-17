
// moja propozycja struktury kodu
var todoApp = function () { // tutaj masz wykorzystanie tzw. revealing module pattern

  function addItem (item) {
    // podajesz obiekt czy tam string i ta funkcja ma za zadanie wrzucić go do listy
  }

  function removeItem (index) {
    // usuwa element z listy na danej pozycji
  }

  function restoreLastItem () {
    // przywraca ostatni usunięty wpis
  }

  function saveCurrentList () {
    // zapisuje obecną listę po np. dodaniu elementu czy jego usunięciu
  }

  function fetchSavedList () {
    // pobiera i zwraca listę z localStorage/sessionStorage
  }

  function init(container) {
    // tutaj tworzysz cały szkielet apki i wrzucasz go w podany container/div
    // dodajesz te odpowiednie event listenery
    // tylko tutaj był umieścił operacje na DOM
  }

  return { // tutaj zwracamy bardzo proste API bo posiadające tylko jedną metodę
    init: init
  }
}();

;(function () {
  var mainTodoApp = todoApp.init('.jakis-tam-div');
})();

// ----------------------------------------------------------------------------


;(function() {
  'use strict';

  var container = document.querySelector('.list-container'),
      list = document.querySelector('.list'),
      form = document.querySelector('.form-container form'),
      input = document.querySelector('.form-container input[name=title]'),
      restoreBtn;



  var todoApi = (function() {

    var lastRemove = [];
    var list = document.querySelector('.list');

    var getList = function() {
      var todos = [];
      var todos_str = localStorage.getItem('todo');
      if (todos_str !== null) {
        todos = JSON.parse(todos_str);
      }
      return todos;
    };

    var saveList = function(name, array) {
      localStorage.setItem(name, JSON.stringify(array));
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
        saveList('last', lastRemove);

        var todos = getList();
        var newTodos = todos.filter(function(element) {
          return element !== parentText;
        });
        saveList('todo', newTodos);

        if (!restoreBtn) {
          createRestoreBtn();
        } else {
          restoreBtn.classList.remove('hidden');
        }

      }
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

      saveList('todo', itemInList);
      saveList('last', Array());
    };



    return {
      create : createElement,
      remove : removeElement,
      getAll : getList,
      restoreLast : restoreLast,
      saveList : saveList,
      getLastRemoved : getLastRemoved

    }


  })();



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

  var initListFromStorage = function() {
    var listItem = todoApi.getAll();
    listItem.forEach(function(element) {
      todoApi.create(element);
    });
  };

  var formSubmit = function(e) {
    e.preventDefault();
    var value = input.value;
    input.value = '';

    var todos = todoApi.getAll();
    todos.push(value);
    todoApi.saveList('todo', todos);
    todoApi.create(value);
  };







  document.addEventListener('DOMContentLoaded', function() {
    form.addEventListener('submit', formSubmit);
    list.addEventListener('click', todoApi.remove());
    initListFromStorage();
    createRestoreBtn();
    var restoreBtn = document.querySelector('.restore-btn');
    var lastRemove = todoApi.getLastRemoved;

    if (lastRemove.length !== 0) {
      restoreBtn.classList.remove('hidden');
    }
  });

}());
