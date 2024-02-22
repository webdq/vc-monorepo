import { computed } from 'vue'

export const useModel = (props: any, propName: string, emit: any) => {
  return computed({
    get() {
      return new Proxy(props[propName], {
        set(obj, key, val) {
          obj[key] = val
          emit('update:' + propName, { ...obj })
          return true
        }
      })
    },
    set(val) {
      emit('update:' + propName, val)
    }
  })
}
