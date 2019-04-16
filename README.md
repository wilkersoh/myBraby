### NodeJs-Mongoose-HerokuServer

* env 是一个环境变量
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