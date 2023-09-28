---
chapterTitle: 'Introduction'
tags: ['cookbooks']
eleventyNavigation:
  key: 'cookbook-search'
  parent: 'cookbooks'
  title: 'Searching with SuiteScript'
---

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
* How to process very large (`4,000+`) result sets using Paging
* Which Employees have logged overtime this week? (How to use Summary Filters)  
* How do I compare values between Search Columns?
* Which Time Entries were entered late? (How to use Formula Filters and Columns)
* Which Employees have zero time entries? (How to search for absence of something)
* What are the totals on the 10 most recent Sales Orders? 
* How many of each Item were ordered last month?
* What are the Most Recent Sales Orders?
* What are the Oldest Return Authorizations?
* What are the Most Recent Sales Orders, with the Highest Amounts First?
* What is the Amount of the Most Recent Sales Order by Customer?
* Which Sales Rep had the Top Transaction in each Month?
* Who is the Contact for the Most Recent Case Filed by a Customer?
* What are all the unapproved Return Authorizations from last month?
* How much On Hand Inventory do I have for each Item?
* What is my Inventory breakdown at a specific Location?

## Patterns in this Book

All code examples are written in SuiteScript version `2.1` and take advantage of modern ECMA Script (ES6+) syntax.

All code examples use the `require` function for defining modules. This will allow you to copy and paste the
snippets directly into the NetSuite debugger environment or into your browser's developer console for testing.

The `N/search` module is always imported as `search`.

`console.log` is used for writing output to the browser console. If desired, you can replace these with your own calls
to the `N/log` module for writing to the Execution Log for the debugger. For more on how to test SuiteScript 2.x in 
your browser's console, watch [this tutorial video](https://www.youtube.com/watch?v=ZAN8clhKxIw&sub_confirmation=1).
