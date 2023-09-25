---
label: 'Counting Search Results'
eleventyNavigation:
  key: search-count
  title: 'Counting Search Results'
  order: 30
---

A common piece of information you'll need when running a search is how many results the search returns. There are (at
least) two different ways to go about this. The first is much longer and less efficient, but introduces some 
important concepts. The second is much more concise and performant; it should be the approach you use in Production 
code for this purpose.

To illustrate each approach, we'll create a Search that counts all Customer records located in the state of California.

## Method 1: Utilize a `Summary` Column

```javascript
/**
 * Creates and executes a Customer search that counts all Customers located within California.
 *
 * Uses Summary property of column to Count results.
 *
 * Uses both the `getRange` and the `each` methods for obtaining results:
 * - `getRange` - gets a specific number of results in a single Array
 * - `each` - passes each individual result to a processing function one at a time
 */
require(['N/search'], function (search) {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
      ['state', search.Operator.ANYOF, ['CA']]
    ]
  });

  const customerCount = getCustomerCount(customerSearch);
  console.log(`# Customers in CA =  ${customerCount}`);

  customerSearch.columns =  ['entityid', 'email'];

  customerSearch.run().each(printCustomerName);

  function getCustomerCount(search) {
    search.columns = [
      {name: 'internalid', summary: search.Summary.COUNT}
    ];

    const result = search.run().getRange({start: 0, end: 1})[0];
    return result.getValue({name: 'internalid', summary: search.Summary.COUNT});
  }

  function printCustomerName(result) {
    console.log(`Customer Name: ${result.getValue({name: 'entityid'})}`);
    return true;
  }
});
```

### Create a `Search` Instance

We start by creating our Search just as we did before, but with Filters only:

```javascript
const customerSearch = search.create({
  type: search.Type.CUSTOMER,
  filters: [
    ['state', search.Operator.ANYOF, ['CA']]
  ]
});
```

### Add a `Summary` Column to the Search

Columns and Filters can both be specified and modified *after* the creation of the `Search` instance. We will use that 
capability to execute this same `Search` instance twice, with different Columns on each execution.

We've added a `getCustomerCount` function that encapsulates the logic for performing the summarized Count search:

```javascript
function getCustomerCount(search) {
  search.columns = [
    {name: 'internalid', summary: search.Summary.COUNT}
  ];

  const result = search.run().getRange({start: 0, end: 1})[0];
  return result.getValue({name: 'internalid', summary: search.Summary.COUNT});
}
```

We start by providing a single summarized Column that will count the `internalid`s:

```javascript
search.columns =  [
  {name: 'internalid', summary: search.Summary.COUNT}
];
```

Notice that we've gone back to our Object syntax for declaring the Column. This is the only way to specify a Summary 
on a Column.

You'll also see that the `N/search` module provides us with an enumeration for Summary types. To see the possible 
summaries you can perform, see the
[search.Summary](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4345777923.html) enumeration.

### Retrieving Results with `getRange`

Because we are performing a `COUNT` with no grouping, this Search will return a single result (the
count). We *could* use `each` to "iterate" through our one result and `return false;` to immediately
stop iteration.

Instead, we introduce a new method for retrieving results, `getRange`:

```javascript
const result = search.run().getRange({start: 0, end: 1})[0];
```

We run the search as normal using `run()`.

`getRange` lets us specify a specific slice of our result set by providing the `start` and `end` indices of the 
results we want to process. In this case, we know we want the first result, and *only* the first result, so we 
specify `start` as `0` and `end` as `1`.

The `start` index is inclusive, while the `end` index is exclusive. `getRange` is limited to slices of `1,000` results 
at a time.

`getRange` will always return an Array, and since we know we only have one, we grab the first element in the result 
array with `[0]`.

### Reading Values of a Summary Column

When we read the value of a standard Column, we only needed to provide its `name` to `getValue`.

In order to retrieve the value of a Summary Column, we need to provide its `name` *and* its `summary`:

```javascript
return result.getValue({name: 'internalid', summary: s.Summary.COUNT});
```

To get the actual Customer count for our search, we invoke `getCustomerCount` by passing in our Search instance, 
then print the result to the console:

```javascript
const customerCount = getCustomerCount(customerSearch);
console.log(`# Customers in CA =  ${customerCount}`);
```

### Re-running the Search for Normal Results

Now we have our result count, we want to re-run the Search to get its actual results. All we changed before was the 
Columns, so we can now simply overwrite the `columns` property for our Search, setting them back to the fields we 
want in our results:

```javascript
customerSearch.columns =  ['entityid', 'email'];
```

This will *replace* our single Summary column with the two Columns named here.

We then execute our Search and process our results the same as before:

```javascript
customerSearch.run().each(printCustomerName);
```

## Method 2: Utilize a `PagedData`

All of that technically works, but it requires us to run our search two separate times and modify the columns in 
between executions. Instead, the SuiteScript API provides a concise, convenient way to count the number of search 
results.

```javascript
/**
 * Creates and executes a Customer search that counts all Customers located within California.
 *
 * Uses `count` property of a `PagedData` instance.
 */
require(['N/search'], function (search) {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
      ['state', search.Operator.ANYOF, ['CA']]
    ],
    columns: ['entityid', 'email']
  });

  const customerCount = customerSearch.runPaged().count;
  console.log(`# Customers in CA =  ${customerCount}`);
});
```

### Execute a Paged Search

The only difference here is in how we execute the search. Instead of the `run()` method, we call `runPaged()`, which
creates a [PagedData](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4486558900.html) 
instance. The `PagedData` class provides a `count` property which NetSuite automatically populates with the total number of
results the corresponding `Search` instance returns.

```javascript
const customerCount = customerSearch.runPaged().count;
console.log(`# Customers in CA =  ${customerCount}`);
```

Processing the actual results of a Paged Search is a topic for later.
