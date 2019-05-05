const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
})

// 中间件 pre 要删除前 执行 这些代码
authorSchema.pre('remove', function(next){
    Book.find({ author: this.id }, (err, books) => {
        if(err){
            next(err);
        } else if(books.length > 0){
            next(new Error('This author has books still'))
        } else {
            next();
        }
    })
})

module.exports = mongoose.model('Author', authorSchema);