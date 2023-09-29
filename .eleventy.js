const { EleventyI18nPlugin } = require('@11ty/eleventy')
const eleventyNavigation = require('@11ty/eleventy-navigation');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { randomPick } = require('./src/filters/randomPick');
const sorts = require('./src/sorts');

module.exports = (eleventyConfig) => {
  const config = {
    dir: {
      data: '_data',
      includes: '_includes',
      input: 'views',
      layouts: '_layouts',
      output: '_site'
    },
    markdownTemplateEngine: 'njk',
    pathPrefix: '/',
    quietMode: true
  };

  eleventyConfig.setQuietMode(config.quietMode);

  eleventyConfig.addPassthroughCopy('assets');

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: 'en',
  });
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigation);

  eleventyConfig.addFilter('randomPick', randomPick);

  eleventyConfig.addCollection('navmain', function(collectionApi) {
    return collectionApi.getFilteredByTag('nav-main').sort(sorts.byNavOrder);
  });

  return config;
};
