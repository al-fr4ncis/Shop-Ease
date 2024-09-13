<template>
  <div v-if="$route.query.page == 1" class="home">
    <div class="home__container">
      <RouterLink to="/categories/furniture" class="home__live home__links">
        <div class="home__overlay"></div>
        <p class="home__live-title home__title">Live Comfortably</p>
        <img src="@/assets/images/live.jpg" class="home__live-img home__img" alt="live" />
      </RouterLink>
      <RouterLink to="/categories/skin-care" class="home__skincare home__links">
        <div class="home__overlay"></div>
        <p class="home__skincare-title home__title">Skincare</p>
        <img
          src="@/assets/images/skincare.jpg"
          class="home__skincare-img home__img"
          alt="skincare"
        />
      </RouterLink>

      <RouterLink to="/categories/kitchen-accessories" class="home__kitchen home__links">
        <div class="home__overlay"></div>
        <p class="home__kitchen-title home__title">Kitchen</p>
        <img src="@/assets/images/kitchen.jpg" class="home__kitchen-img home__img" alt="kitchen" />
      </RouterLink>
      <RouterLink to="/categories/mobile-accessories" class="home__electronics home__links">
        <div class="home__overlay"></div>
        <p class="home__electronics-title home__title">Electronics</p>
        <img
          src="@/assets/images/electronics.jpg"
          class="home__electronics-img home__img"
          alt="electronics"
        />
      </RouterLink>
    </div>
  </div>
  <ProductsView
    :class="{ 'home-page': $route.query.page == 1 }"
    :products="products"
    :imageLoaded="imageLoaded"
    :isLoading="isLoading"
    @loaded-img="loadedImg"
    @selected-product="selectedProduct"
  />
</template>

<script>
import { useAllProductsStore } from '@/stores/allProducts'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'
import { isImageLoaded } from '@/composables/isImageLoaded'

export default {
  components: {
    ProductsView: defineAsyncComponent(() => import('@/components/ProductsView.vue'))
  },
  setup() {
    const productsStore = useAllProductsStore()
    const { currentPage, totalPages, visiblePageIndices } = storeToRefs(productsStore)
    const { fetchProducts } = productsStore
    // Test
    const route = useRoute()
    const router = useRouter()
    const { products, isLoading } = storeToRefs(productsStore)
    const { imageLoaded, loadedImg } = isImageLoaded()
    const { pickedProduct } = productsStore

    onMounted(() => {
      /**
       * using Number.isNaN() instead of isNaN() when checking for NaN.
       * It’s more reliable because isNaN() can be misleading due to type coercion (e.g., isNaN("string") returns true)
       */
      fetchProducts(Number.isNaN(Number(currentPage.value)) ? 1 : currentPage.value)
    })

    /**
     * Watches the `page` query parameter from the route and redirects to the default page if it's missing.
     *
     * This watcher:
     * - Monitors the `route.query.page` to react to changes in the page query parameter.
     * - Redirects to the default page (page 1) if the `page` query parameter is not present (`null` or `undefined`).
     * - Runs immediately upon component creation to handle cases where the component is first created without the `page` query parameter.
     *
     * @param {Function} routeQueryPageGetter - A function that returns the current value of `route.query.page`.
     * @param {Function} newPageHandler - A function that handles the new value of the `page` query parameter.
     * @param {Object} options - Configuration object for the watcher.
     * @param {boolean} options.immediate - If true, the watcher will run immediately on initial setup.
     */
    watch(
      () => route.query.page,
      (newPage) => {
        if (newPage == null) {
          router.push({ path: '/', query: { page: 1 } })
        }
      },
      { immediate: true }
    )

    const selectedProduct = (index, id) => {
      pickedProduct(currentPage.value, index)
      router.push(`/product/${id}`)
    }

    return {
      visiblePageIndices,
      totalPages,
      selectedProduct,
      products,
      isLoading,
      imageLoaded,
      loadedImg
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  padding-top: 13rem;

  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1.3rem;
    max-width: 1220px;
    margin: 0 auto;
    padding: 0 2rem;
    max-height: 500px;
  }

  &__links {
    position: relative;
    min-height: 243px;
    min-width: 142px;
    object-fit: contain;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease-in;

    &:hover {
      background-color: rgba(0, 0, 0, 0.5) !important;
    }
  }

  &__title {
    position: absolute;
    font-family: 'Blinker', sans-serif;
    font-size: 2.5rem;
    bottom: 0;
    left: 1rem;
    color: $clr-white;
    font-weight: 600;

    @media (min-width: 400px) {
      font-size: 3rem;
    }

    @media (min-width: 450px) {
      font-size: 3.8rem;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (min-width: 450px) {
  .home {
    padding-top: 12rem;
  }
}

@media (min-width: 650px) {
  .home {
    padding-top: 8rem;
  }
}

@media (min-width: 750px) {
  .home {
    &__container {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 1fr 1fr;
    }

    &__links {
      &:nth-child(1) {
        grid-column: 1/3;
        grid-row: 1/3;
      }

      &:nth-child(2) {
        grid-row: 1/3;
      }
    }
  }
}

@media (min-width: 768px) {
  .home {
    padding-top: 9rem;
  }
}

@media (min-width: 850px) {
  .home {
    padding-top: 10rem;
  }
}

.home-page {
  padding-top: 3rem !important;
}
</style>
