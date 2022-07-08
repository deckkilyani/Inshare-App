const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    const {uuid} = req.params;

    try {
        const file = await File.findOne({uuid});
        if(!file) {
            return res.render('download', {error: 'Link has been expired.'});
        }
        return res.render('download',{
            uuid: file.uuid, // fields from database
            filename: file.filename,
            //path: file.path,
            size: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
              // http://localhost:3000/files/{uuid}
    }); //try block ends here
   
    } catch (error) {
        return res.render('download',{error: 'Something went wrong'});
        
    }
    
})

module.exports = router;