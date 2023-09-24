---
label: 'A More Concise Search'
---

As we saw in the first example, our Search Filters and Columns can be created as Arrays of Objects, but this gets 
really verbose for searches with multiple Filters and Columns. For simple searches, there is a much more concise way 
of specifying our Filters and Columns:

```javascript
/**
 * Creates and executes a Customer search that finds all Customers located
 * within California.
 *
 * Uses minimal syntax for specifying filters and columns.
 *
 * Uses the `each` method for iteration through search results.
 */
require(['N/search'], function (search) {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
        ['state', search.Operator.ANYOF, ['CA']]
    ],
    columns: ['entityid', 'email']
  });

  customerSearch.run().each(printCustomerName);

  function printCustomerName(result) {
    const customerName = result.getValue({name: 'entityid'});
    
    console.log(customerName);
    
    return true;
  }
});
```

Functionally, this is an identical search to that of the first chapter, but we've saved ourselves a bit
of typing.

### Filter Expressions

We condense our Filters down by using what NetSuite calls a *Filter Expression* instead of our previous Array of 
Objects:

```javascript
// ...
filters: [
  ['state', s.Operator.ANYOF, ['CA']]
],
// ...
```

The Filter Expression includes exactly the same data as before:

* a `name` to identify the field to be filtered
* an `operator` for how the field will be compared
* the `values` to compare the field to

Instead of being an Array of Objects, we now have an Array of Arrays. It may look a bit confusing at first, but once 
you are accustomed to it, I feel it is a very compact, readable expression of Filters.

The remainder of the examples in this cookbook will utilize the Filter Expression syntax.

### Columns by Name Only

We also condense our Columns down to brief String literals. For any Column that doesn't involve a Join or a Summary, 
we can simply specify the name of the column as a String literal:

```javascript
// ...
columns: ['entityid', 'email']
// ...
```

Note that nothing else about how we execute the search, iterate through results, or retrieve the values of our 
columns has changed.
