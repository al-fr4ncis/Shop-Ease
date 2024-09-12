<template>
  <Section class="products">
    <div class="products__container">
      <div v-if="isLoading" class="products__isloading">
        <img src="@/assets/images/loading.gif" alt="loading gif" />
      </div>

      <ul v-else class="products__list" role="list">
        <li
          @click="$emit('selected-product', index, product.id)"
          v-for="(product, index) in products"
          :key="index"
          class="products__item"
        >
          <div class="products__card card">
            <div class="card__container">
              <div class="card__img-container">
                <span v-if="!imageLoaded[index]" class="card__img-isloading"></span>
                <img
                  :src="product.thumbnail"
                  @load="$emit('loaded-img', index)"
                  :class="{ loading: !imageLoaded[index] }"
                  class="card__img"
                  alt="thumbnail"
                />
              </div>
              <div class="card__description">
                <h3 class="card__title">{{ product.title }}</h3>
                <p class="card__price">
                  <span class="card__item-price">${{ product.price }}</span>
                  <span class="card__discount">-{{ product.discountPercentage }}%</span>
                </p>
                <p class="card__stocks">
                  <span v-if="product.stock == 0"> Sold Out</span>
                  <span v-else>Only {{ product.stock }} left</span>
                </p>
                <div class="card__ratings">
                  <ol v-for="index in 5" :key="index" class="star" role="list">
                    <span :style="starStyle(index, product.rating)" class="shade"></span>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </Section>
</template>

<script>
import { starStyle } from '@/composables/starStyle'

export default {
  props: {
    imageLoaded: { type: Object, required: true },
    products: { type: Object, required: true },
    isLoading: { type: Boolean, required: true }
  },
  setup() {
    return {
      starStyle
    }
  }
}
</script>

<style lang="scss" scoped>
$orange: #df7920;
$bg-orange: $orange;

.products {
  padding: 0 0.5rem;
  padding-top: 13rem;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__isloading {
    height: calc(100dvh - 13rem);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  &__item {
    padding: 3px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 0.5rem;
    overflow: hidden;
    max-width: 260px;
    cursor: pointer;
    transition: all 0.15s ease-in;

    &:hover {
      border: 2px solid rgba(0, 0, 0, 0.7);
    }
  }

  .card {
    &__img-container {
      position: relative;
      aspect-ratio: 1/1;
    }

    &__img-isloading {
      position: absolute;
      inset: 0;
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
      border-radius: 0.5rem;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .loading {
      display: none;
    }

    &__title {
      font-size: 1.6rem;
      font-family: 'Blinker', sans-serif;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: unset;
    }

    &__price {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    &__item-price {
      font-family: 'Blinker', sans-serif;
      font-size: 2rem;
    }

    &__discount {
      font-size: 1.2rem;
      font-family: 'Blinker', sans-serif;
      padding: 0 3px;
    }

    &__cart-button {
      display: none;
    }

    &__stocks {
      font-size: 1.2rem;
      font-family: 'Blinker', sans-serif;
    }

    &__ratings {
      display: flex;
      gap: 5px;

      .star {
        min-width: 14px;
        min-height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $bg-orange;
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
        min-width: 10px;
        min-height: 10px;
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
  }
}

@media (min-width: 400px) {
  .products {
    .card {
      &__stocks {
        font-size: 1.4rem;
      }

      .star {
        min-width: 18px;
        min-height: 18px;
      }

      .shade {
        min-width: 13px;
        min-height: 13px;
      }
    }
  }
}

@media (min-width: 450px) {
  .products {
    padding: 12rem 1rem 0 1rem;

    &__isloading {
      height: calc(100dvh - 12rem);
    }

    &__list {
      gap: 1rem;
    }

    &__item {
      padding: 0.5rem;
    }
  }
}

@media (min-width: 480px) {
  .products {
    padding-left: 0.5rem;
    padding-right: 0.5rem;

    &__list {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.5rem;
    }

    &__item {
      width: 100%;
    }
  }
}

@media (min-width: 490px) {
  .products {
    .card {
      &__title {
        font-size: 1.7rem;
      }

      &__item-price {
        font-size: 2.2rem;
      }

      &__discount {
        font-size: 1.3rem;
      }

      &__stocks {
        font-size: 1.5rem;
      }
    }
  }
}

@media (min-width: 560px) {
  .products {
    padding-left: 1rem;
    padding-right: 1rem;

    &__list {
      row-gap: 1rem;
    }
  }
}

@media (min-width: 650px) {
  .products {
    padding-top: 8rem;

    &__isloading {
      height: calc(100dvh - 8rem);
    }

    &__list {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

@media (min-width: 768px) {
  .products {
    padding-top: 9rem;

    &__isloading {
      height: calc(100dvh - 9rem);
    }

    .card {
      &__title {
        font-size: 1.8rem;
      }

      &__item-price {
        font-size: 2.4rem;
      }

      &__discount {
        font-size: 1.4rem;
      }

      &__stocks {
        font-size: 1.6rem;
      }
    }
  }
}

@media (min-width: 810px) {
  .products {
    &__list {
      grid-template-columns: repeat(5, 1fr);
    }
  }
}

@media (min-width: 850px) {
  .products {
    padding-top: 10rem;

    &__isloading {
      height: calc(100dvh - 10rem);
    }
  }
}

@media (min-width: 1024px) {
  .products {
    .card {
      &__title {
        font-size: 2rem;
      }

      &__item-price {
        font-size: 2.8rem;
      }

      &__discount {
        font-size: 1.6rem;
      }

      &__stocks {
        font-size: 1.8rem;
      }

      .star {
        min-width: 20px;
        min-height: 20px;
      }

      .shade {
        min-width: 15px;
        min-height: 15px;
      }
    }
  }
}
</style>
