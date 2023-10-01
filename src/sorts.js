module.exports = {
  byNavOrder: (a, b) => {
    const orderA = a?.data?.eleventyNavigation?.order ?? 0;
    const orderB = b?.data?.eleventyNavigation?.order ?? 0;
    return orderA - orderB;
  },
  byChapterSequence: (a, b) => {
    const seqA = a?.data?.chapterSequence ?? 0;
    const seqB = b?.data?.chapterSequence ?? 0;
    return seqA - seqB;
  }
}
