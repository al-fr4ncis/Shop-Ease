<template>
  <Section class="cart">
    <div class="cart__container">
      <div v-if="cartListCount == 0" class="cart__empty">
        <div class="cart__empty-container">
          <img src="/src/assets/images/Empty_Cart.svg" class="cart__empty-img" alt="Cart" />
          <div class="cart__empty-description-container">
            <h1 class="cart__empty-title">Your shopping cart is empty</h1>
            <p class="cart__empty-description">Add your favorite items in it.</p>
          </div>
          <RouterLink to="/" class="cart__empty-button">Go shopping now</RouterLink>
        </div>
      </div>
      <ul class="cart__list" role="list">
        <li v-for="(product, index) in cart" :key="index" class="cart__item">
          <input type="checkbox" v-model="product.selected" class="cart__checkbox" />
          <img
            @click="viewProduct(product.id)"
            :src="product.thumbnail"
            alt="thumbnail"
            class="cart__img"
          />
          <p @click="viewProduct(product.id)" class="cart__title">{{ product.title }}</p>
          <p class="cart__stock">stock: {{ product.stock }}</p>
          <div class="cart__price-container">
            <p class="cart__price">${{ product.price }}</p>
            <p class="cart__discount">-{{ product.discountPercentage }}%</p>
          </div>
          <p class="cart__shipping">{{ product.shippingInformation }}</p>
          <div class="cart__quatity">
            <button @click="setQuantity(-1, index, $event)" class="cart__quatity__minus-btn">
              -
            </button>
            <input
              type="number"
              @blur="blur(product.quantity, index)"
              @keydown="keydown($event)"
              @keyup="keyup($event, index)"
              v-model="product.quantity"
              class="cart__quatity__input"
            />
            <button @click="setQuantity(+1, index, $event)" class="cart__quatity__add-btn">
              +
            </button>
          </div>
          <button @click="deleteItem(index)" class="cart__delete">
            <img src="@/assets/images/del.svg" alt="delete button" />
          </button>
        </li>
      </ul>

      <div class="cart__order-summary">
        <div class="cart__order-summary-container">
          <h1 class="cart__summary">Order Summary</h1>

          <div class="cart__select-all-checkbox-container">
            <input
              type="checkbox"
              @click="toggleSelectAll"
              v-model="allSelected"
              :disabled="cartListCount == 0"
              class="cart__select-all-checkbox"
            />
            <span class="cart__select-all-text">Select all ({{ cartListCount }})</span>
          </div>

          <p class="cart__total-item">Total ({{ totalSelectedItem.total }} item)</p>
          <p class="cart__total-amount">₱{{ totalAmount }}</p>
          <button class="cart__checkout">Checkout</button>
        </div>
      </div>
    </div>
  </Section>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { addItemToCard } from '@/composables/addToCart'
import { useCartListCountStore } from '@/stores/cartListCount'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAllProductsStore } from '@/stores/allProducts'

export default {
  setup() {
    const cart = ref([])
    const quantityZero = ref(false)
    const cartStore = useCartListCountStore()
    const { cartListCount } = storeToRefs(cartStore)
    const router = useRouter()
    const productsStore = useAllProductsStore()
    const { fetchSingleProduct } = productsStore

    // Check if every item in the cart is selected
    const allSelected = computed(() => cart.value.every((item) => item.selected))

    const totalAmount = computed(() => {
      // Calculate the total price of selected items
      const total = cart.value
        .filter((item) => item.selected) // Only include items that is selected
        .reduce((total, item) => total + item.price, 0)

      // Format the total to 2 decimal places
      return total.toFixed(2)
    })

    const totalSelectedItem = computed(() => {
      const total = cart.value.filter((item) => item.selected).length

      return {
        total
      }
    })

    /**
     * Fetches the cart data from `localStorage` when the component is mounted.
     * If a cart is found in `localStorage`, it parses the JSON string and assigns
     * it to `cart.value`. If no cart is found, it initializes `cart.value` as an
     * empty array.
     */
    onMounted(() => {
      const storedCart = localStorage.getItem('cart')
      cart.value = storedCart ? JSON.parse(storedCart) : []
    })

    /**
     * Updates the quantity of a product in the cart based on user input.
     *
     * This function allows users to increase or decrease the quantity of a specific product in the cart.
     * If the new quantity equals zero, the function prevents the action.
     * If the new quantity is greater than zero, the product's quantity is updated and added back to the cart.
     *
     * @param {number} quantity - The amount by which to change the item's quantity (positive or negative).
     * @param {number} index - The index of the item in the cart to update.
     * @param {Event} e - The event object, used to prevent the default action if the quantity reaches zero.
     *
     */
    const setQuantity = (quantity, index, e) => {
      // Calculate the new quantity
      if (cart.value[index].quantity + quantity == 0) {
        e.preventDefault()
      } else {
        // Update the item's quantity
        cart.value[index].quantity += quantity
        // Add the updated item back to the cart
        addItemToCard(cart.value[index])
      }
    }

    const keydown = (e) => {
      if (quantityZero.value) {
        if (e.key == 0) {
          e.preventDefault()
        }
      }

      if (isNaN(parseInt(e.key))) {
        if (e.key !== 'Backspace') {
          e.preventDefault()
        }
      }
    }

    const keyup = (e, index) => {
      if (e.target.value.length == 0) {
        quantityZero.value = true
      } else {
        quantityZero.value = false
        addItemToCard(cart.value[index])
      }
    }

    const blur = (quantity, index) => {
      if (quantity < 1) {
        cart.value[index].quantity = 1
        addItemToCard(cart.value[index])
      }
    }

    const deleteItem = (index) => {
      cart.value.splice(index, 1)
      localStorage.setItem('cart', JSON.stringify(cart.value))
      cartListCount.value = cart.value.length
    }

    const toggleSelectAll = () => {
      const selectAll = !allSelected.value

      cart.value.forEach((item) => {
        item.selected = selectAll
      })
    }

    const viewProduct = (id) => {
      fetchSingleProduct(id)
      router.push(`/product/${id}`)
    }

    return {
      cart,
      setQuantity,
      keydown,
      keyup,
      blur,
      deleteItem,
      cartListCount,
      toggleSelectAll,
      allSelected,
      totalAmount,
      viewProduct,
      totalSelectedItem
    }
  }
}
</script>

<style lang="scss" scoped>
.cart {
  padding-top: 8rem;
  padding-bottom: 6rem;
  max-width: 1200px;
  margin: 0 auto;

  &__container {
    padding: 0 0.5rem;
  }

  &__empty {
    display: grid;
    align-items: center;
    height: calc(100dvh - 20rem);
  }

  &__empty-container {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
  }

  &__empty-img {
    min-width: 9rem;
  }

  &__empty-title {
    font-size: 1.5rem;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  }

  &__empty-description {
    font-size: 1.3rem;
    font-family: 'Inter', sans-serif;
    color: $clr-gray;
    white-space: nowrap;
  }

  &__empty-button {
    grid-column: 1/3;
    justify-self: center;
    padding: 1rem 4.2rem;
    text-decoration: none;
    color: $clr-white;
    background-color: $bg-orange-700;
    font-family: 'Inter', sans-serif;
    font-size: 1.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      opacity: 0.7;
    }
  }

  &__list {
    display: grid;
    gap: 1rem;
  }

  &__select-all-text {
    font-family: 'Inter', sans-serif;
    font-size: 1.6rem;
  }

  &__item {
    display: grid;
    grid-template-columns: auto auto repeat(2, 1fr);
    grid-template-rows: auto 1fr repeat(2, auto);
    border: 1px solid rgba(0, 0, 0, 0.5);
    column-gap: 0.5rem;
    border-radius: 1rem;
    padding: 0.5rem;
  }

  &__checkbox {
    justify-self: center;
    grid-row: 1 / 5;
    width: 2rem;
  }

  &__img {
    grid-column: 2;
    grid-row: 1 / 5;
    min-width: 8rem;
    max-height: 8rem;
    max-width: 8rem;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    align-self: center;
    cursor: pointer;
  }

  &__title {
    cursor: pointer;
    grid-row: 1;
    grid-column: 3 / 5;
    width: fit-content;
    height: fit-content;
    font-family: 'Inter', sans-serif;
    font-size: 1.6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    padding-right: 2.5rem;
  }

  &__discount {
    border: 1px solid $border-orange-700;
    padding: 0 1px;
  }

  &__stock,
  &__discount {
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
  }

  &__stock {
    grid-column: 3;
    grid-row: 2;
  }

  &__price-container {
    grid-row: 3;
    grid-column: 3;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__price {
    font-family: 'Inter', sans-serif;
    font-size: 1.8rem;
  }

  &__shipping {
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    grid-row: 4;
    grid-column: 3 / 5;
  }

  &__quatity {
    display: flex;
    grid-column: 4;
    grid-row: 3 / 4;
    justify-self: end;
    align-self: center;

    &__input {
      max-width: 4rem;
      text-align: center;
      font-family: 'Inter', sans-serif;
      border: 1px solid;
      border-left: none;
      border-right: none;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
      }
    }

    &__minus-btn,
    &__add-btn {
      cursor: pointer;
      width: 1.4rem;
      aspect-ratio: 1 / 1;
      background-color: transparent;
      border: 1px solid;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }

  &__delete {
    width: fit-content;
    grid-row: 1;
    grid-column: 4;
    justify-self: end;
    background-color: transparent;
    border-radius: 50%;
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    padding: 0.2rem;

    img {
      width: 2rem;
    }

    &:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  &__order-summary {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 0;
    padding: 1rem;
    background-color: $bg-white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.09);
  }

  &__order-summary-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0;
  }

  &__summary {
    margin-right: 1rem;
    font-family: 'Inter', sans-serif;
    display: none;
  }

  &__select-all-checkbox-container {
    margin-right: auto;
    display: flex;
    gap: 0.5rem;
  }

  &__total-item {
    margin-left: auto;
  }

  &__total-item,
  &__total-amount {
    white-space: nowrap;
    font-size: 1.2rem;
    font-family: 'Inter', sans-serif;
  }

  &__total-amount {
    color: $clr-orange-700;
  }

  &__checkout {
    font-size: 1.6rem;
    font-family: 'Inter', sans-serif;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    border: 1px solid;
    background-color: $bg-orange-700;
    color: $clr-white;
  }
}

@media (min-width: 481px) {
  .cart {
    &__title {
      font-size: 1.7rem;
    }

    &__stock {
      font-size: 1.3rem;
    }

    &__price {
      font-size: 2rem;
    }

    &__discount {
      font-size: 1.3rem;
    }

    &__shipping {
      font-size: 1.3rem;
    }

    &__quatity {
      &__input {
        width: 100%;
        height: 100%;
        max-width: 5rem;
        font-size: 1.5rem;
      }

      &__minus-btn,
      &__add-btn {
        width: 2rem;
        aspect-ratio: unset;
      }
    }

    &__total-item,
    &__total-amount {
      font-size: 1.7rem;
    }

    &__checkout {
      font-size: 1.8rem;
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}

@media (min-width: 768px) {
  .cart {
    padding-top: 9rem;
    padding-bottom: 8rem;

    &__item {
      grid-template-columns: auto auto minmax(200px, 1fr) auto minmax(auto, 1fr) auto auto;
      align-items: center;
      column-gap: 2rem;
    }

    &__title {
      grid-column: 3/4;
      font-size: 1.8rem;
    }

    &__stock {
      order: 2;
      align-self: start;
      font-size: 1.4rem;
    }

    &__price-container {
      grid-column: 5;
      grid-row: 1 / -1;
      justify-self: center;
    }

    &__discount {
      font-size: 1.4rem;
    }

    &__shipping {
      grid-column: 4;
      grid-row: 1 / -1;
      font-size: 1.4rem;
    }

    &__quatity {
      grid-column: 6;
      grid-row: 1 / -1;

      &__input {
        font-size: 1.6rem;
      }
    }

    &__summary {
      display: block;
      font-size: 2rem;
    }

    &__delete {
      grid-column: 7;
      grid-row: 1 / -1;
      padding: 0.5rem;

      img {
        width: 2.3rem;
      }
    }

    &__order-summary {
      padding: 1.5rem 2rem;
    }

    &__summary {
      font-size: 2rem;
    }

    &__total-item,
    &__total-amount {
      font-size: 1.8rem;
    }

    &__checkout {
      padding: 1rem 1.5rem;
    }
  }
}
</style>
