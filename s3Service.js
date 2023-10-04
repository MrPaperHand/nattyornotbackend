const { S3 } = require("aws-sdk")
const uuid = require("uuid").v4 

exports.s3Upload = async (file) => {
    const s3 = new S3()
    // console.log('file: ',file)
    const key = `${uuid()}-${file.originalname}`
    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer
    }

    await s3.upload(param).promise()

    return key
}

// const params = {
//     Bucket: 'nattyornot',
//     Key: 'uploads/26af6727-795f-46c7-9905-8c13802a72e9-doggiepic.jpeg'
// }

// s3.getObject(params, (err, data) => {
//     const image = data.Body

//     app.get('/view-image', (req,res) => {
//         res.setHeader('Content-Type', 'image/jpeg')
//         res.end(imageData)
//     })
// })