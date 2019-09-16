const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


//GET /tasks?completed
//GET/tasks?limit||skip
// GET /tasks?sortBy= createdAt_asc
router.get('/tasks',auth,async(req,res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.isCompleted = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        await   req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth,async(req,res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner: req.user.id})
        if(!task) {
            return res.status(403).send('task not found in db')
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/tasks',auth,async(req,res) => {
 

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['isCompleted']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update!!!!'})
    }
    const _id = req.params.id
    try{
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const task = await Task.findOne({_id,owner: req.user.id})
        if(!task){
            res.status(404).send()
        }
        updates.forEach(update => task[update] = req.body[update])
        task.save()
        res.send(task)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth, async(req,res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner: req.user.id})
        if(!task){
            return res.status(404).send()
        }
        task.delete()
        res.send(task)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }

})


module.exports = router