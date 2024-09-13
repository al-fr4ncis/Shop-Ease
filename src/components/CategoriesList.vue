<template>
  <Section v-if="isVisible" @click="toggleVisible" class="categories">
    <h2 v-if="isLoading">LOADING</h2>
    <div class="categories__container container">
      <ul class="categories__list" role="list">
        <li
          @click="category(name)"
          v-for="(name, index) in results"
          :key="index"
          class="categories__item"
        >
          <img :src="images[index]" class="categories__image" :alt="name" />
          <p class="categories__name">{{ name }}</p>
        </li>
      </ul>
    </div>
  </Section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toggleisVisible, isVisible } from '@/composables/Triggers'

export default {
  setup() {
    const router = useRouter()
    const error = ref(null)
    const isLoading = ref(false)
    const results = ref(null)
    const images = [
      new URL('@/assets/images/CategoryList/beauty.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/fragrances.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/furniture.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/groceries.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/home-decoration.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/kitchen-accessories.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/laptops.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/mens-shirts.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/mens-shoes.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/mens-watches.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/mobile-accessories.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/motorcycle.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/skin-care.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/smartphone.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/sports-accessories.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/sunglasses.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/tablets.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/tops.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/vehicle.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/womens-bags.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/womens-dresses.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/womens-jewellery.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/womens-shoes.webp', import.meta.url).href,
      new URL('@/assets/images/CategoryList/womens-watches.webp', import.meta.url).href
    ]

    const categories = async () => {
      isLoading.value = true

      try {
        const res = await fetch('https://dummyjson.com/products/category-list')

        if (!res.ok) {
          throw new Error('server error')
        }
        const data = await res.json()
        results.value = data
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      categories()
      isVisible.value = false
    })

    const category = (name) => {
      router.push(`/categories/${name}`)
      toggleisVisible()
    }

    const toggleVisible = (e) => {
      const className = e.target.className

      if (className == 'categories') {
        toggleisVisible()
      }
    }

    return {
      isLoading,
      results,
      category,
      isVisible,
      toggleVisible,
      images
    }
  }
}
</script>

<style lang="scss" scoped>
.categories {
  position: fixed;
  z-index: 999;
  inset: 0 0 0 0;
  padding: 1rem 0;
  background-color: rgba(0, 0, 0, 0.4);

  &__container {
    padding: 1.5rem;
    position: absolute;
    top: 11rem;
    left: 50%;
    border: 1px solid rgba(0, 0, 0, 0.5);
    transform: translate(-50%);
    background-color: $bg-white;
    height: 50dvh;
    width: 80dvw;
    max-width: 750px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    gap: 2rem;
    justify-content: center;
  }

  &__item {
    max-width: 8rem;
    cursor: pointer;
    display: grid;
    justify-items: center;
    align-items: center;
  }

  &__image {
    max-width: 8rem;
    max-height: 8rem;
    min-width: 8rem;
    min-height: 8rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: contain;
    border-radius: 50%;
  }

  &__name {
    text-align: center;
    font-size: 1.3rem;
    font-family: 'Inter', sans-serif;
    text-transform: capitalize;
  }
}

@media (min-width: 480px) {
  .categories {
    &__container {
      top: 11.5rem;
    }
  }
}

@media (min-width: 650px) {
  .categories {
    &__container {
      top: 7.5rem;
    }
  }
}

@media (min-width: 850px) {
  .categories {
    &__container {
      top: 9rem;
    }
  }
}
</style>
