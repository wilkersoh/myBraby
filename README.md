### Brary-HerokuServer
npm run dev - developmentMode
*Project learn from online. Not created by me.
* env
* locals
* toISOString()
* enctype="multipart/form-data" html tag
* multer npm插件 确保上传的文件符合要求 看下面代码
* schema.virtual('xx')
* FilePond 
* method-override 能够使用put和delete for CRUD

#### EJS 快速班

``` javascript
<%= value from render %>
<%- include('url') %>
<% pure js code %> 
```


#### env 是一个环境变量
需要install dotenv 才能设置
<p>里面的资料，都是比较敏感的。</p>
<p>如果不等于 production 就执行</p>
<p>env里的资料会储存在dotenv里的config那边</p>
<p>要设置自己的变量也没问题，不过需要大写，然后在env写你要隐藏的key</p>
``` javascript
// app.js
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

console.log(process.en.NODE_ENV) // undefined
<!-- process.env.SECRET_MESSAGE -->
//.env
TOKEN = mySuperToken

// app.js
console.log(process.env.TOKEN) //不能读取到 除非你有通过dotenv.config() 还是 require('dotenv/config')才行

```
<p>在heroku app，通过setting里的设置连接这个env和mongoose的key</p>

--------

<p>req.body.name</p>
<p>name来自input里的name value</p>
<p>searchOptions.name是 render里的第二参数资料</p>
``` ejs
<input type="text" name="name" value="<%= searchOptions.name %>"
```

------------
## 找资料
<p>在routes里的authors的get执行</p>
<p>在数据库里寻找，输入的资料。然后熏染去网页</p>


-----------
#### locals
是ejs里的全局句柄，render函数的所有变量其实都是绑定在locals这个变量上
``` ejs
<% if(locals.errroMessage != null){ %>
    <%= errorMessage %> 
<% } %>
```

* type: mongoose.Schema.Types.ObjectId
是对象另一个Schema的
``` javascript
    author: {
        // type 是一个reference 对象另一个Schema的id 他们id会相同
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // reference 对 Author 的 mongoose
        ref: 'Author'
    }
```

#### toISOString()
Date的方法
``` javascript 
let today = new Date("05 October 2011 14:48 UTC");
alert(today.toISOString()); // 返回2011-10-05T14:48:00.000Z
```

#### enctype="multipart/form-data"
<p>当我们上传的含有非文本内容，即含有文件（txt、MP3等）的时候，需要将form的enctype设置为multipart/form-data</p>
<p>form表单默认的是application/x-www-form-urlencoded</p>


#### multer
<p>dest会自动创建，文件夹 把资料放进去。uploadPath是一个路径</p>

``` javascript
const multer = require('multer');
// 地址来自 book的 database那边 定义
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['images/jpeg', 'image/png', 'images/gif'];
const upload = multer({
    // multer的方法来的  dest, fileFilter
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        // 有这类型的 文件才 接受 jpeg png gif
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
```

### virtual()
<p>可以设置虚拟属性，但这属性不会保存到数据库里。</p>
<p>比如，前台传到后台一个参数name，代表用户的名称，但是数据库保存的是两个字段，姓和名，这就可以用虚拟属性</p>

``` javascript

var schema = new Schema({
    name: {
        first: { 'type': String },  
        last: { 'type': String },
      }
});

// 当获取该 schema 的fullname属性时,将 schema 中的 name.first 和 name.last 拼接起来返回
var virtual = schema.virtual('fullname');
virtual.get(function () {
  return this.name.first + ' ' + this.name.last;
});
// 当设置该schema的 fullname 属性时,将设置的字以空格分开,分别赋值给 schema 中的 name.first 和 name.last 属性
var virtual = schema.virtual('fullname');
virtual.set(function (v) {
  var parts = v.split(' ');
  this.name.first = parts[0];
  this.name.last = parts[1];
});

// 将该 schema 保存到数据库中时,只会保存 name.first 和 name.last
// fullname属性的值不会保存到数据库中,这就是virtual
```

### FilePond 更改上传的还有一些resize
<p>设置好后需要在用到的地方设置 class="filepond"</p>

``` javascript
 <input type="file" name="cover" class="filepond">
```
<p>stylePanelAspectRatio我也搞不太清楚第一个 150 和 100 是什么。 关系到 cover的大小</p>
<p>使用FilePond后 ，他不再是通过file object send to server了， 他是通过json了</p>
<p>有什么差别呢，之前如果要save cover照片下来需要去购买一些空间，通过json后就不必了，它是数据格式了</p>

``` javascript

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150
})
```
<p>通过json格式发送file文件，之前的multer npm module 还有大量的code都被取代/p>
