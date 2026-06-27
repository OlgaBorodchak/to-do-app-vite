import './styles/style.css'
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
let draggedItem = null

renderTasks()

form.addEventListener('submit', (e) => {
  e.preventDefault()
  addTask()
})

addBtn.addEventListener('click', addTask)

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => {
      b.classList.remove('filter-btn-active')
      b.setAttribute('aria-pressed', 'false')
    })
    btn.classList.add('filter-btn-active')
    btn.setAttribute('aria-pressed', 'true')
    currentFilter = btn.id
    renderTasks()
  })
})

clearBtn.addEventListener('click', () => {
  tasks = tasks.filter((t) => !t.completed)
  saveTasks()
  renderTasks()
})

todoList.addEventListener('change', (e) => {
  if (!e.target.classList.contains('todo-item-checkbox')) return
  const id = Number(e.target.closest('.todo-item').dataset.id)
  toggleTask(id)
})

todoList.addEventListener('click', (e) => {
  if (!e.target.classList.contains('todo-item-delete')) return
  const id = Number(e.target.closest('.todo-item').dataset.id)
  deleteTask(id)
})

todoList.addEventListener('dragstart', (e) => {
  const item = e.target.closest('.todo-item')
  if (!item) return
  draggedItem = item
  item.classList.add('todo-item-dragging')
})

todoList.addEventListener('dragend', (e) => {
  const item = e.target.closest('.todo-item')
  if (!item) return
  item.classList.remove('todo-item-dragging')
  syncTasksFromDOM()
})

todoList.addEventListener('dragover', (e) => {
  e.preventDefault()
  const after = getDragAfterElement(todoList, e.clientY)
  if (after == null) {
    todoList.appendChild(draggedItem)
  } else {
    todoList.insertBefore(draggedItem, after)
  }
})

function addTask() {
  const text = input.value.trim()
  if (!text) return
  tasks.push({ id: Date.now(), text, completed: false })
  saveTasks()
  renderTasks()
  input.value = ''
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

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function updateScore() {
  const count = tasks.filter((t) => !t.completed).length
  score.textContent = `${count} item${count === 1 ? '' : 's'} left`
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

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'todo-item-checkbox'
    checkbox.id = `cb-${task.id}`
    checkbox.checked = task.completed

    const label = document.createElement('label')
    label.className = `todo-item-label${task.completed ? ' todo-item-label-done' : ''}`
    label.htmlFor = `cb-${task.id}`
    label.textContent = task.text

    const deleteBtn = document.createElement('button')
    deleteBtn.type = 'button'
    deleteBtn.className = 'todo-item-delete'
    deleteBtn.setAttribute('aria-label', `Delete ${task.text}`)

    li.append(checkbox, label, deleteBtn)
    todoList.appendChild(li)
  })

  updateScore()
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
  const items = [...todoList.querySelectorAll('.todo-item')]
  const visibleIds = items.map((item) => Number(item.dataset.id))
  const reordered = visibleIds.map((id) => tasks.find((t) => t.id === id))
  const hidden = tasks.filter((t) => !visibleIds.includes(t.id))
  tasks = [...reordered, ...hidden]
  saveTasks()
}
