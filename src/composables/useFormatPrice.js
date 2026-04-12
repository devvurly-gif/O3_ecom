export function useFormatPrice() {
  function formatPrice(price) {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    }).format(price ?? 0)
  }

  return { formatPrice }
}
