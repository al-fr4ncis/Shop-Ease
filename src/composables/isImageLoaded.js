/**
 *  * A function that provides image loading state management.
 * 
 * @function
 * 
 * @returns {Object} An object containing:
 * - `imageLoaded`: A reactive object that tracks the loading state of images by index.
 * - `loadedImg(index)`: A function to mark an image as loaded by index.
 * - `reset()`: A function to reset the `imageLoaded` state, clearing all indices.
 * 
 * @example
 * <img
      :src="product.thumbnail"
      @load="$emit('loaded-img', index)"
      :class="{ loading: !imageLoaded[index] }"
      class="card__img"
      alt="thumbnail"
    />
 */

import { ref } from 'vue'

const imageLoaded = ref({})

export function isImageLoaded() {
  const loadedImg = (index) => {
    imageLoaded.value[index] = true
  }

  const reset = () => {
    imageLoaded.value = {}
  }

  return {
    imageLoaded,
    loadedImg,
    reset
  }
}
