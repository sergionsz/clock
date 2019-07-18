const hundredsMilliseconds = {
  name: 'hundreds-milliseconds',
  set: date => date.setMilliseconds(window.now.getMilliseconds() + 100),
  get: date => Math.floor(date.getMilliseconds() / 100),
  getCleanTime: (shift) => {
    const cleanDate = new Date(window.now.getTime())
    cleanDate.setMilliseconds(shift * 100)
    return cleanDate
  },
  totalMs: 100
}

const seconds = {
  name: 'seconds',
  set: date => date.setSeconds(window.now.getSeconds() + 1),
  get: date => date.getSeconds() % 10,
  getCleanTime: () => {
    const cleanDate = new Date(window.now.getTime())
    cleanDate.setMilliseconds(0)
    return cleanDate
  },
  totalMs: hundredsMilliseconds.totalMs * 10
}

const tensSeconds = {
  name: 'ten-seconds',
  set: date => date.setSeconds(window.now.getSeconds() + 10),
  get: date => Math.floor(date.getSeconds() / 10),
  getCleanTime: (shift) => {
    const cleanDate = seconds.getCleanTime()
    cleanDate.setSeconds(shift * 10)
    return cleanDate
  },
  totalMs: seconds.totalMs * 10
}

const minutes = {
  name: 'minutes',
  set: date => date.setMinutes(window.now.getMinutes() + 1),
  get: date => date.getMinutes() % 10,
  getCleanTime: () => {
    const cleanDate = seconds.getCleanTime()
    cleanDate.setSeconds(0)
    return cleanDate
  },
  totalMs: seconds.totalMs * 60
}

const tensMinutes = {
  name: 'ten-minutes',
  set: date => date.setMinutes(window.now.getMinutes() + 10),
  get: date => Math.floor(date.getMinutes() / 10),
  getCleanTime: (shift) => {
    const cleanDate = minutes.getCleanTime()
    cleanDate.setMinutes(shift * 10)
    return cleanDate
  },
  totalMs: minutes.totalMs * 10
}

const hours = {
  name: 'hours',
  set: date => date.setHours(window.now.getHours() + 1),
  get: date => date.getHours() % 10,
  getCleanTime: () => {
    const cleanDate = minutes.getCleanTime()
    cleanDate.setMinutes(0)
    return cleanDate
  },
  totalMs: minutes.totalMs * 60
}

const tensHours = {
  name: 'ten-hours',
  set: date => date.setHours(window.now.getHours() + 10),
  get: date => Math.floor(date.getHours() / 10),
  getCleanTime: (shift) => {
    const cleanDate = hours.getCleanTime()
    cleanDate.setHours(shift * 10)
    return cleanDate
  },
  totalMs: hours.totalMs * 10
}

const parts = [
  tensHours,
  hours,
  ":",
  tensMinutes,
  minutes,
  ":",
  tensSeconds,
  seconds,
  ":",
  hundredsMilliseconds,
]

// Initial setup
window.now = new Date()
const app = document.getElementById('app')

for (let index = 0; index < parts.length; index++) {
  const item = parts[index]
  if (typeof item == 'string') {
    const separator = document.createElement('span')
    separator.classList.add('separator')
    separator.textContent = item
    app.appendChild(separator)
    continue
  }
  const container = document.createElement('div')
  container.classList.add('number-container')
  container.setAttribute('id', item.name)
  container.innerHTML = `<span class="current number"></span><span class="next number"></span>`
  app.appendChild(container)
  const currentElement = container.querySelector('.current')
  currentElement.textContent = item.get(window.now)
  item.container = container
}

function updateTime() {
  // Date format YYYY, MM, DD, HH, MM, SS, mmm
  window.now = new Date()

  let value

  for (let index = 0; index < parts.length; index++) {
    const item = parts[index]
    typeof item == "object" && updateItem(item)
  }
}

function updateItem(item) {
  value = item.get(window.now)
  const valueElement = item.container.querySelector('.current')
  const previousValue = Number(valueElement.textContent)
  const nextValueElement = item.container.querySelector('.next')

  const plus1 = new Date(window.now.getTime())
  item.set(plus1)

  const elapsedMs = window.now.getTime() - item.getCleanTime(value)
  const remainingMs = item.totalMs - elapsedMs
  valueElement.style.opacity = remainingMs / item.totalMs
  nextValueElement.style.opacity = elapsedMs / item.totalMs

  valueElement.textContent = value

  const newValue = item.get(plus1)
  nextValueElement.textContent = newValue
}


const interval = setInterval(updateTime, 20)
