const express = require('express');
const Author = require('../models/author');

const router = express.Router();

// Authors 项目地址
// authors/ < app.js
router.get('/', async (req, res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== ''){
        // 不是空的话 create name
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        // 读取资料 - 把资料 放去DOM
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
})

// authors/new < app.js
router.get('/new', (req, res) => {
    res.render('authors/new', {
        author: new Author()
    })
})

// Create author route
router.post('/', async (req, res) => {
    const author = new Author({
        // 发数据 给database
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect(`authors`);
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }

    // author.save((err, newAuthor) => {
    //     if(err){
    //         res.render('authors/new', {
    //             author: author,
    //             errorMessage: 'Error creating Author'
    //         })
    //     } else {
    //         // res.redirect(`authors/${newAuthor.id}`)
    //         res.redirect(`authors`);
    //     }
    // })
})

module.exports = router