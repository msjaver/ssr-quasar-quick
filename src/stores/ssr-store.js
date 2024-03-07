import { defineStore } from 'pinia';

export const useSsrStore = defineStore('ssrStore', {
  state: () => ({
    data: {
      code: '',
      province: '',
      city: '',
      url: ''
    },
  }),
  actions: {
    setData(data) {
      Object.assign(this.data, data)
    },
  },
});
