## 使用文档

先安装包：

```bash
npm install -S miniapp-auth-v1
```

在需要使用的文件里面引入包：

```javascript
import { creatMiniAuth, getToken } from 'miniapp-auth';
```

初始化`mini-auth`:

```javascript
creatMiniAuth({
    appid: '<appid>',
    url: '<url>',
    appKey: '<appKey>',
    appSecret: '<appSecret>',
    env: '<env>',
})
```

请求获取`token`:

```javascript
getToken()
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    });
```