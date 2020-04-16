let submit = document.getElementById('submit')
let inputTask = document.getElementById('inputTask')
let dueDate = document.getElementById('dueDate')
let priority = document.getElementById('priority')
let desc = document.getElementById('desc')
let notes = document.getElementById('notes')
let tasklist = document.getElementById('tasklist')



submit.onclick = function() {  

    let todo = {
      title: inputTask.value,
      due_date: dueDate.value,
      priority: priority.value,
      desc: desc.value,
      notes: notes.value,
      status : 'INCOMPLETE'
  }

  if (inputTask.value != '') {
    addNewTodoJson(todo)
    loadTask()
    
  }


  inputTask.value = ''
  priority.selectedIndex = 1
  desc.value = ''
  notes.value = ''
  setTommorowDate()
  
    
}


async function getTodos() {
  const resp = await fetch('/todos', { method: 'GET' })
  const todos = await resp.json()
  return todos
}


async function addNewTodoJson(todo) {
  const resp = await fetch('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })

  loadTask()
}

function setTommorowDate(){

  var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    
    month = '' + month
    
    if(month.length === 1){
      month = '0' + month
    }
    let strDate = year + "-" + month + "-" + day
    dueDate.value = strDate
  
}


function addNewRow(t) {

  let id = document.createElement('td')
  id.textContent = t.id
  id.classList.add('hide')

  let title = document.createElement('td')
  title.textContent = t.title

  let due_date = document.createElement('td')
  due_date.textContent = t.due_date

  let priority = document.createElement('td')
  priority.textContent = t.priority

  let desc = document.createElement('td')
  desc.textContent = t.desc

  let status = document.createElement('td')
  status.textContent = t.status

  let newRow = document.createElement('tr')
  let notesRow = document.createElement('tr')

  let notes = document.createElement('td')
  notes.colSpan = '2'
  let newNotes = document.createElement('td')
  newNotes.colSpan = '2'

  notes.textContent = t.notes
  
  let newNoteInput = document.createElement('input')
  newNoteInput.type = 'text'

  newNotes.appendChild(newNoteInput)

  let btnUpdate = document.createElement('button')
  btnUpdate.innerHTML = 'UPDATE'
  btnUpdate.classList.add('btn')

  let tdBtn = document.createElement('td')
  tdBtn.appendChild(btnUpdate)

  notesRow.appendChild(notes)
  notesRow.appendChild(newNotes)
  notesRow.appendChild(tdBtn)
  notesRow.classList.add('notesRow')


  newRow.appendChild(id)
  newRow.appendChild(title)
  newRow.appendChild(due_date)
  newRow.appendChild(priority)
  newRow.appendChild(desc)
  newRow.appendChild(status)
  newRow.classList.add('mainRow')

  tasklist.appendChild(newRow)
  tasklist.appendChild(notesRow)
  tasklist.classList.add('mainTable')

}


function createTableHeader(){
  let id = document.createElement('td')
  id.textContent = 'ID'
  id.classList.add('hide')

  let title = document.createElement('td')
  title.textContent = 'Title'

  let due_date = document.createElement('td')
  due_date.textContent = 'Due Date'

  let priority = document.createElement('td')
  priority.textContent = 'Priority'

  let desc = document.createElement('td')
  desc.textContent = 'DESCRIPTION'

  let status = document.createElement('td')
  status.textContent = 'STATUS'

  let newRow = document.createElement('tr')

  newRow.appendChild(id)
  newRow.appendChild(title)
  newRow.appendChild(due_date)
  newRow.appendChild(priority)
  newRow.appendChild(desc)
  newRow.appendChild(status)
 

  tasklist.appendChild(newRow)
}
 

function loadTask(){

  tasklist.innerHTML = ''

  createTableHeader()

    getTodos().then(todos => {
        for( let todo of todos){
          addNewRow(todo)
        }
    })

    console.log('inside loadtask')
    
    this.setTommorowDate()
}



window.addEventListener('load', loadTask())