'use strict';
const path = require('path');
const fs = require('fs');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const Minio = require('minio')
module.exports = {
    connectServer: function () {
        return new Minio.Client({
            // endPoint: 'localhost',
            endPoint: 'minio',
            port: 9099,
            useSSL: false,
            accessKey: 'root',
            secretKey: 'buiquanghieu',
            // secure: false,
        });
    },

    uploadImage: async function (req, res) {
        const minioClient = await this.connectServer();
        const bucketName = "photos"
        const file = req.file;
        var mimeType = path.extname(file.originalname)

        //Check exists bucket
        await minioClient.bucketExists(bucketName, async function (err, exists) {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }
            if (!exists) {
                // Make a bucket ${bucketName}.
                await minioClient.makeBucket(bucketName, 'us-east-1', function (err) {
                    if (err) {
                        return res.status(400).send(err);
                    }
                });
            }

            var metaData = {
                'Content-Type': `image/${mimeType}`
            }
            // Using fPutObject API upload your file to the bucket photos.
            await minioClient.fPutObject(bucketName, file.filename, file.path, metaData, function (err, etag) {
                if (err) {
                    return res.status(400).send(err);
                } else {
                    unlinkAsync(req.file.path)
                    return res.send(file);
                }
            })
        })

    },

    getImage: async function (req, res) {
        let data;
        const minioClient = await this.connectServer();
        const bucketName = "photos"
        minioClient.getObject(bucketName, req.query.path, function (err, objStream) {
            if (err) {
                return res.status(400).send(err);
            }
            objStream.on('data', function (chuck) {
                data = !data ? new Buffer(chuck) : Buffer.concat([data, chuck]);
            })
            objStream.on('end', function () {
                // let mimeType = path.extname(req.query.path)
                // res.writeHead(200, { 'Content-Type': `img/${mimeType}` });
                res.write(data);
                res.end();
            })
            objStream.on('err', function (err) {
                res.status(400).send(err);
            })
        })
    },

    deleteImage: async function (req, res) {
        const minioClient = await this.connectServer();
        const bucketName = "photos"
        minioClient.removeObject(bucketName, req.query.path, function (err) {
            if (err) {
                return res.status(400).send(err);
            } else {
                res.status(200).send({ msg: 'Delete successul' });
            }
        })
    }
}