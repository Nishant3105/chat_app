const S3Services=require('../services/s3-service')

const Chat=require('../model/chat')

const postmedia=async(req,res,next)=>{
    try {
        const user = req.user

        const { fileData,groupid } = req.body

        const stringified = JSON.stringify(fileData);

        const fileName = `mediachat${user.id}/${new Date()}.txt`;

        console.log(stringified,"somethinggggg...>",fileName)

    
        const fileURL = await S3Services.uploadS3(stringified, fileName)
        if (groupid==0) {
            const response = await Chat.create({
                username: user.name, message:fileURL , userId: user.id
            })
            if (response) {
                res.status(201).json({ fileURL, success: true })
            }
        } else {
            const response = await Chat.create({
                username: user.name, message:fileURL , userId: user.id, groupId: groupid
            })
            if (response) {
                res.status(201).json({ fileURL, success: true })
            }
        }
    
    } catch (err) {
        res.status(401).json({ success: false, err: err })
        console.log(err)
    }
    
}

module.exports={
    postmedia:postmedia
}