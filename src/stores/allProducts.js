import { defineStore } from 'pinia'
import { computed, ref, watch, onMounted, reactive } from 'vue'
import { isImageLoaded } from '@/composables/isImageLoaded'
import { addItemToCard } from '@/composables/addToCart'

export const useAllProductsStore = defineStore('allproducts', () => {
  const isLoading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const perPage = ref(30)
  const hasSearchResults = ref(false)

  const totalIndexToShow = 3

  const { reset } = isImageLoaded()

  const products = ref([])
  const totalPagesArray = ref([])
  const visiblePageIndices = ref([])
  const selectedProduct = ref([])
  const searchInput = ref(null)

  // Caching logic
  const cache = ref({})
  const categorizedProducts = ref({})
  const cacheSearchResults = ref({})

  /**
   * Fetches products from an API, with caching mechanism to avoid refetching data for previously accessed pages.
   *
   * - If the products for the given page are cached, they are used directly.
   * - If the products for the given page are not cached, an API request is made to fetch the products.
   * - The fetched products and total pages are then stored in the cache for future use.
   *
   * @async
   * @param {number} [page=1] - The page number to fetch. Defaults to the first page.
   *
   * @throws Will throw an error if the API response is not `ok` or if the server is down.
   */
  const fetchProducts = async (page = 1) => {
    reset()
    isLoading.value = true

    // Check if the data for the current page is already cached
    if (cache.value[page]) {
      // Use cached data
      products.value = cache.value[page].products
      totalPages.value = cache.value[page].totalPages
      isLoading.value = false
    } else {
      try {
        // Fetch products from the API
        const res = await fetch(
          `https://dummyjson.com/products?limit=${perPage.value}&skip=${(page - 1) * perPage.value}`
        )

        if (!res.ok) {
          throw new Error('server down')
        }

        const data = await res.json()

        // Update products and totalPages based on fetched data
        products.value = data.products
        totalPages.value = Math.ceil(data.total / perPage.value)

        // Cache the data for future use
        cache.value[page] = {
          products: data.products,
          totalPages: totalPages.value
        }
      } catch (err) {
        // Handle any errors during the fetch operation
        error.value = err.message
      } finally {
        // Ensure loading state is disabled after the operation
        isLoading.value = false
      }
    }
  }

  /**
   * Watches for changes in the `totalPages` reactive property.
   *
   * When `totalPages` changes:
   * - Calls `updateTotalPagesArray(newtotalPages)` to update the array representing the total number of pages.
   * - Calls `updateVisiblePageIndices(currentPage.value)` to update the currently visible page indices for pagination display.
   *
   * This ensures that the pagination UI is updated correctly when the total number of pages changes.
   *
   * @param {number} newtotalPages - The new total number of pages after the change.
   */
  watch(totalPages, (newtotalPages) => {
    updateTotalPagesArray(newtotalPages)
    updateVisiblePageIndices(currentPage.value)
  })

  /**
   * Fetches a single product by its ID from the API and updates the `selectedProduct` reactive property.
   *
   * - Sets `isLoading.value` to `true` while the product is being fetched.
   * - If the fetch request is successful, it updates `selectedProduct.value` with the product data.
   * - If the fetch request fails (e.g., the product is not found), it throws an error with a '404' status.
   * - Once the fetch operation is complete (success or failure), `isLoading.value` is set to `false`.
   *
   * @async
   * @param {number} id - The ID of the product to fetch.
   *
   * @throws Will throw an error with '404' if the product is not found or if the response is not `ok`.
   */
  const fetchSingleProduct = async (id) => {
    isLoading.value = true

    try {
      // Fetch the product by ID
      const res = await fetch(`https://dummyjson.com/products/${id}`)

      if (!res.ok) {
        throw new Error('404') // Throw error if product is not found
      }

      // Update selectedProduct with the fetched product data
      selectedProduct.value = await res.json()
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches products from a specific category and caches the results to avoid refetching.
   *
   * - If the products for the specified category are already cached, it retrieves them from the `categorizedProducts` cache.
   * - If the products for the category are not cached, it fetches the data from the API and updates the cache.
   * - Updates `products.value` and `totalPages.value` based on the fetched data or cached results.
   *
   * @async
   * @param {string} category - The category name to fetch products from.
   *
   * @throws Will throw an error if the API response is not `ok` or if there is an issue with the request.
   */
  const fetchProductsByCategory = async (category) => {
    reset()
    isLoading.value = true

    // Check if products for the category are already cached
    if (categorizedProducts.value[category]) {
      products.value = categorizedProducts.value[category].products
      totalPages.value = categorizedProducts.value[category].totalPages
      isLoading.value = false
    } else {
      try {
        // Fetch products by category from the API
        const res = await fetch(`https://dummyjson.com/products/category/${category}`)

        if (!res.ok) {
          throw new Error('Error 500') // Throw error if the server response is not `ok`
        }

        const data = await res.json()

        // Update products and cache the results
        products.value = data.products
        categorizedProducts.value[category] = data.products
        totalPages.value = Math.ceil(data.total / perPage.value)

        // Cache the data for future use
        categorizedProducts.value[category] = {
          products: data.products,
          totalPages: totalPages.value
        }
      } catch (err) {
        error.value = err
      } finally {
        isLoading.value = false
      }
    }
  }

  /**
   * Sets the current page for pagination and fetches the corresponding data based on the page number.
   *
   * - Updates `currentPage.value` with the new page number if it is within the valid range (1 to `totalPages.value`).
   * - If `fromSearch` is `true`, it fetches search results for the given page.
   * - If `fromSearch` is `false`, it fetches products for the given page.
   *
   * @param {number} page - The page number to set. Must be between 1 to `totalPages.value`.
   * @param {boolean} [fromSearch=false] - Optional flag indicating whether to fetch search results (`true`) or products (`false`).
   */
  const setPage = (page, fromSearch = false) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page

      if (fromSearch) {
        fetchSearchResults(searchInput.value, page) // Fetch search results if fromSearch is true
      } else {
        fetchProducts(page) // Fetch products if fromSearch is false
      }
      updateVisiblePageIndices(page) // Update the pagination UI with the new page
    }
  }

  /**
   * Updates the visible page indices for pagination based on the current page number.
   *
   * - Adjusts the range of visible page indices to show a subset of pages around the current page.
   * - If the current page is less than or equal to 2, shows the first few pages up to `totalIndexToShow`.
   * - If the current page is near the end or in the middle, calculates a range of pages to display around the current page.
   *
   * @param {number} page - The current page number for which to update the visible page indices.
   *
   * @example
   *  If `page` is 3 and `totalPages` is 10:
   *  - `visiblePageIndices.value` will be set to pages 1 through 4.
   *
   *  If `page` is 8 and `totalPages` is 10:
   *  - `visiblePageIndices.value` will be set to pages 6 through 9.
   */
  const updateVisiblePageIndices = (page) => {
    if (page <= 2) {
      // Show the first few pages if current page is less than or equal to 2
      visiblePageIndices.value = totalPagesArray.value.slice(0, totalIndexToShow)
      return
    }

    const lastPageIndex = totalPages.value - 1
    const startIndex = page >= lastPageIndex ? lastPageIndex - 3 : page - 2
    const endIndex = page + 1

    // Update visible page indices to a range around the current page
    visiblePageIndices.value = totalPagesArray.value.slice(startIndex, endIndex)
  }

  /**
   * Updates the `totalPagesArray` reactive property with a new array of page numbers.
   *
   * - Creates an array of page numbers from 1 to `totalPages`.
   * - This array represents the total number of pages for pagination and is used to generate page indices.
   *
   * @param {number} totalPages - The total number of pages to generate. Must be a positive integer.
   *
   * @example
   * If `totalPages` is 5:
   * - `totalPagesArray.value` will be set to [1, 2, 3, 4, 5].
   */
  const updateTotalPagesArray = (totalPages) => {
    totalPagesArray.value = Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  /**
   * Updates the `selectedProduct` based on the provided parameters and context.
   *
   * @function
   * @param {number} page - The page number where the product is located.
   * @param {number} index - The index of the product within the specified page.
   * @param {boolean} [fromCategory=false] - Indicates if the product is selected from a category.
   * @param {boolean} [fromSearch=false] - Indicates if the product is selected from a search result.
   * @param {string} [categoryName] - The name of the category (used if `fromCategory` is `true`).
   * @param {string} [queryName] - The search query name (used if `fromSearch` is `true`).
   *
   * @returns {void}
   *
   */
  const pickedProduct = (
    page,
    index,
    fromCategory = false,
    fromSearch = false,
    categoryName,
    queryName
  ) => {
    if (fromCategory) {
      selectedProduct.value = categorizedProducts.value[categoryName].products[index]
    } else if (fromSearch) {
      selectedProduct.value = cacheSearchResults.value[queryName][page].products[index]
    } else {
      selectedProduct.value = cache.value[page].products[index]
    }
  }

  /**
   * Fetches search results from an API and updates the products and pagination information.
   *
   * @async
   * @function
   * @param {string} searchQuery - The search query to be used for fetching products.
   * @param {number} [page=1] - The page number to fetch results from. Defaults to 1.
   *
   * @returns {Promise<void>} A promise that resolves when the data has been fetched and the state updated.
   *
   */
  const fetchSearchResults = async (searchQuery, page = 1) => {
    searchInput.value = searchQuery
    reset()
    isLoading.value = true

    if (cacheSearchResults.value[searchQuery]?.[page]) {
      // Use cached data if available
      products.value = cacheSearchResults.value[searchQuery][page].products
      totalPages.value = cacheSearchResults.value[searchQuery][page].totalPages
      isLoading.value = false
    } else {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${searchQuery}&limit=${perPage.value}&skip=${(page - 1) * perPage.value}`
        )

        if (!res.ok) {
          throw new Error(res.status)
        }

        const data = await res.json()

        /**
         *
         * Updates the total number of search results.
         * If `data.total` is greater than 0, it sets `totalSearchedData` to `data.total`.
         * Otherwise, it sets `totalSearchedData` to 0.
         *
         */
        hasSearchResults.value = data.total > 0 ? true : false

        // Update state with fetched data
        products.value = data.products
        totalPages.value = Math.ceil(data.total / perPage.value)

        /**
         * Caches the search results for a given search query and page.
         *
         * This block checks if the cache already contains data for the provided `searchQuery`.
         * If the query does not exist in the cache, it initializes an empty object for that query.
         * Afterward, it stores the search results for the specified page, which includes the products
         * and the total number of pages, in the cache.
         *
         */
        if (!cacheSearchResults.value[searchQuery]) {
          cacheSearchResults.value[searchQuery] = {}
        }
        cacheSearchResults.value[searchQuery][page] = {
          products: data.products,
          totalPages: totalPages.value
        }
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }
  }

  return {
    cache,
    products,
    isLoading,
    error,
    currentPage,
    fetchProducts,
    setPage,
    totalPages,
    totalPagesArray,
    visiblePageIndices,
    pickedProduct,
    selectedProduct,
    fetchSingleProduct,
    fetchProductsByCategory,
    categorizedProducts,
    fetchSearchResults,
    hasSearchResults
  }
})
