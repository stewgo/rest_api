const express = require('express');
const exceptionHandler = require('../utils/exceptionHandler');
const getConfig = require('../utils/getConfig');
const uuid = require('uuid');
const fs = require('fs');
const AWS = require('aws-sdk');
const router = express.Router();

async function upload() {
    const config = getConfig();
    const s3 = new AWS.S3({
        accessKeyId: config.key,
        secretAccessKey: config.secret
    });
    const name = uuid.v4();

    return new Promise((resolve, reject) => {
        const params = {
            Bucket: 'assets.stewgo.com.au',
            Key: `products/${name}.csv`,
            Body: JSON.stringify({ a: 'lol', b: 'lol'}, null, 2)
        };

        s3.upload(params, function(s3Err, data) {
            if (s3Err) {
                reject(s3Err);
            }
            console.log(`File uploaded successfully at ${data.Location}`);
            resolve();
        });
    });
}

router.post('/', exceptionHandler(async (req, res) => {
    await upload();

    res.send('OK');
}));

module.exports = router;