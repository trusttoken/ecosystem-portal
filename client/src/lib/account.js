function shortenAddress(address, numCharsBeforeEllipsis, numCharsAfterEllipsis) {
  return `${address.substring(0, numCharsBeforeEllipsis)} ... ${address.substring(address.length - numCharsAfterEllipsis)}`;
}

export {
  shortenAddress
};
