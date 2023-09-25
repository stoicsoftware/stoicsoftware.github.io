---
label: 'Loading and Executing a Saved Search'
---

Thus far we've been creating our own SuiteScript Searches from scratch, but we can also leverage Saved Searches 
within our Scripts.

```javascript
/**
 * Loads and executes a Saved Customer search.
 *
 * Shows how to modify Filters and Columns on a Saved Search without saving them
 */
require(['N/search'], function (search) {
  const customerSearch = search.load({
    id: 'customsearch_customers_in_ca'
  });

  // Add an additional filter to the search
  customerSearch.filters.push({
    name: 'salesrep',
    operator: search.Operator.ANYOF,
    values: ['@NONE@']
  });

  // Add additional columns to the search
  customerSearch.columns = [
    ...customerSearch.columns,
    ...['email', 'contactprimary.email']
  ];

  customerSearch.run().each(printCustomerName);

  function printCustomerName(result) {
    console.log(result.getValue({name: 'entityid'}));
    return true;
  }
});
```

## Loading a Saved Search

Instead of using `search.create` to make a new Search, we can instead use `search.load` to load an
existing Saved Search:

```javascript
const customerSearch = search.load({
  id: 'customsearch_customers_in_ca'
});
```

We only need to provide the Internal ID of the Saved Search to `load`.

## Modifying a Saved Search in memory

Let's presume our Saved Search here finds all Customers in California, but in our Script we need to add some 
additional criteria and result data.

Once the Saved Search is loaded, we are free to modify the Search Filters and Columns beyond what is set in the 
Saved Search using its `filters` and `columns` properties:

```javascript
customerSearch.filters.push({
  name: 'salesrep',
  operator: search.Operator.ANYOF,
  values: ['@NONE@']
});

customerSearch.columns = [
  ...customerSearch.columns,
  ...['email', 'contactprimary.email']
];
```

Here we've added a Filter so that we're only finding the Customers in California *that don't have a
Sales Rep*, and we've also added the Email Address and Primary Contact's Email Address as Columns.

The `filters` and `columns` properties are standard
[JavaScript Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), so you 
can manipulate them using any Array method you would normally use for adding/removing/modifying elements of an Array.

Once again, nothing changes in the way we iterate through or process results.

## Saving Modifications to a Saved Search

Changes to Filters and Columns of the loaded `Search` instance will only apply to the Search in our Script; they 
will *not* be saved back to the NetSuite UI.

If you want the changes you make in your Script to be saved back to the Saved Search itself, then you can call 
`save` on the Search instance after you've made the changes:

```javascript
customerSearch.save();
```
