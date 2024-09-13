<template>
  <ol v-if="totalPages > 1 && $route.name != 'cart'" class="pagination">
    <li class="pagination__button">
      <button @click="prev" v-if="currentPage > 1" class="pagination__prev pagination__button">
        <img src="@/assets/images/arrow-back.svg" class="pagination__prev-img" alt="arrow back" />
      </button>
    </li>

    <li
      v-for="page in visiblePageIndices"
      :key="page"
      @click="moveToPage(page)"
      :class="{ active: currentPage == page }"
      class="pagination__link"
    >
      <p class="pagination__index">{{ page }}</p>
    </li>

    <li class="pagination__text">
      <p v-if="totalPages > 5 && currentPage <= totalPages - 3" class="more-pages">...</p>
    </li>
    <li class="pagination__link">
      <p
        @click="moveToPage(totalPages)"
        v-if="currentPage < totalPages - 2"
        class="last-index pagination__index"
      >
        {{ totalPages }}
      </p>
    </li>
    <li class="pagination__button">
      <button
        @click="next"
        v-if="currentPage < totalPages"
        class="pagination__next pagination__button"
      >
        <img
          src="/src/assets/images/arrow-forward.svg"
          class="pagination__next-img"
          alt="arrow forwar"
        />
      </button>
    </li>
  </ol>
</template>

<script>
import { useAllProductsStore } from '@/stores/allProducts'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { watch, ref } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productsStore = useAllProductsStore()
    const { currentPage, totalPages, visiblePageIndices } = storeToRefs(productsStore)
    const { setPage } = productsStore
    const componentRoute = ref(false)

    watch(
      () => route.name,
      (newRoute) => {
        if (newRoute == 'search') {
          componentRoute.value = true
        } else {
          componentRoute.value = false
        }
      }
    )

    watch(
      () => route.query.page,
      (newPage) => {
        /*
         * Converts the `newPage` string to an integer using base 10 (decimal).
         * Base 10 ensures that the number is interpreted as a standard decimal (0-9)
         * rather than another numeral system (e.g., binary or hexadecimal).
         */
        const index = parseInt(newPage, 10)

        // Update current page and call setPage if the page has changed
        if (currentPage.value !== index) {
          currentPage.value = index
          setPage(index, componentRoute.value)
        }
      }
    )

    const next = () => {
      setPage(currentPage.value + 1, componentRoute.value)

      /**
       * Redirects the user based on the `componentRoute.value`.
       *
       * - If `componentRoute.value` is falsy (null, undefined, or false), the user is redirected
       *   to the home route ('/') with the `page` query parameter set to the current page `index`.
       *
       * - If `componentRoute.value` is truthy, the user is redirected to the '/search' route,
       *   preserving the existing search query (`q`) from `route.query.q`, and updating the `page` query parameter.
       *
       * @example
       * If no componentRoute is defined:
       * Redirects to '/?page=index'
       *
       * If componentRoute exists:
       * Redirects to '/search?q=searchQuery&page=index'
       */
      if (!componentRoute.value) {
        router.push({ path: '/', query: { page: currentPage.value } })
      } else {
        router.push({
          path: '/search',
          query: { q: route.query.q, page: currentPage.value }
        })
      }
    }

    const prev = () => {
      setPage(currentPage.value - 1, componentRoute.value)

      /**
       * Redirects the user based on the `componentRoute.value`.
       *
       * - If `componentRoute.value` is falsy (null, undefined, or false), the user is redirected
       *   to the home route ('/') with the `page` query parameter set to the current page `index`.
       *
       * - If `componentRoute.value` is truthy, the user is redirected to the '/search' route,
       *   preserving the existing search query (`q`) from `route.query.q`, and updating the `page` query parameter.
       *
       * @example
       * If no componentRoute is defined:
       * Redirects to '/?page=index'
       *
       * If componentRoute exists:
       * Redirects to '/search?q=searchQuery&page=index'
       */
      if (!componentRoute.value) {
        router.push({ path: '/', query: { page: currentPage.value } })
      } else {
        router.push({
          path: '/search',
          query: { q: route.query.q, page: currentPage.value }
        })
      }
    }

    const moveToPage = (index) => {
      /**
       * Redirects the user based on the `componentRoute.value`.
       *
       * - If `componentRoute.value` is falsy (null, undefined, or false), the user is redirected
       *   to the home route ('/') with the `page` query parameter set to the current page `index`.
       *
       * - If `componentRoute.value` is truthy, the user is redirected to the '/search' route,
       *   preserving the existing search query (`q`) from `route.query.q`, and updating the `page` query parameter.
       *
       * @example
       * If no componentRoute is defined:
       * Redirects to '/?page=index'
       *
       * If componentRoute exists:
       * Redirects to '/search?q=searchQuery&page=index'
       */
      if (!componentRoute.value) {
        router.push({ path: '/', query: { page: index } })
      } else {
        router.push({
          path: '/search',
          query: { q: route.query.q, page: index }
        })
      }
      setPage(index, componentRoute.value)
    }

    return {
      prev,
      currentPage,
      moveToPage,
      next,
      totalPages,
      visiblePageIndices
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  gap: 4rem;
  font-size: 1.6rem;
  list-style: none;
  height: 4rem;
  align-items: center;

  &__button {
    min-width: 4rem;
    min-height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.04);

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &__link,
  .last-index {
    width: 3rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid transparent;

    &:hover {
      color: $blue;
      border-color: $border-blue;
    }
  }

  .active {
    border-bottom: 2px solid;
  }

  &__index {
    font-size: 2rem;
    font-family: 'Inter', sans-serif;
  }
}
</style>
