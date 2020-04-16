
const express = require('express')
const {write, findByID, read, updateNotes,updateTodos} = require('./todo-service')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', express.static(__dirname + '/public'))

app.get('/todos', (req, res) => {
        var resp
    read().then(todos => {
            resp = todos.map((t) => ({
            id : t.id,
            title : t.title,
            desc : t.desc,
            due_date : t.due_date,
            status : t.status,
            priority : t.priority,
            notes : t.notes      
            
        }))

        res.status(200).send(resp)
        
    })


})

app.post('/todos', (req, res) => {
    if(typeof req.body.title !== 'string') {
        return res.status(400).send({error: 'Task name not provided'})
    } 

    todos = {
        title: req.body.title,
        desc: req.body.desc,
        due_date: req.body.due_date,
        status: req.body.status,
        priority: req.body.priority,
        notes: req.body.notes
    }

    write(todos).then(()=> console.log('in server'))

    res.status(201).send({ success: 'New Task create', id: todos.length})
})


app.get('/todos/:id', (req, res) => {
    if(isNaN(Number(req.params.id))) {
        return  res.status(400).send({ error: 'Id must be of integer type'})   
    }

   findByID(req.params.id).then(t => {
            todo = {
                id : t.id,
                title : t.title,
                desc : t.desc,
                due_date : t.due_date,
                status : t.status,
                priority : t.priority,
                notes : t.notes  
            }
            console.log('In server2: ',req.params.id)
            res.status(200).send(todo)
    }).catch(err=> {
        res.status(400).send({ error: 'Id Not Found'}) 
    })

})

app.get('/todos/:id/:notes', (req, res) => {
    if(isNaN(Number(req.params.id))) {
        return  res.status(400).send({ error: 'Id must be of integer type'})   
    }
    if (req.params.notes != 'notes'){
        return  res.status(400).send({ error: 'Invalid url'})
    }

    findByID(req.params.id).then(t => {
        todo = {
            notes : t.notes  
        }
        res.status(200).send(todo)
    }).catch(err=> {
    res.status(400).send({ error: 'Id Not Found'}) 
    })
})

app.post('/todos/:id/:notes', (req, res) => {
    if(isNaN(Number(req.params.id))) {
        return  res.status(400).send({ error: 'Id must be of integer type'})   
    }
    if (req.params.notes != 'notes'){
        return  res.status(400).send({ error: 'Invalid url'})
    } 

    

    findByID(req.params.id).then(t => {
       let notes = t.notes

       setNotes(notes)
        
    }).catch(err=> {
    res.status(400).send({ error: 'Id Not Found'}) 
    })

    
    if(typeof req.body.notes !== 'string') {
        return res.status(400).send({error: 'Task name not provided'})
    }

    function setNotes(notes) {

        
        let newNote = notes + "\n" + req.body.notes

        updateNotes(req.params.id, newNote)

    }
    res.status(201).send({ success: 'Notes updated'})

    

})


app.put('/todos/:id', (req, res) => {

    if (req.body.id && req.body.id != req.params.id) {
        return res.status(400).send({error: 'ID in the body is matching ID in URL'})
    }

    if(typeof req.body.title !== 'string') {
        return res.status(400).send({error: 'Task name not provided'})
    } 

    const todo = {
        title : req.body.title,
        desc : req.body.desc,
        due_date : req.body.due_date,
        status : req.body.status,
        priority : req.body.priority,
        notes : req.body.notes
    }

    updateTodos(req.body.id, todo)
    console.log('IN Server.....')

    res.status(201).send({success: 'Task Updated'})

})


const sererport= process.env.PORT || 6500
app.listen(sererport)