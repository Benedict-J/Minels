export const formatAmountCurrency = (amount) => {
  const IDR = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return IDR.format(amount);
};
