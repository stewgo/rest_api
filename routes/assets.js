const express = require('express');
const exceptionHandler = require('../utils/exceptionHandler');
const getConfig = require('../utils/getConfig');
const uuid = require('uuid');
const fs = require('fs');
const AWS = require('aws-sdk');
const multer  = require('multer');
const upload = multer();
const router = express.Router();

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const mimeTypeMapping = {
    'image/gif': '.gif',
    'image/jpeg': '.jpg',
    'image/png': '.png'
};

async function uploadToS3(file) {
    const config = getConfig();
    const s3 = new AWS.S3({
        accessKeyId: config.key,
        secretAccessKey: config.secret
    });
    const name = uuid.v4();

    return new Promise((resolve, reject) => {
        const extension = mimeTypeMapping[file.mimetype];

        if (!extension) {
            reject('Forbidden mime type');
            return;
        }
        const params = {
            Bucket: 'assets.stewgo.com.au',
            Key: `products/${name}${extension}`,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        // TODO: Add gzip compression
        // TODO mobile app should upload compressed files too
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
        s3.upload(params, function(s3Err, data) {
            if (s3Err) {
                reject(s3Err);
            }
            console.log(`File uploaded successfully at ${data.Location}`);
            resolve(`${name}${extension}`);
        });
    });
}

router.post('/', upload.single('asset'), exceptionHandler(async (req, res) => {
    // https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
    const response = await uploadToS3(req.file);

    res.send(response);

}));

module.exports = router;