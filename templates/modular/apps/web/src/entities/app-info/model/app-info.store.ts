import { defineStore } from 'pinia'

export const useAppInfoStore = defineStore('app-info', {
  state: () => ({
    title: 'Web Shell',
  }),
  persist: true,
})
