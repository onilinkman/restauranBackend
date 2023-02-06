const {response}=require('express')

const UploadFile=(req,res=response)=>{
    console.log(req.files);
    res.json({
        msg:'hola mundo'
    })
}

module.exports={
    UploadFile
}