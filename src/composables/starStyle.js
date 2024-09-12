/**
 * Calculates the background style for the star.
 *
 * @param {number} index - The index of the current star (1-based).
 * @param {number} rating - The overall rating value (e.g., 3.8).
 * @returns {object} - An object containing the CSS background property for the star.
 *
 * The function determines:
 * - Fully filled stars for indexes less than or equal to the integer part of the rating.
 * - A partially filled star for the index corresponding to the next whole number after the rating (if fractional).
 * - Empty stars for indexes greater than the next whole number.
 * 
 * @example
  <ol v-for="index in 5" :key="index" class="star" role="list">
    <span :style="starStyle(index, product.rating)" class="shade"></span>
  </ol>
 */
const starStyle = (index, rating) => {
  const filledStars = Math.floor(rating) // Number of fully filled stars
  const nextStarIndex = Math.ceil(rating) // Index for the next star that might be partially filled
  const fillPercentage = (rating % 1) * 100 // Percentage fill for the last star

  return {
    background:
      index <= filledStars
        ? `#df7920` // Fully filled star
        : index == nextStarIndex
          ? `linear-gradient(to right, #df7920 ${fillPercentage}%, white ${fillPercentage}%)` // Partially filled star
          : `white` // Empty star
  }
}

export { starStyle }
