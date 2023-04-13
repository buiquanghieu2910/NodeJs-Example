'use strict';
const Router = require('express-group-router');
const router = new Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });
const MinIOService = require('../services/MinIOServices');

const guestMiddleware = (req, res, next) => {
    next();
}

router.group('/', [guestMiddleware], (router) => {
    router.post('upload-image', upload.single('file'), async function (req, res) {
        MinIOService.uploadImage(req, res);
    })

    router.get('get-image', function (req, res) {
        MinIOService.getImage(req, res);
    })

    router.delete('delete-image', function (req, res) {
        MinIOService.deleteImage(req, res);
    })
});

module.exports = router.init();

