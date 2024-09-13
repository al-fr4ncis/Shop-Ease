<template>
  <Footer class="footer">
    <div class="footer__container">
      <a href="#" class="footer__text">About</a>
      <a href="#" class="footer__text">Store locator</a>
      <a href="#" class="footer__text">FAQs</a>
      <a href="#" class="footer__text">News</a>
      <a href="#" class="footer__text">Careers</a>
      <a href="#" class="footer__text">Contact Us</a>
    </div>
  </Footer>
</template>

<style lang="scss" scoped>
.footer {
  height: 17rem;
  display: grid;
  align-content: center;
  background-color: $bg-black;
  margin-top: 3rem;

  &__container {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    height: 100%;
  }

  &__text {
    text-decoration: none;
    color: $clr-white;
    font-weight: 700;
    font-size: 1.8rem;
    font-family: 'Inter', sans-serif;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
