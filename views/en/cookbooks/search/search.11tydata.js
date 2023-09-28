module.exports = {
  eleventyComputed: {
    title: data => `Searching with SuiteScript - ${data.chapterTitle}`,
    // eleventyNavigation: {
    //   title: data => data.eleventyNavigation.title ?? data.chapterTitle
    // }
  }
};
