const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required:true
    },
    pageCount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
       type: Buffer,
       required: true, 
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        // type 是一个reference 对象另一个Schema的id 他们id会相同
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // reference 对 Author 的 mongoose
        ref: 'Author'
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage != null && this.coverImageType != null){
        // 接受file的 json buffer 然后转换去 读的懂得code
        return `data: ${this.coverImageType};charset=utf-8;base64, ${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema);
