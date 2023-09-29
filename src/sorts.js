module.exports = {
  byNavOrder: (a, b) => {
    const orderA = a?.data?.eleventyNavigation?.order ?? 0;
    const orderB = b?.data?.eleventyNavigation?.order ?? 0;
    return orderA - orderB;
  }
}
