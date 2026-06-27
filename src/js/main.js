import '../styles/style.css'
import { initTheme } from './theme.js'

initTheme()

const form = document.getElementById('form')
const input = document.getElementById('todo-input')
const todoList = document.getElementById('todo-list')
const score = document.getElementById('score')
const clearBtn = document.getElementById('clear-btn')
const filterBtns = document.querySelectorAll('.filter-btn')
const addBtn = document.getElementById('btn-add-task')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []
let currentFilter = 'all'

renderTasks()

form.addEventListener('submit', (e) => {
  e.preventDefault()
  addTask()
})

addBtn.addEventListener('click', addTask)

clearBtn.addEventListener('click', () => {
  tasks = tasks.filter((t) => !t.completed)
  saveTasks()
  renderTasks()
})

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('filter-btn-active'))
    btn.classList.add('filter-btn-active')
    currentFilter = btn.id
    renderTasks()
  })
})

function addTask() {
  const text = input.value.trim()
  if (!text) return
  tasks.push({ id: Date.now(), text, completed: false })
  saveTasks()
  renderTasks()
  input.value = ''
}

function renderTasks() {
  todoList.innerHTML = ''

  const filtered = tasks.filter((t) => {
    if (currentFilter === 'active') return !t.completed
    if (currentFilter === 'completed') return t.completed
    return true
  })

  filtered.forEach((task) => {
    const li = document.createElement('li')
    li.classList.add('todo-item')
    li.setAttribute('draggable', true)
    li.dataset.id = task.id
    li.innerHTML = `
      <input type="checkbox" class="todo-item-checkbox" id="cb-${task.id}" ${task.completed ? 'checked' : ''}>
      <label class="todo-item-label ${task.completed ? 'todo-item-label-done' : ''}" for="cb-${task.id}">${task.text}</label>
      <button class="todo-item-delete" type="button" aria-label="Delete task"></button>
    `
    li.querySelector('.todo-item-checkbox').addEventListener('change', () =>
      toggleTask(task.id),
    )
    li.querySelector('.todo-item-delete').addEventListener('click', () =>
      deleteTask(task.id),
    )
    todoList.appendChild(li)
  })

  updateScore()
  initDragAndDrop()
}

function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t,
  )
  saveTasks()
  renderTasks()
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id)
  saveTasks()
  renderTasks()
}

function updateScore() {
  const count = tasks.filter((t) => !t.completed).length
  score.textContent = `${count} item${count === 1 ? '' : 's'} left`
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function initDragAndDrop() {
  const items = todoList.querySelectorAll('.todo-item')
  let draggedItem = null

  items.forEach((item) => {
    item.addEventListener('dragstart', () => {
      draggedItem = item
      item.classList.add('todo-item-dragging')
    })
    item.addEventListener('dragend', () => {
      item.classList.remove('todo-item-dragging')
      syncTasksFromDOM()
    })
    item.addEventListener('dragover', (e) => {
      e.preventDefault()
      const after = getDragAfterElement(todoList, e.clientY)
      if (after == null) {
        todoList.appendChild(draggedItem)
      } else {
        todoList.insertBefore(draggedItem, after)
      }
    })
  })
}

function getDragAfterElement(container, y) {
  const elements = [
    ...container.querySelectorAll('.todo-item:not(.todo-item-dragging)'),
  ]
  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child }
      }
      return closest
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element
}

function syncTasksFromDOM() {
  const items = todoList.querySelectorAll('.todo-item')
  tasks = [...items].map((item) =>
    tasks.find((t) => t.id === Number(item.dataset.id)),
  )
  saveTasks()
}
