<template>
  <header>
    <nav
      :class="{
        'cart-page--active': $route.name === 'cart',
        'product-page--active': $route.name == 'product'
      }"
      class="nav"
    >
      <div class="nav__container">
        <div class="nav__logo-container">
          <RouterLink to="/">
            <img src="@/assets/images/logo.webp" alt="logo" class="nav__logo-img logo-img" />
          </RouterLink>
        </div>

        <button @click="openCategories" class="nav__categories categories nav__text">
          Categories
          <img
            src="@/assets/images/arrow_down.svg"
            class="nav__categories__arrow-down"
            alt="arrow down"
          />
        </button>
        <CategoriesList />

        <div class="nav__search-container search-container">
          <input
            type="text"
            @keyup.enter="search"
            v-model.trim="searchQuery"
            class="nav__search-input"
            placeholder="Search Product"
          />

          <button @click="search" class="nav__search-button">
            <img src="/src/assets/images/search-icon.svg" alt="search icon" />
          </button>
        </div>

        <div @click="cart" class="nav__cart-container cart-container">
          <img src="@/assets/images/cart.webp" alt="cart" class="nav__cart-img" />

          <p class="nav__cart-text nav__text">Cart</p>
          <span v-if="cartListCount > 0" class="nav__total-items">{{ cartListCount }}</span>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { useCartListCountStore } from '@/stores/cartListCount'
import { storeToRefs } from 'pinia'
import { isVisible } from '@/composables/Triggers'
import { defineAsyncComponent, watchEffect, ref, watch } from 'vue'
import { useAllProductsStore } from '@/stores/allProducts'

export default {
  components: {
    CategoriesList: defineAsyncComponent(() => import('@/components/CategoriesList.vue'))
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const cartStore = useCartListCountStore()
    const { cartListCount } = storeToRefs(cartStore)
    const productsStore = useAllProductsStore()
    const { fetchSearchResults } = productsStore
    const searchQuery = ref('')
    const { totalPages } = storeToRefs(productsStore)

    /**
     * Watches and reacts to changes in the `searchQuery` reactive property.
     * Every time `searchQuery.value` changes, this effect automatically
     * converts it to lowercase and updates `searchQuery.value` with the lowercase string.
     *
     * This ensures that the search query is always in lowercase, likely to facilitate
     * case-insensitive search operations.
     */
    watchEffect(() => {
      searchQuery.value = searchQuery.value.toLowerCase()
    })

    const cart = () => {
      router.push('/cart')
    }

    const openCategories = () => {
      isVisible.value = !isVisible.value
    }

    /**
     * Watches for changes in the route name and clears the `searchQuery`
     * if the user navigates to a route that is not 'search' or 'product'.
     *
     * - If the `route.name` is not 'search' or 'product', the `searchQuery`
     *   is reset to an empty string.
     *
     * @param {string} newRoute - The new route name after navigation.
     */
    watch(
      () => route.name,
      (newRoute) => {
        if (!['search', 'product'].includes(newRoute)) {
          searchQuery.value = ''
        }
      }
    )

    /**
     * Initiates a search operation and updates the route with the search query and page number.
     *
     * - Fetches search results based on the current `searchQuery.value`.
     * - Updates the URL with the search query and the page number, defaulting to the first page if there are multiple pages.
     *
     */
    const search = async () => {
      await fetchSearchResults(searchQuery.value)

      const query = { q: searchQuery.value }

      if (totalPages.value > 1) {
        query.page = 1
      }

      router.push({ name: 'search', query })
    }

    return {
      cart,
      cartListCount,
      openCategories,
      search,
      searchQuery,
      totalPages
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  min-width: 222px;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: $bg-white;
  z-index: 999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.09);

  &__container {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
  }

  &__logo-img {
    display: none;
  }

  &__categories {
    grid-column: 1;
    grid-row: 2;
    font-size: 1.4rem;
    height: fit-content;
    width: fit-content;
    padding: 0.5rem 2.7rem 0.5rem 1.2rem;
    border: none;
    border-radius: 2rem;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &__arrow-down {
      max-width: 2rem;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &__search-container {
    grid-row: 1;
    position: relative;
  }

  &__search-input {
    height: 4rem;
    width: 100%;
    border-radius: 2rem;
    padding: 1rem 1.5rem;
    font-size: 1.6rem;
    border: none;
    background-color: rgba(0, 0, 0, 0.09);

    &::placeholder {
      font-size: 1.4rem;
    }
  }

  &__search-button {
    all: unset;
    position: absolute;
    right: 6px;
    height: 2rem;
    width: 2rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__cart-container {
    grid-row: 1;
    grid-column: 2;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
  }

  &__cart-img {
    min-width: 2.7rem;
    min-height: 2.7rem;
    padding: 5px;
    border-radius: 40%;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &__cart-text {
    display: none;
  }

  &__total-items {
    position: absolute;
    width: 1.8rem;
    height: 1.8rem;
    right: -1px;
    top: 2px;
    background-color: $bg-orange-700;
    color: $clr-white;
    border-radius: 50%;
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.product-page--active {
  display: none;
}

@media (min-width: 480px) {
  .nav {
    &__container {
      grid-template-columns: auto 1fr auto;
      align-items: center;
    }

    &__logo-container {
      grid-column: 1;
      grid-row: 1;
    }

    &__logo-img {
      display: block;
      max-width: 9rem;
    }

    &__categories {
      grid-column: 1 / span 2;
      font-size: 1.5rem;
    }

    &__search-input {
      font-size: 1.7rem;

      &::placeholder {
        font-size: 1.5rem;
      }
    }

    &__cart-container {
      grid-column: 3;
      padding: 2px;
      border-radius: 50%;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    &__cart-img {
      min-width: 4rem;
      min-height: 4rem;
      pointer-events: none;
    }
  }
}

@media (min-width: 650px) {
  .nav {
    &__container {
      display: flex;
    }

    &__search-container {
      flex-grow: 2;
    }
  }
}

@media (min-width: 768px) {
  .nav {
    &__container {
      padding: 1.5rem 4rem;
    }

    &__categories {
      font-size: 1.6rem;
      background-color: transparent;
      gap: 2px;
      padding-right: 3.1rem;

      &__arrow-down {
        max-width: 2.4rem;
      }
    }

    &__search-input {
      font-size: 1.8rem;

      &::placeholder {
        font-size: 1.6rem;
      }
    }
  }

  .product-page--active {
    display: block;
  }
}

@media (min-width: 850px) {
  .nav {
    &__container {
      gap: 3rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    &__logo-img {
      min-width: 11rem;
    }

    &__categories {
      font-size: 2rem;
      padding: 1rem 3.7rem 1rem 2rem;
    }

    &__search-input {
      font-size: 2rem;
      padding: 2.5rem 2.5rem;

      &::placeholder {
        font-size: 1.8rem;
      }
    }

    &__search-button {
      right: 1.4rem;
      width: 2.6rem;
      top: 2.1rem;
    }

    &__cart-img {
      min-width: 4.5rem;
      min-height: 4.5rem;
    }

    &__total-items {
      font-size: 1.6rem;
      width: 2.2rem;
      height: 2.2rem;
    }
  }
}

.cart-page--active {
  .nav__container {
    display: flex;
  }

  .logo-img {
    display: block;
    max-width: 7rem;
  }

  .categories,
  .search-container,
  .cart-container {
    display: none;
  }
}
</style>
