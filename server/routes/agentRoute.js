var express = require('express');
var router = express.Router();
const Agent = require('../models/agentModel');
var cryptography = require('../helper/cryptography');
const jwt = require('jsonwebtoken');
const verify =require('../routes/verifyToken');
var agent = require("../controllers/agentController");




//agent sign-up

router.post('/create', function(req, res) {
    agent.save(req, res);
})

//agent-login
router.post('/agentLogin', (req, res) => {
    let agentDetails = req.body;
    console.log(agentDetails);
    Agent.findOne({ email: agentDetails.agentUsername }, (error, agent) => {
        if (error) {
            console.log(error);
        } else {
            if (!agent) {
                res.status(401).send('Invalid Email');
            } else {
                var passcode = cryptography.sha256(agentDetails.agentPassword);
                if (agent.password !== passcode) {
                    res.status(401).send('Invalid Password');
                } else {
                    var payload = { subject: agent._id };
                    var token = jwt.sign(payload, 'secretKey', { expiresIn: 180 });
                    res.header('auth-token', token);
                    res.send({token,agent});
                }
            }

        }
    })
})

router.post('/forgotPassword/',function(req,res){
    agent.forgotPassword(req,res);
});

//  //Getting Particular user
// router.get('/viewAgent', verify,(err,res)=>{
//     console.log("hitted");
//     let agentPayload = jwt.verify(token, 'secretKey');
//     console.log(agentPayload.subject);
//     res.status(200).send({message: "got it"});
// })

module.exports = router;