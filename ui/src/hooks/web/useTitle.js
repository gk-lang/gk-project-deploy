import { watch, ref } from 'vue'
import { isString } from '@/utils/is'
import { useAppStoreWithOut } from '@/store/modules/app'

export const useTitle = (newTitle) => {
  const appStore = useAppStoreWithOut()
  const title = ref(
    newTitle ? `${appStore.getTitle} - ${newTitle}` : appStore.getTitle
  )

  watch(
    title,
    (n, o) => {
      if (isString(n) && n !== o && document) {
        document.title = n
      }
    },
    { immediate: true }
  )

  return title
}
