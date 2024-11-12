import { ref } from 'vue'

const images = ref<Map<string, any>>(new Map())

for (const key in obj) {
  images.value.set(key, obj[key].default)
}
console.log(images)
export { images }
