---
layout: 'page'
title: 'SuiteScript Cookbooks'
tags: ['nav-main']
eleventyNavigation:
  key: 'cookbooks'
  title: 'Cookbooks'
  order: 1
eleventyImport:
  collections: ['cookbooks']
---

# SuiteScript Cookbooks

Practical examples of common SuiteScript tasks

{{ collections.cookbooks | eleventyNavigation("cookbooks") | eleventyNavigationToMarkdown | safe }}
