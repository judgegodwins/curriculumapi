var Video = require('../models/video');
const bcrypt = require('bcrypt');
const { Model } = require('mongoose');

var router = require('express').Router();

router.get('/', (req, res) => {
    res.send('welcome to the videos API');
});

router.get('/', (req, res) => {
    let { classId } = req.query;

    Videos.findOne({ classId }, (err, data) => {
        if(err) console.log(err);
        res.send(data);
    });
});

const checkAdmin = (req, res, next) => {
    let { adminName, password } = req.body;
    if(adminName === process.env.ADMINNAME) {
        bcrypt.compare(password, process.env.ADMINPASSWORD, (err, result) => {
            if(err) console.log(err);
            if(result) {
                req.token = password
                return next();
            }
            else res.status(403).send('Not Admin')
        })
    }
} 


router.route('/add-video')
    .get((req, res) => {
        res.render('admin');
    })
    .post(checkAdmin, (req, res) => {
        let { classId, subject, title, url } = req.body;
        url = url.replace('watch?v=', 'embed/');
        url = url.replace('m.youtube', 'www.youtube')

        Video.findOne({ classId }, (err, data) => {
            let finish = (finishData) => {
                console.log('finishing')
                finishData.save((err, data) => {
                    console.log('saved')
                    if(err) console.log(err)
                    if(!err) res.redirect('/add-video');
                })
            }

            console.log(req.body, classId, title, url);

            if(!data) {
                console.log('!no data')
                var newData = new Video({
                    classId,
                    subjects: [
                        {name: subject.toLowerCase(), videos: [{title, url}]}
                    ]
                });
                console.log(newData);;
                finish(newData);

            } else {
                let foundSubject = data.subjects.find(sub => sub.name === subject.toLowerCase());
                if(foundSubject) {
                    foundSubject.videos.push(
                        {title, url}
                    );
                } else {
                    data.subjects.push(
                        {name: subject.toLowerCase(), videos: [{title, url}]}
                    );
                }
                // data.
                finish(data);
            }

        })
    })


router.get('/all', (req, res) => {
    Video.find({}, (err, data) => {
        res.json(data);
    })
})

router.get('/rem', (req, res) => {
    Video.remove({}, (err, data) => {
        res.json(data);
    })
})

router.get('/get-video', (req, res) => {
    let { classId } = req.query;
    console.log(classId)
    if(classId === '*') {
        Video.find({}, (err, data) => {
            res.json(data);
        })
    } else {
        Video.findOne({ classId }, (err, data) => {
            res.json(data);
        })
    }
});

router.get('/subjects', (req, res) => {
    let { classId } = req.query;

    Video.findOne({ classId }, (err, data) => {
        res.json(data);
    })
})

router.get('/subject-videos', (req, res) => {
    let { classId, subject } = req.query;
    Video.findOne({ classId }, (err, data) => {
        let chunkToSend = data.subjects.find(sub => sub.name === subject);
        console.log(chunkToSend)
        res.json(chunkToSend);
    })
})

router.post('/delete-video', checkAdmin, (req, res) => {
    let { classId, subject, title } = req.body;

    Video.findOne({ classId }, (err, data) => {
        if(err) console.log(err);
        let subjectFound = data.subjects.find(sub => sub.name === subject.toLowerCase());
        let delVideo = subjectFound.videos.find(vid => vid.title === title);
        subjectFound.videos.splice(subjectFound.videos.indexOf(delVideo), 1);
        data.save((err, doc) => {
            res.send('deleted successfully');
        }) 
    })
})

module.exports = router;