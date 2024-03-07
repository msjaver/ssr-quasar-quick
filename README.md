# 使用Quasar快速构建 vue ssr网站
` 以下为快速入门精华，请按步骤执行或者clone本项目，直接执行第2步和第5步看效果`
## 1.构建项目
```bash
# 创建 quasar 项目，如本项目名称：ssr-quasar-quick，插件选上 pinia、axios，其它默认
yarn create quasar
# or
npm init quasar
```
## 2.安装依赖
```bash
yarn
# or
npm install
```

## 3.给 Quasar 添加 ssr 特性 
```bash
quasar mode add ssr
```

## 4.修改配置文件
```js
 // 在配置文件 quasar.config.js  中找到 preFetch 和 plugins，开启以下配置
{
    preFetch: true,
    plugins: [
        'Meta'
    ]
}
```

### 5.启动
```bash
quasar dev -m ssr
```

### 6.验证效果(通过浏览器源代码方式检验)



### 关键代码抽取，位于文件 `IndexPage.vue` 中
```vue
<template>
  <q-page class="flex flex-center">
      <q-field prefix="这是服务端渲染出来的数据：" standout>
        <q-markup-table>
          <q-tr>
            <q-td>省份：{{ data.province }}</q-td>
          </q-tr>
          <q-tr>
            <q-td>城市：{{ data.city }}</q-td>
          </q-tr>
        </q-markup-table>
      </q-field>
  </q-page>
</template>

<script setup>
import {api} from "boot/axios";
import {useSsrStore} from "stores/ssr-store";
import {storeToRefs} from "pinia";
import {useMeta} from "quasar";
// 1. 数据预加载到 store 里
defineOptions({
  // 数据预加载， 开启SSR模式下，该函数只有在服务端或者客户端执行一次
  preFetch ({ redirect, ssrContext, store }){
    if (ssrContext) {
      // 服务端将数据预先加载到 ssrStore 中
      const ssrStore = useSsrStore(store)
      // 服务端使用异步方式，实现多个数据并发获取
      new Promise(async (resolve) => {
        const result = await api.get('/rest/position')
        console.log('在服务端获取的数据：', result.data)
        // 装入数据到store
        ssrStore.setData(result.data)
        resolve()
      })
      // 其它数据获取...
    }
  }
})

// 该 store 到这里已经有数据了
const ssrStore =  useSsrStore()
const { data } = storeToRefs(ssrStore)

// 2. 修改网页的标题，关键字等
const metaData = {
  title: 'quasar ssr 例子',
  meta: {
    description: {name: 'description', content: '这是seo的描述...'},
    keywords: {name: 'keywords', content: 'quasar ssr, vue ssr 开发'},
    // 其它配置，可查看官方
    // https://quasar.dev/quasar-plugins/meta#introduction
  }
}
useMeta(metaData)

</script>

```


### 更多配置，看官方文档
配置文件 [Configuring quasar.config.js](https://quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr)

SSR 配置 [Configuring ssr](https://quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr)