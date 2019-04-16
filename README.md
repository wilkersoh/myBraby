### NodeJs-Mongoose-HerokuServer

* env 是一个环境变量 
<p>这里设置这个是为了mongoose然后连接heroku使用</p>
<p>里面的资料，都是比较敏感的。</p>
<p>在最顶端设置</p>
<p>process.env.NODE_ENV - set by default by node</p>
<p>如果不等于 production 就执行</p>
``` javascript
// app.js
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
```
<p>在heroku app，通过setting里的设置连接这个env和mongoose的key</p>