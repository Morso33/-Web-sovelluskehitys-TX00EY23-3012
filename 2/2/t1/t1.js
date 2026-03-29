// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

const ul = document.querySelector('ul');
const dialog = document.querySelector('dialog');
const addBtn = document.querySelector('.add-btn');
const form = dialog.querySelector('form');
const input = dialog.querySelector('input');

// Render a single todo item as an <li>
function createListItem(item) {
  const li = document.createElement('li');
  li.dataset.id = item.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${item.id}`;
  checkbox.checked = item.completed;

  const label = document.createElement('label');
  label.htmlFor = `todo-${item.id}`;
  label.textContent = item.task;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Delete');

  // Task 1: Update todoList on checkbox change
  checkbox.addEventListener('change', () => {
    const todo = todoList.find((t) => t.id === item.id);
    if (todo) {
      todo.completed = checkbox.checked;
      console.log('Updated todoList:', todoList);
    }
  });

  // Task 2: Delete item using removeChild
  deleteBtn.addEventListener('click', () => {
    const index = todoList.findIndex((t) => t.id === item.id);
    if (index !== -1) {
      todoList.splice(index, 1);
      console.log('Updated todoList:', todoList);
    }
    ul.removeChild(li);
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(deleteBtn);
  return li;
}

// Render all items
function renderList() {
  ul.innerHTML = '';
  todoList.forEach((item) => {
    ul.appendChild(createListItem(item));
  });
}

// Task 3: Open modal on "Add Todo Item" click
addBtn.addEventListener('click', () => {
  input.value = '';
  dialog.showModal();
});

// Task 3: Save new item from modal form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = input.value.trim();
  if (!taskName) return;

  const newItem = {
    id: todoList.length > 0 ? Math.max(...todoList.map((t) => t.id)) + 1 : 1,
    task: taskName,
    completed: false,
  };

  todoList.push(newItem);
  console.log('Updated todoList:', todoList);

  ul.appendChild(createListItem(newItem));
  dialog.close();
});

// Initial render
renderList();
