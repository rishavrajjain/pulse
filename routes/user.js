const express=require('express');
require('dotenv').config()
const fs = require('fs');

const User = require('../models/user');
const jwt=require('jsonwebtoken');

const auth=require('../middleware/auth');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speechConfig = sdk.SpeechConfig.fromSubscription(`${process.env.API_KEY}`, "eastus");
const multer = require('multer');
const { default: axios } = require('axios');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

let upload = multer({ dest: 'uploads/',storage:storage });


const getTextFromAudioFile = async(filePath)=> {
    let data='';

    let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filePath));
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

   
    
    recognizer.recognized = (s, e) => {
        if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
            data=data+e.result.text;
            console.log(`RECOGNIZED: Text=${e.result.text}`);
        }
        else if (e.result.reason == sdk.ResultReason.NoMatch) {
            console.log("NOMATCH: Speech could not be recognized.");
        }
    };
    
    recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
    
        if (e.reason == sdk.CancellationReason.Error) {
            console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
            console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
            console.log("CANCELED: Did you update the key and location/region info?");
        }
    
        recognizer.stopContinuousRecognitionAsync();
    };
    
    recognizer.sessionStopped = (s, e) => {
        console.log("\n    Session stopped event.");
        recognizer.stopContinuousRecognitionAsync();
        return data;
    };

    recognizer.startContinuousRecognitionAsync();

    // const result = await recognizer.recognized;
    // console.log(result);
    // return result;

    // recognizer.rec(result => {
    //     data = result.text;
    //     console.log(`RECOGNIZED: Text=${result.text}`);
    //     recognizer.close();
    //     return data;
    // });

    
}

const router=express.Router();










router.post('/createuser',async(req,res)=>{

    console.log(req.body);

    try{

        const check=await User.findOne({email:req.body.email});

        if(check){
            res.status(400).json({
                data:{
                    message:'User Already exists.Please Login'
                }
            })
        }
        const user=new User(req.body);
        console.log(user)
        const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
        user.tokens=user.tokens.concat({token})
        console.log(user);
        await user.save();
        console.log('done');
        res.status(200).json({
            data:{
                token,
                email:user.email,

            }
        })
        
    }catch(e){
        
        res.status(500).json({
            data:{
                message:'Internal Server Error'
            }
        })
    }

})

router.post('/login',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    try{
        const user=await User.findOne({email});
        if(!user){
            res.status(404).json({
                data:{
                    message:'User Not found.Please register first.'
                }
            })
        }
        if(user.password === password){
            const token =jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
            user.tokens=user.tokens.concat({token})
            await user.save();
            res.status(200).json({
                data:{
                    token,
                    email:user.email,
                    name:user.name,
                    
                }
            })

        }else{
            res.status(401).json({
                data:{
                    message:'Invalid Credentials'
                }
            })
        }
    }catch(err){
        res.status(200).json({
            data:err
        })
    }
})





router.post('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.status(200).json({
            data:{
                message:'Logged out successfully'
            }
        })
    }catch(e){
        res.status(500).json({
            data:{
                message:'Internal Server Error'
            }
        })
    }
})

// router.post('/getTextFromSpeech',upload,async(req,res)=>{
//     console.log(req.files);
//     console.log(req)
//     console.log(req.file.filename);
//     console.log(req.body.formData.file)

//     res.send('ok')

// })

router.post('/analyse', upload.single('file'), async(req, res, next) => {

    try{
        const file = req.file;

    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    let data='';

    let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(`./uploads/${file.filename}`));
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

   
    
    recognizer.recognized = (s, e) => {
        if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
            data=data+e.result.text;
            console.log(`RECOGNIZED: Text=${e.result.text}`);
        }
        else if (e.result.reason == sdk.ResultReason.NoMatch) {
            console.log("NOMATCH: Speech could not be recognized.");
        }
    };
    
    recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
    
        if (e.reason == sdk.CancellationReason.Error) {
            console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
            console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
            console.log("CANCELED: Did you update the key and location/region info?");
        }
    
        recognizer.stopContinuousRecognitionAsync();
    };
    
    recognizer.sessionStopped = async(s, e) => {
        console.log("\n    Session stopped event.");
        recognizer.stopContinuousRecognitionAsync();
        res.status(200).json({
            data:data
        })
        
    };

    recognizer.startContinuousRecognitionAsync();
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            data:'Error'
        })
    }

    
    
    
    
  })

router.post('/analyseData',async(req,res)=>{
    const data = req.body.data;
    try{
        const namedEntityRecognition = {
            "model": {
              "identifier": "a92fc413b5",
              "version": "0.0.12"
            },
            "input": {
              "type": "text",
              "sources": {
                "text": {
                  "input.txt": data
                }
              }
            }
          }
      
          const sentimentAnalysis = 
          {
            "model": {
              "identifier": "ed542963de",
              "version": "1.0.1"
            },
            "input": {
              "type": "text",
              "sources": {
                "0001": {
                  "input.txt": data
                }
              }
            }
          }
      
          const summarization = {
            "model": {
              "identifier": "rs2qqwbjwb",
              "version": "0.0.2"
            },
            "input": {
              "type": "text",
              "sources": {
                "0001": {
                  "input.txt": data
                }
            }
          }
        }
      
        const topicModelling ={
          "model": {
            "identifier": "m8z2mwe3pt",
            "version": "0.0.1"
          },
          "input": {
            "type": "text",
            "sources": {
              "0001": {
                "input.txt": data
              }
            }
          }
        }
      
          var headers = {
            'Content-Type': 'application/json',
            'Authorization': `ApiKey ${process.env.MODZY_API_KEY}`
          }
        const job1 = await axios.post('https://app.modzy.com/api/jobs',sentimentAnalysis,{headers:headers});
        const job2 = await axios.post('https://app.modzy.com/api/jobs',summarization,{headers:headers});
        const job3 = await axios.post('https://app.modzy.com/api/jobs',topicModelling,{headers:headers});

        const result1 = await axios.get('https://app.modzy.com/api/results/'+job1.data.jobIdentifier,{headers:headers});
        const result2 = await axios.get('https://app.modzy.com/api/results/'+job2.data.jobIdentifier,{headers:headers});
        const result3 = await axios.get('https://app.modzy.com/api/results/'+job3.data.jobIdentifier,{headers:headers});
            
            res.status(200).json({
                data:{
                    'sentiment':result1.data,
                    'summary':result2.data,
                    'topicModels':result3.data
                }
            })

        
    }catch(err){
        console.log(err);
        res.status(500).send('error')
    }
})




module.exports=router;