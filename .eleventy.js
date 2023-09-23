module.exports = (eleventyConfig) => {
  const config = {
    dir: {
      data: '_data',
      includes: '_includes',
      input: 'views',
      layouts: '_layouts',
      output: '_site'
    },
    pathPrefix: '/',
    quietMode: false
  };

  eleventyConfig.setQuietMode(config.quietMode);

  return config;
};
