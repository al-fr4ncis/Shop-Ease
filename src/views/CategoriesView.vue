<template>
  <ProductsView
    :products="products"
    :imageLoaded="imageLoaded"
    :isLoading="isLoading"
    @loaded-img="loadedImg"
    @selected-product="selectedProduct"
  />
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
import { useAllProductsStore } from '@/stores/allProducts'
import { storeToRefs } from 'pinia'
import { isImageLoaded } from '@/composables/isImageLoaded'

export default {
  components: {
    ProductsView: defineAsyncComponent(() => import('@/components/ProductsView.vue'))
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productsStore = useAllProductsStore()
    const { fetchProductsByCategory } = productsStore
    const { products, isLoading } = storeToRefs(productsStore)
    const { imageLoaded, loadedImg } = isImageLoaded()
    const { pickedProduct } = productsStore
    const currentPage = ref(1)

    watch(
      () => route.params.category,
      (newParam) => {
        fetchProductsByCategory(newParam)
      }
    )

    onMounted(() => {
      fetchProductsByCategory(route.params.category)
    })

    const selectedProduct = (index, id) => {
      pickedProduct(currentPage.value, index, true, false, route.params.category, null)
      router.push(`/product/${id}`)
    }

    return {
      products,
      imageLoaded,
      isLoading,
      loadedImg,
      selectedProduct
    }
  }
}
</script>
