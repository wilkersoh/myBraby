const express = require('express');
const Author = require('../models/author');
const Books = require('../models/book')

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

// Create author route  /authors/
router.post('/', async (req, res) => {
    const author = new Author({
        // 发数据 给database
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

// CRUD , put and delete method install method-override
// Show author 当点击 view
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Books.find({ author: author.id}).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch{
        res.redirect('/')
    }
})

// 点击Edit button 
router.get('/:id/edit', async (req, res) => {
    try{
        // 寻找url  .id的 
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', {
            author: author
        })
    } catch {
        res.redirect('/authors')
    }

})

// 更新 - 当点击update button 实现这个
router.put('/:id/edit', async (req, res) => {
    let author;
    try {
        // 找url里的 id 在 database 
        author = await Author.findById(req.params.id)
        // form name里写的 资料 
        author.name = req.body.name;
        // 储存进database 更新了
        await author.save()
        res.redirect(`/authors/${author.id}`)
  
    } catch {
        if(author == null){
            res.redirect('/');
        } else {
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error UpdatingAuthor'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author;
    try {
        // 找url里的 id 在 database 
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } catch {
        if(author == null){
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router