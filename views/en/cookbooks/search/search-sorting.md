---
label: 'Sorting Search Results'
eleventyNavigation:
  key: 'Sorting Search Results'
---

We can of course sort our Search Results from SuiteScript, just like we can in the UI. This is not limited to just 
Transaction Searches in any way.

We define the sort order of our Results on the Columns of our Search using the `sort` property in the Column 
definition. The `N/search` module provides us with a `Sort` enumeration for the direction of the sort.

### What are the *Most Recent* Sales Orders?

Sorting can be done in descending order using the `DESC` value from the `Sort` enumeration:

```javascript
/**
 * Retrieves the 10 most recent Sales Orders
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.SALES_ORDER,
    filters: [
      ['mainline', search.Operator.IS, true]
    ],
    columns: [
      {name: 'trandate', sort: search.Sort.DESC}
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
    
  const printOrder = result => {
    console.log(`${result.id} on  ${result.getValue({name: 'trandate'})}`);
    return true;
  };
});
```

### What are the *Oldest* Return Authorizations?

Sorting can be done in ascending order using the `ASC` value from the `Sort` enumeration:

```javascript
/**
 * Retrieves the 5 oldest Return Authorizations
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.RETURN_AUTHORIZATION,
    filters: [
      ['mainline', search.Operator.IS, true]
    ],
    columns: [
      {name: 'trandate', sort: search.Sort.ASC}
    ]
  }).run().getRange({start: 0, end: 5}).forEach(printOrder);
    
  const printOrder = result => {
    console.log(`${result.id} on ${result.getValue({name:"trandate"})}`);
    return true;
  }
});
```

### What are the *Most Recent* Sales Orders, with the Highest Amounts First?

We can also apply sorting to multiple Columns, and our Results we be sorted by those Columns *in the order in which 
they are defined*.

```javascript
/**
 * Retrieves the 10 most recent Sales Orders with the highest amounts first
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.SALES_ORDER,
    filters: [
      ['mainline', search.Operator.IS, true]
    ],
    columns: [
      {name: 'trandate', sort: search.Sort.DESC},
      {name: 'total', sort: search.Sort.DESC}
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  const printOrder = result => {
    const tranDate = result.getValue({name: 'trandate'});
    const total = result.getValue({name: 'total'});
    
    console.log(`${result.id} on ${tranDate} for ${total}`);
    
    return true;
  }
});
```

If we instead wanted to see the Results sorted first by the highest amount, then by the Date of the order, we would 
simply flip the order of the Columns:

```javascript
columns: [
  {name: 'trandate', sort: search.Sort.DESC},
  {name: 'total', sort: search.Sort.DESC}
]
```
