const { EleventyI18nPlugin } = require("@11ty/eleventy")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const randomIndex = list => {
  if (!Array.isArray(list)) {
    throw new TypeError('randomIndex: list is not an Array');
  }
  return Math.floor(Math.random() * list.length);
}

const randomKey = obj => {
  if (typeof obj !== 'object') {
    throw new TypeError('randomKey: obj is not an Object');
  }
  const keys = Object.keys(obj);
  return keys[randomIndex(keys)];
}

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
    quietMode: true
  };

  eleventyConfig.setQuietMode(config.quietMode);

  eleventyConfig.addPassthroughCopy('assets');

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: 'en',
  });
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter('randomPick', collection => {
    if (Array.isArray(collection)) {
      return collection[randomIndex(collection)];
    }

    if (typeof collection === 'object') {
      return collection[randomKey(collection)];
    }

    throw new TypeError('randomPick: collection is neither Array nor Object');
  });

  return config;
};
