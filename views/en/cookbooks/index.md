---
layout: 'page'
title: 'SuiteScript Cookbooks'
eleventyNavigation:
  key: 'cookbooks'
  title: 'Cookbooks'
eleventyImport:
  collections: ['cookbooks']
---

# SuiteScript Cookbooks

Practical examples of common SuiteScript tasks

{{ collections.cookbooks | eleventyNavigation("cookbooks") | eleventyNavigationToMarkdown | safe }}
