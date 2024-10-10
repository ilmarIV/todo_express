const express = require('express')
const app = express()
const path=require("path")
const fs = require('node:fs')


const readFiles = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const tasks = data.split('\n')
            resolve(tasks)
        });
    })
}


app.set("view engine","ejs")
app.set("views",path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    readFiles('./res/tasks.txt').then((tasks) => {
    res.render('index', {tasks:tasks})
    })
})


app.post('/', (req, res) => {
    let task = req.body.task
    readFiles('./res/tasks.txt').then((tasks) => {
        tasks.push(task)
        const data = tasks.join('\n')
        fs.writeFile('./res/tasks.txt', data, err => {
            if (err) {
                console.error(err);
                return;
            }
            res.redirect('/')
        })
    })
})


app.listen(3001, () => {
    console.log('app is started http://localhost:3001')
})
