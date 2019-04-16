const express = require('express');
const router = express.Router();
const Book = require('../models/book')

router.get('/', async (req, res) => {
 let books = [];
 try{
    //  limit(10) 只显示 10个
    books = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
 } catch {
    books = [];
 }


    res.render('index', {
        books
    });
})

module.exports = router