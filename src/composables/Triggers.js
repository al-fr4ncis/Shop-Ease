import { ref } from 'vue'

const isVisible = ref(false)

function toggleisVisible() {
  isVisible.value = !isVisible.value
}

export { isVisible, toggleisVisible }
