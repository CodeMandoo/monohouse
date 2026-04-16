import { watchEffect } from 'vue'

export function useTitle(title: string) {
  watchEffect(() => {
    document.title = title
  })
}
