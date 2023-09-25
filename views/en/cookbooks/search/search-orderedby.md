---
label: 'When Ordered By'
eleventyNavigation:
  key: 'When Ordered By'
---

## Aggregating Transaction Results Based on Minimal/Maximal Values

There are times we only care about the values on a Record where a certain field is minimal or maximal. For instance, 
perhaps we want the Totals of Sales Orders by Customer, but we only care about the *most recent* orders - in other 
words, where the Date field is maximal.

For situations like this, NetSuite provides us with the *When Ordered By* feature of Search Columns.

According to NetSuite Help:

> The When Ordered By Field option provides search results that return the value for a field when the value for 
> another field is minimal or maximal.

We can leverage *When Ordered By* from both the UI and SuiteScript.

If you happen to be familiar with Oracle SQL, *When Ordered By* is the same as `keep_dense_rank`.

Let's examine several examples of using *When Ordered By*.

### What is the Amount of the Most Recent Sales Order by Customer?

```javascript
/**
 * Retrieves the Total on the most recent Sales Order for each Customer
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.SALES_ORDER,
    filters: [
      ['mainline', search.Operator.IS, true]
    ],
    columns: [
      {name: 'entity', summary: search.Summary.GROUP},
      search.createColumn({name: 'totalamount', summary: search.Summary.MAX})
        .setWhenOrderedBy({name: 'trandate', join: 'x'})
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  const printOrder = result => {
    const customer = result.getText({name:"entity", summary:search.Summary.GROUP});
    const total = result.getValue({name:"totalamount", summary:search.Summary.MAX});
    
    console.log(`${customer}'s most recent order: ${total}`);
      
    return true;
  }
});
```

Note the use of `join: 'x'` in `setWhenOrderedBy`; at the time of this writing, `join` is a *required* value in 
`setWhenOrderedBy`, even if your search does not require a join here. I used `'x'` as a nonsensical join name, so it 
would not be confused with an actual join. It is my hope that this is found to be a bug in the `setWhenOrderedBy` 
API and is fixed by making `join` optional.

### Which Sales Rep had the Top Transaction in each Month?

```javascript
/**
 * Retrieves the Sales Rep with the largest (by Total) Sales Order in each Period
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.SALES_ORDER,
    filters: [
      ['mainline', search.Operator.IS, true], 'and',
      ['salesrep', search.Operator.NONEOF, '@NONE@'], 'and',
      ['salesrep.isinactive', search.Operator.IS, false]
    ],
    columns: [
      {name: 'postingperiod', summary: search.Summary.GROUP},
      search.createColumn({name: 'salesrep', summary: search.Summary.MAX})
        .setWhenOrderedBy({name: 'totalamount', join: 'x'})
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  const printOrder = result => {
    const salesRep = result.getValue({name: 'salesrep', summary:search.Summary.MAX});
    const postingPeriod = result.getText({name: 'postingperiod', summary:search.Summary.GROUP});
    
    console.log(`${salesRep} had the largest order in ${postingPeriod}`);
    
    return true;
  }
});
```

### Who is the Contact for the Most Recent Case Filed by a Customer?

*When Ordered By* is not limited to Transaction searches; we can leverage it in any other Search type
as well.

```javascript
/**
 * Retrieves the Contact on the most recent Case filed
 * by each Customer
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.SUPPORT_CASE,
    filters: [
      ['contact', search.Operator.ISNOTEMPTY, '']
    ],
    columns: [
      {name: 'company', summary: search.Summary.GROUP},
      search.createColumn({
        name: 'contact',
        summary: search.Summary.MAX
      }).setWhenOrderedBy({name: 'createddate', join: 'x'})
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  const printOrder = result => {
    const contact = result.getValue({name: 'contact', summary:search.Summary.MAX});
    const company = result.getValue({name: 'company', summary:search.Summary.GROUP});
    
    console.log(`${contact} is the Contact on ${company}'s most recent Case.`);
    
    return true;
  }
});
```
