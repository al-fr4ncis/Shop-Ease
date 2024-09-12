<template>
  <div v-if="isLoading" class="isloading">
    <img src="@/assets/images/loading.gif" alt="loading gif" />
  </div>
  <div v-else-if="!hasSearchResults" class="no-results">
    <img src="@/assets/images/noResults.webp" class="no-results__image" alt="No Results" />
    <h1 class="no-results__title">No results found</h1>
    <p class="no-results__description">Try different or more general keywords</p>
  </div>
  <ProductsView
    v-else
    :products="products"
    :imageLoaded="imageLoaded"
    :isLoading="isLoading"
    @loaded-img="loadedImg"
    @selected-product="selectedProduct"
  />
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch, defineAsyncComponent } from 'vue'
import { useAllProductsStore } from '@/stores/allProducts'
import { storeToRefs } from 'pinia'
import { isImageLoaded } from '@/composables/isImageLoaded'

export default {
  components: {
    ProductsView: defineAsyncComponent(() => import('@/components/ProductsView.vue'))
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const productsStore = useAllProductsStore()
    const { fetchSearchResults } = productsStore
    const { products, isLoading, currentPage, error, hasSearchResults } = storeToRefs(productsStore)
    const { imageLoaded, loadedImg } = isImageLoaded()
    const { pickedProduct } = productsStore

    watch(
      () => route.query.q,
      (newQuery) => {
        fetchSearchResults(newQuery)
      }
    )

    onMounted(() => {
      const page = parseInt(route.query.page, 10) || 1
      fetchSearchResults(route.query.q, page)
    })

    const selectedProduct = (index, id) => {
      const page = Number.isNaN(Number(currentPage.value)) ? 1 : currentPage.value
      pickedProduct(page, index, false, true, null, route.query.q)
      router.push(`/product/${id}`)
    }

    return {
      products,
      isLoading,
      imageLoaded,
      loadedImg,
      selectedProduct,
      error,
      hasSearchResults
    }
  }
}
</script>

<style lang="scss" scoped>
.isloading {
  height: calc(100dvh - 13rem);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 450px) {
    height: calc(100dvh - 32rem);
  }

  @media (min-width: 650px) {
    height: calc(100dvh - 28rem);
  }

  @media (min-width: 768px) {
    height: calc(100dvh - 29rem);
  }

  @media (min-width: 850px) {
    height: calc(100dvh - 30rem);
  }
}

.no-results {
  position: relative;
  height: calc(100dvh - 20rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  &__image {
    max-width: 140px;
  }

  &__title,
  &__description {
    text-align: center;
    font-family: 'Inter', sans-serif;
  }
}
</style>
