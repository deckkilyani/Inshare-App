const router = require('express').Router();
const multer = require('multer'); 
const path = require('path');
const File = require('../models/file');
const {v4: uuidv4} = require('uuid');


const storage = multer.diskStorage({
    destination: ((req, file, cb) => {
        cb(null, 'uploads/');

    }),
    filename: ((req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    })
    
})

let upload = multer({ 
    storage: storage,
    limit:{fileSize: 1000000*100}
}).single('myfile');



router.post('/', (req, res) => {
    

    //Store File
    upload(req, res, async (err) => {

        // Validate the request body
        if(!req.file) {
            return res.status(400).json({
                message: 'No file provided'
            });
        }



        if(err) {
            return res.status(500).json({
                message: 'Error uploading file'
            });
        }
        // Store into Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size,
        })

        const response = await file.save();
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});

        // http://localhost:3000/files/{uuid}
    });




    

    // Respond to the client


})


router.post('/send', async (req, res) => {
    const {uuid, emailTo, emailFrom,} = req.body;
    console.log(req.body);
    /// Validate the request body
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({
            error: 'Missing required fields'
        });
    }

    const file = await File.findOne({uuid: uuid});
    if(file.sender) { // if file has already been sent
        return res.status(422).send({
            error: 'File has already been sent' // file has already been sent
        });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save(); //save new data to database


    /// Send Mail
    const sendMail = require('../services/emailService');

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'File from your friend',
        text: `${emailFrom} has sent you a file.`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            emailTo: emailTo,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 hours' // 24 hours
        })
    });

    return res.json({success: true});

})


module.exports = router;