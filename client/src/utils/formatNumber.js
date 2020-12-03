export const formatNumber = number => {
  if (parseFloat(number) == parseInt(number)) {
    return Number(number).toLocaleString()
  } else {
    return Number(number).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
  }
}

