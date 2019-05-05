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
        res.redirect(`/books/${newBook.id}`);
    } catch {
        renderNewPage(res, book, true)
    }
});


// 点击book 然后去转跳进去
router.get('/:id', async (req, res) => {
    try {
        // 通过 点击a tag找到这个book的 资料，populate是连接也能得到author Schema里的资料
        const book = await Book.findById(req.params.id).populate('author').exec();
        // 转跳进来shows.ejs 然后book里有连接 book 和 author资料
        res.render('books/shows', { book: book })
    } catch {
        res.redirect('/')
    }
})

// Edit book route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        // res is for render page , look below
        renderEditPage(res, book);
    } catch {
        res.redirect('/')
    }
})

// Update Book Route(PUT)
router.put('/:id', async (req, res) => {
    let book;
    try{
        // 进入 edit页面 submit form 就会来到这里
        book = await Book.findById(req.params.id);
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover);
        }
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch {
        if(book != null){
            renderEditPage(res, book, true)
        } else {
            redirect('/')
        }
    }
});

// 删除 book~~
router.delete('/:id', async (req, res) => {
    let book;
    try{
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books');
    } catch {
        if(book != null){
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false){

    try {
        // 传去 _form那边
        const authors = await Author.find({})
        const params = {
           authors: authors,
           book: book
       }
       if(hasError){
           if(form === 'edit'){
               params.errorMessage = 'Error Updating Book'
           } else {
               params.errorMessage = 'Error Create Book'
           }
       }
        if(hasError) params.errorMessage = "Error Creating Book"
        // send those data to page from params
        res.render(`books/${form}`, params)
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