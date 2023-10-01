---
chapterSequence: 8
chapterTitle: 'Handling Large Result Sets'
---

SuiteScript's various Search APIs are limited in the number of Results they will retrieve:

* The `each` iterator will iterate through at most `4,000` Results
* `getRange` only allows retrieval of `1,000` Results at a time

What do you do when you need to process more than those limits?

## Option 1: Repeated Calls to `getRange`

While `getRange` is limited to `1,000` Results at a time, those `1,000` can be selected from any slice of the Result 
set. We can use this to progressively grab slices of `1,000` Results and concatenating them into a single Result set:

```javascript
/**
 * Retrieves all active Customers, even if there are more than 4000,
 * by successively concatenating chunks of 1000 at a time
 * 
 * Uses the `getRange` method repeatedly to retrieve all Results, regardless of limits
 */
require(['N/search'], function (search) {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
      ['isinactive', search.Operator.IS, 'F']
    ],
    columns: ['entityid', 'email']
  }).run();
  
  const customers = getAllResults(customerSearch);
  console.log(customers.length);
  
  function getAllResults(search) {
    const all = [];
    const results = [];

    const startIndex = 0;
    const endIndex = 1000;
    const pageSize = 1000;
    
    do {
      results = search.getRange({
        start: startIndex,
        end: endIndex
      });
      
      all = [...all, ...results];
      
      startIndex += pageSize;
      endIndex += pageSize;
    } while (results.length === pageSize);
    
    return all;
  }
});
```

We start by creating our Search object and executing it with `run`. In this example, we're retrieving all active 
Customers.

```javascript
const customerSearch = search.create({
  type: search.Type.CUSTOMER,
  filters: [
    ['isinactive', search.Operator.IS, 'F']
  ],
  columns: ['entityid', 'email']
}).run();
```

Then we've created the `getAllResults` function that accepts a generic Search ResultSet Object (like the kind 
obtained from `run`) and retrieves all Results for the Search.

```javascript
do {
  // Retrieve one chunk of 1000 Results
  results = search.getRange({
    start: startIndex,
    end: endIndex
  });

  // Add this 1000 to the full list of Results
  all = [...all, ...results];

  // Move to the next page
  startIndex += pageSize;
  endIndex += pageSize;

  // Stop after we no longer receive a full page
} while (results.length === pageSize);
```

This function repeatedly calls `getRange` to retrieve chunks of `1,000` Results at a time, which is the maximum allowed 
by `getRange`. Each time, it concatenates these `1,000` Results onto the `all` Array. Once the loop finishes, the `all` 
Array will contain all of our Search Results in a single data set, and we can return it as the output of our function.

Once we have all the Results in a single Array, we can iterate over or process that Array however we choose.

```javascript
const customers = getAllResults(customerSearch);
console.log(customers.length);
```

If you decide to go with this approach, the `getAllResults` function likely belongs in a library module rather than 
an entry point script so that you can reuse it across any and all searches that return large data sets. 

## Option 2: Paging API

The `N/search` module also provides us with a Paging API for processing large Result sets, giving us
fine-grained control over what constitutes a "Page" of data and how we want to process it. This is my preferred 
method for working with large search result sets.

```javascript
/**
 * Retrieves all active Customers, even if there are more than 4000,
 * by successively concatenating Pages of 1000 at a time
 *
 * Uses the Paging API to retrieve all Results, regardless of limits
 */
require(['N/search'], function (search) {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
      ['isinactive', search.Operator.IS, 'F']
    ],
    columns: ['entityid', 'email']
  }).runPaged({pageSize: 1000});
  
  console.log(customerSearch.count);
  
  const customers = getAllResults(customerSearch);
  console.log(customers.length);
  
  function getAllResults(search) {
    const all = [];
    
    search.pageRanges.forEach(pageRange => {
      const page = search.fetch({index: pageRange.index});
      all = [...all, ...page.data];
    });
    
    return all;
  }
});
```

To use the Paging API, we leverage the Search's `runPaged` method instead of `run`:

```javascript
const customerSearch = search.create({
  type: search.Type.CUSTOMER,
  filters: [
    ['isinactive', search.Operator.IS, 'F']
  ],
  columns: ['entityid', 'email']
}).runPaged({pageSize: 1000});
```

Notice that we can control the number of Results per Page using the `pageSize` option of `runPaged`.

* minimum allowed `pageSize` is 5
* maximum allowed `pageSize` is 1000
* default `pageSize` is 50

When we run a paged Search, we get a list of Page Ranges that we need to iterate through.

```javascript
search.pageRanges.forEach(pageRange => {
  // ...
});
```

Each Page Range contains a Page (fetched by its index), and each Page subsequently contains the Search Result data 
we can retrieve:

```javascript
const page = search.fetch({index: pageRange.index});
all = [...all, ...page.data];
```

This is a slightly more concise way of concatenating all Search Results into a single data set than our previous
`do...while` attempt.

Once again at this point we have a single Array containing all of our Results, so we are free to process that Array 
however we choose:

```javascript
const customers = getAllResults(customerSearch);
console.log(customers.length);
```

## How many results are there?

Recall that a nice side effect of using `runPaged` is the `count` property it creates on the Search Object, which 
does not exist when we use `run`:

```javascript
console.log(customerSearch.count);
```

This is a more concise way of getting the number of total Results from a Search, without having to use any Summary 
`COUNT` Columns or execute the Search twice.
