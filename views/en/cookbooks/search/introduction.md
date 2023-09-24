---
title: 'Introduction'
templateEngineOverride: njk,md
---

{% set previousPost = collections.search | getPreviousCollectionItem %}
{% set nextPost = collections.search | getNextCollectionItem %}

# Searching in SuiteScript 2.1

Last Updated: {{ page.date.toLocaleDateString() }} 

This SuiteScript cookbook is intended to provide you with simple, practical examples of building searches with the 
SuiteScript API.

In *Searching in SuiteScript*, you'll see examples of:

* The fundamentals of creating and executing a Search with SuiteScript
* The various methods of iterating over and processing search results
* How to load and execute a Saved Search in SuiteScript
* How to specify Joins to related records in your search filters and columns
* How to use Summaries like summing in your search results
* How to create Filter Expressions for your searches
* How to get the number of results for a particular search

## Patterns in this Book

All code examples are written in SuiteScript version `2.1` and take advantage of modern ECMA Script (ES6+) syntax.

All code examples use the `require` function for defining modules. This will allow you to copy and paste the
snippets directly into the NetSuite debugger environment or into your browser's developer console for testing.

The `N/search` module is always imported as `search`.

`console.log` is used for writing output to the browser console. If desired, you can replace these with your own calls
to the `N/log` module for writing to the Execution Log for the debugger.

{% if previousPost %}Previous Chapter: [{{ previousPost.data.title }}]({{ previousPost.url }}){% endif %}
{% if nextPost %}Next Chapter: [{{ nextPost.data.title }}]({{ nextPost.url }}){% endif %}
