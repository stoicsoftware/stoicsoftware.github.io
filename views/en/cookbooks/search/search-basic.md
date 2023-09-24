---
title: 'The Anatomy of a SuiteScript Search'
---

# The Anatomy of a SuiteScript Search

In our first example, we create a Customer Search that retrieves all Customers located within the
state of California:

```javascript
/**
 * Creates and executes a Customer search that finds all Customers located
 * within California.
 *
 * Uses the most verbose syntax for specifying filters and columns.
 *
 * Uses the `each` method for iteration through search results.
 */
require(['N/search'], (search) => {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
      {name: 'state', operator: search.Operator.ANYOF, values: ['CA']}
    ],
    columns: [
      {name: 'entityid'},
      {name: 'email'}
    ]
  });

  customerSearch.run().each(printCustomerNameAndEmail);

  function printCustomerNameAndEmail(result) {
    const customerName = result.getValue({name: 'entityid'});
    const customerEmail = result.getValue({name: 'email'});

    console.log(`${customerName} - ${customerEmail}`);

    return true;
  }
});
```

## The `N/search` module

All searching functionality in SuiteScript is provided by the `N/search` module.

```javascript
require(['N/search'], (search) => {
  /* ... */
});
```

The basic formula for searching with the SuiteScript API goes like this:

1. Create a new `Search` instance OR load an existing Saved Search
1. Specify the Record Type, Filters, and Columns of our Search
1. Execute the Search
1. Retrieve the Results of the Search
1. Process the Results

### Creation of a search with `s.create`

Here we import the `N/search` module as `search` and use its `create` method to accomplish steps 1 and 2 of our 
basic formula. We create a `Search` instance by specifying its Record Type, Filters, and Columns.

We start by defining the Search's Record Type with the `type` property of `create`. We provide it a value using the 
`N/search` module's `Type` enumeration for native records. For custom records, we can simply enter the Custom 
Record's ID as a literal String (e.g. `type: 'customrecord_my_rec'`).

```javascript
const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    // ...
```

For a list of all possible values for the `Type` enumeration, see the
[search.Type](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4483165708.html) documentation.

### Specifying Filters

Next, we provide our Search's Filters (also called "Criteria" in the UI) using the `filters` property. We will 
explore a couple different ways to specify Filters. The first way that you see here is by creating an Array of Objects:

```javascript
// ...
filters: [
  {name: 'state', operator: s.Operator.ANYOF, values: ['CA']}
],
// ...
```

Each element of the Array defines one Filter by providing:

* a `name` to identify the field to be filtered
* an `operator` for how the field will be compared
* the `values` to compare the field to

We could optionally include in each Filter:

* a `join` to filter on fields from related records
* a `summary` to filter on summarized values like `COUNT`s or `SUM`s

If you provide multiple Filters in this Array, they will all have a logical `AND` relationship, so a Record must 
match *all* of your Filters to be included in the results. With this syntax, there is no way to specify an `OR` 
relationship for Filters defined in this manner.

### Specifying Columns

To finish off the creation of our Search instance, we specify the Columns (also called "Results" in the UI) that 
will be included in the results. We specify Columns using the `columns` property of `create`.

```javascript
// ...
columns: [
  {name: 'entityid'},
  {name: 'email'}
]
// ...
```

Each element of the Array defines one Column by providing:

* a `name` to identify the field to be included in the results

We could optionally include in each Column:

* a `join` to retrieve fields from related records
* a `summary` to summarize that field with say a `COUNT` or `SUM`

Notice we also specify the `summary` with an enumeration. To see the possible Summary types, see the
[search.Summary](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4345777923.html) documentation.

### Executing the Search

Creating the Search instance is not enough to actually execute the Search. In order to do that, we need to invoke 
the `run` method on our Search instance.

```javascript
// ...
customerSearch.run()
// ...
```

This will execute our Search on the NetSuite server and save the results there for when our script is ready to 
retrieve them, but it doesn't actually give us the search results. There is one more step to actually process the 
results.

### Iterating with `each`

In this case, we want to retrieve our Search's results immediately, so we can directly chain our `run` call with a 
call to the `each` iterator. We use `each` to process results one at a time.

We define a function `printCustomerNameAndEmail` that contains the logic for processing a single result. As the name 
implies, all we want to do is print each Customer's Name and Email to the browser console.

```javascript
// ...
customerSearch.run().each(printCustomerNameAndEmail);

function printCustomerNameAndEmail(result) {
  const customerName = result.getValue({name: 'entityid'});
  const customerEmail = result.getValue({name: 'email'});

  console.log(`${customerName} - ${customerEmail}`);

  return true;
}
// ...
```

The callback function for `each` *must* return a Boolean value:

* `true` to continue iterating to the next result
* `false` to stop iterating; returning nothing is the same as returning false and will stop iteration

We can use this behaviour to conditionally stop processing our results once certain conditions are met.

If you are trying to process results with `each` but only see one result getting processed, it is very likely you 
forgot the `return` statement in your callback function.

Note that using `run()` and `each` will only iterate through, at most, `4,000` results.

### Reading Result Data with `getValue`

As the `each` method iterates over our Search Results, it passes them individually into the callback function we 
specified, `printCustomerNameAndEmail`. The parameter passed in is an instance of `N/search.Result`, which has a 
`getValue` method for reading the value from a particular Column:

```javascript
const customerName = result.getValue({name: 'entityid'});
const customerEmail = result.getValue({name: 'email'});

console.log(`${customerName} - ${customerEmail}`);
```

For Select fields (dropdowns), `getValue` will always return the internal ID of the selected record. If instead, you 
want to display the text displayed in the Select field, you can use `getText`.

For example, if we were to add the `salesrep` Column to our Search, we would retrieve both values this way:

```javascript
const salesRepId = result.getValue({name: 'salesrep'});
const salesRepName = result.getText({name: 'salesrep'});

console.log(`Sales Rep ID: ${salesRepId}`);
// Sales Rep ID: 45

console.log(`Sales Rep Name: ${salesRepName}`);
// Sales Rep Name: Eric Grubaugh
```
