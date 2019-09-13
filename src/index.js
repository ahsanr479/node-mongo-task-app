const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})

const User = require('./models/user')
const Task = require('./models/task')

const main = async () => {
    // const task = await Task.findById('5d7aab693794501bb49d7a11')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    // const user = await User.findById('5d7aa95952187d64dc29321d')
    // await user.populate('tasks').execPopulate() 
    // console.log(user.tasks) 
}

main()

