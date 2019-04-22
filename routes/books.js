const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
// const multer = require('multer');
// const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'images/gif'];
// const upload = multer({
//     // multer的方法来的  dest, fileFilter
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         // 有这类型的 文件才 接受 jpeg png gif
//         callback(null, imageMimeTypes.includes(file.mimetype))
//     }
// })

// Book route
router.get('/', async (req, res) => {
    // Search book 用
    let query = Book.find();
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    } 
    // 发布之前
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        // check in database
        query = query.lte('publishDate', req.query.publishedBefore)
    } 
    //  发布之后 
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    } 
    try{
        const books = await query.exec()
        res.render('books/index', {
            books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }

})

// new book 
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
})

// Create book route
// upload 1个file 名是cover 在_form里 也不清楚 req.file和upload.single有什么关系
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description, 
    })

    saveCover(book, req.body.cover);
        
    try{
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`);
        res.redirect('books');
    } catch {
        renderNewPage(res, book, true)
    }
}) 

async function renderNewPage(res, book, hasError = false){

    try {
        // 传去 _form那边
        const authors = await Author.find({})
        const params = {
           authors: authors,
           book: book
       }
        res.render('books/new', params)
        if(hasError) params.errorMessage = "Error Creating Book"
    } catch {
        res.redirect('/books');
    }
}

function saveCover(book, coverEncoded){
    if (coverEncoded == null) return 
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type;
    }
}

module.exports = router