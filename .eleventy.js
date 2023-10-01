const { EleventyI18nPlugin } = require('@11ty/eleventy')
const eleventyNavigation = require('@11ty/eleventy-navigation');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const toc = require('eleventy-plugin-toc')
const { randomPick } = require('./src/filters/randomPick');
const sorts = require('./src/sorts');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

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
  eleventyConfig.addPlugin(toc);

  eleventyConfig.setLibrary('md', markdownIt({ html: true }).use(markdownItAnchor));

  eleventyConfig.addFilter('randomPick', randomPick);

  eleventyConfig.addCollection('navmain', (collectionApi) =>
    collectionApi.getFilteredByTag('nav-main').sort(sorts.byNavOrder));
  eleventyConfig.addCollection('cookbook-search-sequence', (collectionApi) =>
    collectionApi.getFilteredByTag('cookbook-search').sort(sorts.byChapterSequence));

  return config;
};
