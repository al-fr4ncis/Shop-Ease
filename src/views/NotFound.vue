<template>
  <Section class="not-found">
    <svg fill="none" width="120" height="120">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M83.5 110.07a18.5 18.5 0 1 0 0-37 18.5 18.5 0 0 0 0 37Z"
        fill="#E8E8E8"
      ></path>
      <path
        clip-rule="evenodd"
        d="M10 77.07a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="#E8E8E8"
        stroke-width="2"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M111.46 43.54a1 1 0 0 0 0 1.41l2.13 2.12-2.13 2.12a1 1 0 0 0 1.42 1.42l2.12-2.12 2.12 2.12a1 1 0 0 0 1.42-1.42l-2.13-2.12 2.13-2.12a1 1 0 0 0-1.42-1.41L115 45.66l-2.12-2.12a1 1 0 0 0-1.42 0ZM19.46 18.54a1 1 0 0 0 0 1.41l2.13 2.12-2.13 2.12a1 1 0 0 0 1.42 1.42L23 23.49l2.12 2.12a1 1 0 0 0 1.42-1.42l-2.13-2.12 2.13-2.12a1 1 0 0 0-1.42-1.41L23 20.66l-2.12-2.12a1 1 0 0 0-1.42 0Z"
        fill="#E8E8E8"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M51 39.07v-18a1 1 0 0 1 1-1h38a3 3 0 0 1 3 3V67.58c-.64-.47-1.31-.9-2-1.3v-43.2a1 1 0 0 0-1-1H53v17a5 5 0 0 1-5 5H30v56a1 1 0 0 0 1 1h28.5c.5.69 1.04 1.35 1.61 2H31a3 3 0 0 1-3-3v-57a1 1 0 0 1 1-1h19a3 3 0 0 0 3-3Z"
        fill="#BDBDBD"
      ></path>
      <path d="m52 21.07-23 22" stroke="#BDBDBD" stroke-width="2"></path>
      <rect x="39" y="57.07" width="42" height="2" rx="1" fill="#BDBDBD"></rect>
      <rect x="39" y="65.07" width="22" height="2" rx="1" fill="#BDBDBD"></rect>
      <rect x="39" y="73.07" width="15" height="2" rx="1" fill="#BDBDBD"></rect>
      <path
        clip-rule="evenodd"
        d="M91.51 100.5a18 18 0 1 0-24.55-26.34 18 18 0 0 0 24.55 26.33Z"
        stroke="#BDBDBD"
        stroke-width="2"
      ></path>
      <rect
        x="70.51"
        y="80"
        width="2"
        height="22"
        rx="1"
        transform="rotate(-45 70.51 80)"
        fill="#BDBDBD"
      ></rect>
      <rect
        x="86.07"
        y="78.59"
        width="2"
        height="22"
        rx="1"
        transform="rotate(45 86.07 78.59)"
        fill="#BDBDBD"
      ></rect>
    </svg>

    <h1 class="not-found__title">Page Unavailable</h1>
    <p class="not-found__description">
      Sorry, something went wrong. Please go back and try again, or you can go back to Home Page.
    </p>
    <RouterLink to="/" class="not-found__home-btn">Back to Home Page</RouterLink>
  </Section>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
$orange: #ee6e12;

.not-found {
  position: relative;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__image {
    max-width: 140px;
  }

  &__title,
  &__description {
    font-size: 1.6rem;
    text-align: center;
    font-family: 'Inter', sans-serif;
  }

  &__description {
    font-size: 1.4rem;
  }

  &__home-btn {
    margin-top: 1rem;
    font-size: 1.6rem;
    border-radius: 0.5rem;
    white-space: nowrap;
    padding: 1rem 2rem;
    text-decoration: none;
    color: white;
    text-align: center;
    font-family: 'Inter', sans-serif;
    background-color: $orange;
  }
}
</style>
