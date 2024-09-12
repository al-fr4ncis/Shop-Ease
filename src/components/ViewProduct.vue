<template>
  <Section class="product">
    <h1 v-if="isLoading" class="product__isloading">
      <img src="@/assets/images/loading.gif" alt="loading gif" />
    </h1>
    <div v-else-if="error == 404">
      <NotFound />
    </div>
    <div v-else class="product__container">
      <button @click="$router.back()" class="product__back-btn">
        <img src="/src/assets/images/arrow-back.svg" alt="arrow-back" />
      </button>
      <div class="product__left-content">
        <ul class="product__img-list" role="list">
          <li
            @click="setActiveImage(index)"
            v-for="(image, index) in selectedProduct.images"
            :key="index"
            class="product__img-item"
          >
            <img :src="image" alt="product images" class="product__item-image" />
          </li>
        </ul>
        <div class="product__img-container">
          <span v-if="mainImageLoading" class="product__img-skeleton"> </span>

          <img
            @load="mainImageLoaded"
            :src="activeImage"
            class="product__img"
            :class="{ loading: mainImageLoading }"
            alt="product image"
          />
        </div>
      </div>
      <div class="product__right-content">
        <h1 class="product__title">{{ selectedProduct.title }}</h1>
        <div class="product__ratings">
          <div v-for="index in 5" :key="index" class="star">
            <span class="shade" :style="starStyle(index, selectedProduct.rating)"></span>
          </div>
        </div>
        <p class="product__price">${{ selectedProduct.price }}</p>

        <p class="product__ship-info">
          <span class="product__ship-info__title">Delivery: </span>
          {{ selectedProduct.shippingInformation }}
        </p>
        <p class="product__warranty">
          <span class="product__ship-info__warranty">Warranty: </span>
          {{ selectedProduct.warrantyInformation }}
        </p>

        <div class="product__quatity">
          <p class="product__quatity__text">Quantity:</p>
          <input
            type="number"
            @blur="blur"
            @keydown="keydown"
            @keyup="keyup"
            v-model="quantity"
            class="product__quatity__input"
          />
        </div>
        <div class="product__button">
          <button @click="addToCard()" class="product__button__add-to-cart">add to cart</button>
          <button class="product__button__buy-now">buy now</button>
        </div>
      </div>
      <br />
      <hr class="product__hr" />
      <div class="product__reviews">
        <h1 class="product__reviews__rating-text">Product Ratings</h1>
        <div
          v-for="(review, index) in selectedProduct.reviews"
          :key="index"
          class="product__reviews__container"
        >
          <p class="product__reviews__name">
            <img
              src="@/assets/images/person_icon.svg"
              class="product__reviews__icon"
              alt="person icon"
            />
            {{ review.reviewerName }} &#183;
            <span class="product__reviews__date">
              {{ formatDate(review.date) }}
            </span>
          </p>
          <div class="product__ratings">
            <div v-for="index in 5" :key="index" class="star">
              <span class="shade" :style="starStyle(index, review.rating)"></span>
            </div>
          </div>
          <p class="product__reviews__comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </Section>
</template>

<script>
import { useAllProductsStore } from '@/stores/allProducts'
import { storeToRefs } from 'pinia'
import { onMounted, defineAsyncComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { starStyle } from '@/composables/starStyle'
import { addItemToCard } from '@/composables/addToCart'

export default {
  components: {
    NotFound: defineAsyncComponent(() => import('@/views/NotFound.vue'))
  },
  setup() {
    const productsStore = useAllProductsStore()
    const { fetchSingleProduct } = productsStore
    const { selectedProduct, error, isLoading } = storeToRefs(productsStore)
    const route = useRoute()
    const activeImage = ref(null)
    const quantity = ref(1)
    const quantityZero = ref(false)
    const mainImageLoading = ref(true)

    /**
     *
     * - Checks if `selectedProduct.value` is empty. If so, fetches the product details using the ID from the route parameters.
     * - If `selectedProduct.value` is not empty, sets `activeImage.value` to the first image of the selected product.
     * - Scrolls the window to the top of the page.
     *
     */
    onMounted(() => {
      if (Object.keys(selectedProduct.value).length === 0) {
        fetchSingleProduct(route.params.id)
      } else {
        activeImage.value = selectedProduct.value.images[0]
      }

    })

    watch(selectedProduct, (product) => {
      if (product.images) {
        activeImage.value = product.images[0]
      }
    })

    const setActiveImage = (index) => {
      activeImage.value = selectedProduct.value.images[index]
    }

    const changeQuantity = (value) => {
      quantity.value += value
    }

    const addToCard = () => {
      addItemToCard({ ...selectedProduct.value, quantity: quantity.value, selected: false })
    }

    const blur = () => {
      if (quantity.value < 1) {
        quantity.value = 1
      }
    }

    /**
     *  Handles the `keydown` event for an input field to restrict input based on certain conditions.
     *
     * - Prevents input of the key `0` if `quantityZero.value` is `true`.
     * - Restricts non-numeric keys from being entered unless the key is `Backspace`.
     *
     * @function
     * @param {KeyboardEvent} e - The keydown event object.
     *
     */
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

    /**
     * Handles the `keyup` event for an input field to update the state of `quantityZero`.
     *
     * - Sets `quantityZero.value` to `true` if the input field is empty after a keyup event.
     * - Sets `quantityZero.value` to `false` otherwise.
     *
     * @function
     * @param {KeyboardEvent} e - The keyup event object.
     *
     */
    const keyup = (e) => {
      if (e.target.value.length == 0) {
        quantityZero.value = true
        return
      }
      quantityZero.value = false
    }

    const mainImageLoaded = () => {
      mainImageLoading.value = false
    }

    // Watch for changes in activeImage and reset loading state
    watch(activeImage, () => {
      mainImageLoading.value = true
    })

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    }

    return {
      selectedProduct,
      error,
      isLoading,
      activeImage,
      setActiveImage,
      starStyle,
      quantity,
      changeQuantity,
      addToCard,
      blur,
      keydown,
      keyup,
      mainImageLoading,
      mainImageLoaded,
      formatDate
    }
  }
}
</script>

<style lang="scss" scoped>
$orange: orange;
$blue: #3665f3;
$white: white;

.product {
  &__isloading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
  }

  &__back-btn {
    position: absolute;
    z-index: 999;
    border-radius: 50%;
    border: 1px solid;
    background-color: $white;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }

  &__container {
    padding: 1.6rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  &__left-content {
    display: grid;
    grid-template-rows: auto auto;
    justify-items: center;
    row-gap: 2em;
  }

  &__img-list {
    display: flex;
    gap: 1.2rem;
    justify-content: center;
    grid-row: 2;
    padding: 0 2em;
  }

  &__item-image {
    max-width: 7rem;
    aspect-ratio: 1/1;
    border-radius: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.5);
    object-fit: contain;
    margin: auto;
  }

  &__img-container {
    position: relative;
    width: calc(100dvw - 5rem);
    aspect-ratio: 1/1;
  }

  .loading {
    display: none;
  }

  &__img-skeleton {
    position: absolute;
    width: 100%;
    height: 100%;
    animation: skeleton-loading 1s linear infinite alternate;
  }

  @keyframes skeleton-loading {
    0% {
      background-color: hsl(200, 20%, 80%);
    }
    100% {
      background-color: hsl(200, 20%, 95%);
    }
  }

  &__img {
    aspect-ratio: 1/1;
    object-fit: contain;
    margin: auto;
  }

  &__title {
    font-size: 2rem;
    font-family: 'Inter', sans-serif;
    margin: 1rem 0 0.2rem 0;
  }

  &__ratings {
    display: flex;
    gap: 5px;

    .star {
      min-width: 17px;
      min-height: 17px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $orange;
      clip-path: polygon(
        50% 0%,
        66% 30%,
        98% 35%,
        74% 56%,
        79% 91%,
        51% 73%,
        21% 91%,
        27% 59%,
        2% 35%,
        36% 30%
      );
    }

    .shade {
      min-width: 12px;
      min-height: 12px;
      clip-path: polygon(
        50% 0%,
        66% 30%,
        98% 35%,
        74% 56%,
        79% 91%,
        51% 73%,
        21% 91%,
        27% 59%,
        2% 35%,
        36% 30%
      );
    }
  }

  &__price {
    font-size: 2.4rem;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    margin: 1rem 0;
  }

  &__quatity {
    display: flex;
    grid-column: 4;
    grid-row: 3 / 4;
    align-items: center;
    gap: 0.8rem;
    margin: 2rem 0;

    &__text {
      font-size: 1.4rem;
      font-family: 'Inter', sans-serif;
    }

    &__input {
      max-width: 7.7rem;
      height: 4.6rem;
      border-radius: 1rem;
      text-align: center;
      font-family: 'Inter', sans-serif;
      border: 1px solid;
      padding: 0 1.6rem;
      font-size: 1.6rem;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        appearance: none;
      }
    }
  }

  &__button {
    display: grid;
    row-gap: 0.8rem;

    &__add-to-cart {
      background-color: $blue;
      color: $white;
    }

    &__buy-now {
      background-color: transparent;
      color: $blue;
    }

    &__add-to-cart,
    &__buy-now {
      border: 1px solid;
      border-radius: 3rem;
      font-size: 1.6rem;
      padding: 1.3rem 2rem;
      text-transform: capitalize;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  &__ship-info,
  &__warranty {
    font-family: 'Inter', sans-serif;
    font-size: 1.4rem;

    &__title,
    &__warranty {
      margin-right: 3rem;
    }
  }

  &__reviews {
    display: grid;
    row-gap: 2rem;
    margin-top: 2rem;

    &__rating-text {
      font-size: 2rem;
      font-family: 'Inter', sans-serif;
    }

    &__icon {
      max-width: 2rem;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
    }

    &__name {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: 'Inter', sans-serif;
      font-size: 1.4rem;
      font-weight: 500;
    }

    &__date {
      font-size: 1.2rem;
      color: rgba(0, 0, 0, 0.7);
      font-family: 'Inter', sans-serif;
    }

    &__rating {
      display: flex;
      gap: 5px;

      .star {
        min-width: 15px;
        min-height: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $orange;
        clip-path: polygon(
          50% 0%,
          66% 30%,
          98% 35%,
          74% 56%,
          79% 91%,
          51% 73%,
          21% 91%,
          27% 59%,
          2% 35%,
          36% 30%
        );
      }

      .shade {
        min-width: 12px;
        min-height: 12px;
        clip-path: polygon(
          50% 0%,
          66% 30%,
          98% 35%,
          74% 56%,
          79% 91%,
          51% 73%,
          21% 91%,
          27% 59%,
          2% 35%,
          36% 30%
        );
      }
    }
    &__comment {
      font-size: 1.4rem;
      font-family: 'Inter', sans-serif;
    }
  }
}

@media (min-width: 768px) {
  .product {
    &__back-btn {
      display: none;
    }

    &__container {
      padding-top: 9rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 3.2rem;
    }

    &__item-image {
      min-width: 9.4rem;
    }

    &__img-container {
      width: 100%;
    }

    &__title {
      font-size: 2.2rem;
    }
    &__hr {
      display: none;
    }

    &__reviews {
      border-top: 1px solid;
      padding-top: 1rem;

      grid-row: 2;
      grid-column: 1/-1;
    }
  }
}

@media (min-width: 1024px) {
  .product {
    &__container {
      grid-template-columns: auto minmax(auto 590px);
    }

    &__left-content {
      display: flex;
      overflow: hidden;
    }
    &__img-list {
      flex-direction: column;
      justify-content: unset;
    }

    &__img-container {
      height: fit-content;
      max-height: 500px;
      max-width: 500px;
    }

    &__right-content {
      grid-column: 2;
    }
  }
}
</style>
