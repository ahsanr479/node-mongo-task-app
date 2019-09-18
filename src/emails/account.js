const sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) => {
    sendGrid.send({
        to:email,
        from:'ahsanr478@gmail.com',
        subject:'Welcome to the app you fucktards',
        text:`Welcome to the app, ${name}. Let me know how you doing fool`
    })
}

const sendGoodByeEmail = (email,name) => {
    sendGrid.send({
        to:email,
        from:'ahsanr478@gmail.com',
        subject:'Sad to see you go',
        text:`Sad to see you go, ${name}. Let me know how we can make our services better`
    })
}



module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}
