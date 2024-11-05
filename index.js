const express = require('express')
const path = require("path")
const fs = require('node:fs')

const app = express()

app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


const readFiles = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const tasks = JSON.parse(data)
            resolve(tasks)
        });
    })
}


const writeFiles = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf8', err => {
            if (err) {
              console.error(err);
              return;
            }
            resolve(true)
        });
    })
}


app.get('/', (req, res) => {
    readFiles('./tasks.json').then((tasks) => {
        res.render('index', {tasks:tasks, error:null})
    })
})


app.post('/', (req, res) => {
    console.log('form sent data')
    let task = req.body.task
    let error = null
    if (task.trim().length === 0) {
        error = 'Please insert correct data'
        readFiles('./tasks.json').then((tasks) => {
            res.render('index', {tasks:tasks, error:error})
        })
    } else {
        readFiles('./tasks.json').then((tasks) => {
            let index
            if (tasks.length === 0){
                index = 0
            } else {
                index = tasks[tasks.length - 1].id + 1
            }
            
            const newTask = {id:index, task:task}
            tasks.push(newTask)
            console.log(tasks)

            const data = JSON.stringify(tasks, null, 2)
            
            writeFiles('./tasks.json', data)

            res.redirect('/')
        })
    }
})

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFiles('./tasks.json').then(tasks => {
        tasks.forEach((task, index) => {
            if(task.id === deletedTaskId){
                tasks.splice(index, 1)
            } 
        });

        const data = JSON.stringify(tasks, null, 2)

        writeFiles('./tasks.json', data)

        res.redirect('/')
    })
})

app.get('/update-task/:taskId', (req, res) => {
    let updateTaskId = parseInt(req.params.taskId)
    readFiles('./tasks.json').then(tasks => {
        let updateTask
        tasks.forEach((task) => {
            if(task.id === updateTaskId){
                updateTask = task.task 
            } 
        });

        res.render('update',{
            updateTask: updateTask,
            updateTaskId: updateTaskId,
            error: null
        } )
    })
})

app.post('/update-task', (req, res) => {
    console.log(req.body)
    let updateTaskId = parseInt(req.body.taskId)
    let updateTask =  req.body.task
    let error = null
    if(updateTask.trim().length === 0){
        error = 'Please insert correct task data'
        res.render('update',{
            updateTask: updateTask,
            updateTaskId: updateTaskId,
            error: error
        }) 
    } else {
        readFiles('./tasks.json').then(tasks => {
            tasks.forEach((task, index) => {
                if(task.id === updateTaskId){
                   tasks[index].task = updateTask
                } 
            });
            console.log(tasks)
            const data = JSON.stringify(tasks, null, 2)

            writeFiles('./tasks.json', data)

            res.redirect('/')
        }) 
    } 
  
})

app.get('/delete-tasks', (req, res) => {
    tasks = [] 
    const data = JSON.stringify(tasks, null, 2)
    writeFiles('./tasks.json', data)
    res.redirect('/')
})

app.listen(3001, () => {
    console.log('app is started http://localhost:3001')
})
