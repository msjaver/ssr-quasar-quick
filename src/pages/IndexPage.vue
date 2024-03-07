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

defineOptions({
  // 数据预加载， 开启SSR模式下，该函数只有在服务端或者客户端执行一次
  preFetch ({ redirect, ssrContext, store }){
    if (ssrContext) {
      // 服务端将数据预先加载到 ssrStore 中
      const ssrStore = useSsrStore(store)
      // 服务端使用异步方式，实现数据获取
      return new Promise(async (resolve) => {
        const result = await api.get('/rest/position')
        console.log('在服务端获取的数据：', result.data)
        // 装入数据到store
        ssrStore.setData(result.data)
        resolve()
      })
    }
  }
})

// 该 store 在这里，已经有服务端获取的值了
const ssrStore =  useSsrStore()
const { data } = storeToRefs(ssrStore)
console.log(66666, data)
// 网页页面的标题，关键字等替换
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
