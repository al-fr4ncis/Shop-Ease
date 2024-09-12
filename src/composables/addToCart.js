import { storeToRefs } from 'pinia'
import { useCartListCountStore } from '@/stores/cartListCount'

export const addItemToCard = (product) => {
  const cartStore = useCartListCountStore()
  const { cartListCount } = storeToRefs(cartStore)

  // Retrieve the cart from localStorage or initialize an empty array if it doesn't exist
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  // Find the index of the existing product in the cart
  const existingProduct = cart.findIndex((cart) => cart.id == product.id)

  if (existingProduct !== -1) {
    // Update the existing product's quantity
    cart[existingProduct] = product
  } else {
    // Add the new item to the cart
    // cart.push(product);
    cart.unshift(product)
  }

  // Update cartListCount
  cartListCount.value = cart.length

  // Update the cart in localStorage
  localStorage.setItem('cart', JSON.stringify(cart))
}
