/**
 *
 * @function
 * @returns {Object} An object containing:
 * - `cartListCount`: A reactive reference (`ref`) that holds the number of items currently in the cart.
 *
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartListCountStore = defineStore('cartListCount', () => {
  const cartListCount = ref(0)

  // Update cartListCount on store creation
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  cartListCount.value = cart.length

  return {
    cartListCount
  }
})
