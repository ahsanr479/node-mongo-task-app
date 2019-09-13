require('../src/db/mongoose')

const User = require('../src/models/user')

const Task = require('../src/models/tasks')

// // //5d71671023bd405408b8b2ac

// Task.findByIdAndRemove('5d71671023bd405408b8b2ac').then((user) => {
//     console.log(user)
//     return Task.countDocuments({
//         isCompleted: false
//     }).then((result) => {
//         console.log(result)
//     }).catch((e) => {
//         console.log(e)
//     })
// })

const deleteTaskAndCount = async(id) => {
    const deletedTask = await(Task.findByIdAndDelete(id))
    const count = Task.countDocuments({isCompleted:false})
    return count
}

deleteTaskAndCount("5d72a0510bf1f958bc6bc96e").then(count => {
    console.log(count)
}).catch(err => {
    console.log(err)
})

// User.findByIdAndUpdate("5d7173e2318dda0738cb3784", {
//     age:1
// }).then((user => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// })).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })



