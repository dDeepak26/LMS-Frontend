const getDiscountedPrice = (price: number, discount: number): number => {
  if (price <= 0) {
    return 0;
  }
  if (discount === 0) {
    return price;
  }

  const discountedPrice: number = price - price * (discount / 100);

  return discountedPrice;
};

export default getDiscountedPrice;
