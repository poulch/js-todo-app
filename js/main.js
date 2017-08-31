(function() {

  const todoApp = new Todo();  

  function init(container) {
    const todoContainer = document.querySelector(container);
    const unorderList = document.createElement('ul');
    const restoreBtn =todoApp.createRestoreBtn();
    

    unorderList.classList.add('list');
    todoContainer.appendChild(unorderList);
    todoApp.list = document.querySelector('.list');
    


    const listItemsFragment = document.createDocumentFragment();
    const createLI = todoApp.createListItem.bind(todoApp);
    todoApp.todoList.forEach(function (element) {
      listItemsFragment.appendChild(createLI(element));
    });
    todoApp.list.appendChild(listItemsFragment);

    document.querySelector('.todo-container').appendChild(restoreBtn);
    todoApp.restoreBtn = document.querySelector('.restore-btn');
    todoApp.restoreBtn.classList.add('hidden');
    todoApp.restoreBtn.addEventListener('click', todoApp.restoreLastItem);

    if (todoApp.lastRemoved.length > 0) {
      todoApp.restoreBtn.classList.remove('hidden');
    }

    todoApp.form.addEventListener('submit', todoApp.formSubmit);
    todoApp.list.addEventListener('click', todoApp.removeElementFromDOM);
  }


  document.addEventListener('DOMContentLoaded', function () {
    init('.todo-container');
  });
})();