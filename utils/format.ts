export const formatAmountCurrency = (amount: any) => {
  const IDR = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return IDR.format(amount);
};
