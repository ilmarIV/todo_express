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
            const tasks = json.parse(data)
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
        })
    })
}


app.get('/', (req, res) => {
    readFiles('./tasks.json').then((tasks) => {
        res.render('index', {tasks:tasks, error:null})
    })
})


app.post('/', (req, res) => {
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
                index = tasks[task.length - 1].id + 1
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


app.listen(3001, () => {
    console.log('app is started http://localhost:3001')
})
