const { EleventyI18nPlugin } = require("@11ty/eleventy")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

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

  eleventyConfig.addPassthroughCopy('assets');

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "en",
  });
  eleventyConfig.addPlugin(syntaxHighlight);

  return config;
};
