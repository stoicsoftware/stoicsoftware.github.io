---
chapterTitle: 'Filter Expressions'
---

Filter Expressions are an alternate, more concise syntax for specifying our Search Filters. They also enable 
additional capabilities like filter grouping and `OR` logical relationships.

## Filter Expression Syntax

So far we've only seen how to specify a single Filter in our Filter Expression. Let's make our previous example a 
little more generic. We'll create a function that searches for Customers by a given State and Sales Rep that we provide:

```javascript
/**
 * Creates and executes a Customer search that counts all Customers located
 * within California for a specific Sales Rep.
 *
 * Shows how to specify AND relationship between multiple criteria in Filter Expressions
 */
require(['N/search'], function (search) {
  // Replace "45" with the internal ID of any Sales Rep ID in your account
  findCustomersByStateAndRep('CA', '45').each(printCustomerName);

  function findCustomersByStateAndRep(state, salesRepId) {
    return search.create({
      type: search.Type.CUSTOMER,
      filters: [
        ['state', search.Operator.ANYOF, [state]], 'and',
        ['salesrep', search.Operator.ANYOF, salesRepId]
      ],
      columns: ['entityid', 'email']
    }).run();
  }

  function printCustomerName(result) {
    console.log(result.getValue({name: 'entityid'}));
    return true;
  }
});
```

We have moved our Search creation inside a function that accepts parameters for the State and Sales Rep:

```javascript
function findCustomersByStateAndRep(state, salesRepId) {
  return search.create({
    type: search.Type.CUSTOMER,
    filters: [
      ['state', search.Operator.ANYOF, [state]], 'and',
      ['salesrep', search.Operator.ANYOF, salesRepId]
    ],
    columns: ['entityid', 'email']
  }).run();
}
```

The function creates and immediately runs the search, returning the `ResultSet` instance created by `run()`.

This pattern of creating the Search instance and returning it from a function named `find*` is a common design 
structure I use to isolate my search logic. I find that this makes it very easy to comprehend, modify, and reuse my 
Searches, as well as unit test the code that relies on the search.

## `AND` Relationships in Filter Expressions

Focusing in on our Filter Expression, you can see that we've added a second filter and placed an `'and'` between them:

```javascript
// ...
filters: [
  ['state', search.Operator.ANYOF, [state]], 'and',
  ['salesrep', search.Operator.ANYOF, salesRepId]
],
// ...
```

This shows us a more general pattern of Filter Expressions:

```javascript
[
    filter1,
    logicalOperator1,
    filter2,
    logicalOperator2,
    filter3,
    ...
]
```

where `filterN` is in the format `[fieldName, operator, values]`, and `logicalOperatorN` is one of
`'and'` or `'or'`, depending on the logical relationship between the filters.

The UI equivalent of SuiteScript's Filter Expressions is checking the *Use Expressions* box in a
Saved Search's Criteria tab.

## `OR` Relationships and Grouping Criteria

In addition to `AND` relationships between our Filters, we can also have `OR` relationships between them. Beyond 
that, we can build very complex Filters by logically grouping Filters together.

Let's create a Search with a more complex Filter structure of `A AND (B OR C)`:

```javascript
/**
 * Creates and executes a Customer search that finds all Customers for a specific
 * Sales Rep that are either on Credit Hold or have an Overdue Balance.
 *
 * Shows how to specify OR relationship between multiple criteria in Filter Expressions
 *
 * Shows how to logically group criteria like using "Parens" in the UI
 */
require(['N/search'], function (search) {
  // Replace "17" with the internal ID of any Sales Rep ID in your account
  findProblemCustomersByRep('17').each(printCustomerName);

  function findProblemCustomersByRep(salesRepId) {
    return search.create({
      type: search.Type.CUSTOMER,
      filters: [
        ['salesrep', search.Operator.ANYOF, salesRepId], 'and',
        [
          ['overduebalance', search.Operator.GREATERTHAN, 0], 'or',
          ['credithold', search.Operator.ANYOF, 'ON']
        ]
      ],
      columns: ['entityid', 'email']
    }).run();
  }

  function printCustomerName(result) {
    console.log(result.getValue({name: 'entityid'}));
    return true;
  }
});
```

We've encapsulated our Search in the `findProblemCustomersByRep` function.

### `OR` Relationships

First let's focus on how we specify the `OR` relationship between Filters. Ultimately, all we're doing
is changing the `'and'` we have been using to an `'or'` where appropriate:

```javascript
['overduebalance', search.Operator.GREATERTHAN, 0], 'or',
['credithold', search.Operator.ANYOF, 'ON']
```

Now our Search will find Customers that meet *either* (or both) of these criteria.

### Logically Grouping Criteria

We have the `(B OR C)` portion of our Filters, but we also want to filter our results down by a specific Sales Rep 
to get the `A AND` portion. We do that by first nesting our `overduebalance` and `credithold` filters within their 
own Array, thus logically grouping them together:

```javascript
[
  ['overduebalance', search.Operator.GREATERTHAN, 0], 'or',
  ['credithold', search.Operator.ANYOF, 'ON']
]
```

Although it's not necessary to write it out so verbosely, it might help to walk through it this way:

```javascript
const salesRepFilter = ['salesrep', s.Operator.ANYOF, salesRepId]; // => A

const overdueFilter = ['overduebalance', s.Operator.GREATERTHAN, 0]; // => B
const creditFilter = ['credithold', s.Operator.ANYOF, 'ON']; // => C

const problemCustomerFilter = [overdueFilter, 'or', creditFilter]; // => B OR C

customerSearch.filters = [salesRepFilter, 'and', problemCustomerFilter];
// => A AND (B OR C)
```

Note that nothing at all has changed about the way we iterate through and process our results.

### Favor Filter Expressions

There is no way to create an `OR` relationship using the Object syntax for Filters; there is also no way to 
logically group Filters using the Object syntax. These can only be accomplished with Filter Expressions.

Because of this power and flexibility that Filter Expressions have over the Object syntax, and the more concise 
nature of Filter Expressions, I only use the Object syntax when absolutely necessary. In all other cases, I use 
Filter Expressions to define my Search Filters.
