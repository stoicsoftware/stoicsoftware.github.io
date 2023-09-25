---
label: 'The `mainline` Transaction Filter'
---

NetSuite's data model consists fundamentally of Records, which are split into "body" and "sublist" fields. In 
searches, NetSuite delineates the two with a concept called "Main Line". Main Line is effectively a Search Filter 
which allows you to control whether your Search Results contain data from only the body, only the sublists, or both.

Mastering this Main Line concept is absolutely *critical* to mastering transaction searches within NetSuite.

For a detailed walkthrough of how Main Line works, watch
[this video](https://youtu.be/msNttISYovo&sub_confirmation=1) (13 minutes)

## What are the totals on the 10 most recent Sales Orders?

We can leverage the `mainline` Filter, which behaves like any other checkbox Filter, to avoid matching any sublist 
lines in our Results.

This example retrieves the Date, Transaction Number, and Total (all body-level fields) for the 10 most recent Sales 
Orders:

```javascript
/**
 * Retrieves the 10 most recent Sales Orders with only body-level
 * data in the Results.
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.SALES_ORDER,
    filters: [
      ['mainline', search.Operator.IS, true]
    ],
    columns: [
      'total',
      {name: 'trandate', sort: search.Sort.DESC},
      'tranid'
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  const printOrder = result => {
    const tranId = result.getValue({name: 'tranid'});
    const tranDate = result.getValue({name: 'trandate'});
    const total = result.getValue({name: 'total'});
    
    console.log(`${tranId} on ${tranDate} for ${total}`);
    
    return true;
  }
});
```

What happens if we don't include the `mainline` filter in this Search? Instead of getting one result per transaction,
instead we get one result per transaction *and* one result per transaction *line*. If we don't properly understand 
`mainline`, this will give us extremely misleading Results.

![Default Search Results](/assets/img/mainline.png)

Experiment with the `mainline` Filter in your Searches to see how it affects the Results.

It is important to note that the `mainline` Filter is not supported on Journal Entry searches.

## How many of each Item were ordered last month?

Conversely, we can leverage the `mainline` Filter to avoid matching any *body-level* data in our Results as well so 
that we *only* get sublist data, but there is a further wrinkle: NetSuite Transactions actually contain *multiple* 
sublists, not just the Items sublist.

We are often only interested in the Items sublist, though. In order to filter out all other sublists, we need to 
provide additional Filters, as shown in the following example, which calculates how many of each Item were ordered 
last month:

```javascript
/**
 * Retrieves the quantity ordered by Item from Sales Orders created last month.
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.SALES_ORDER,
    filters: [
      ['mainline', search.Operator.IS, false], 'and',
      ['cogs', search.Operator.IS, false], 'and',
      ['shipping', search.Operator.IS, false], 'and',
      ['taxline', search.Operator.IS, false], 'and',
      ['trandate', search.Operator.WITHIN, 'lastMonth']
    ],
    columns: [
      {name: 'item', summary: search.Summary.GROUP},
      {name: 'quantity', summary: search.Summary.SUM}
    ]
  }).run().getRange({start: 0, end: 1000}).forEach(printOrder);
  
  const printOrder = result => {
    const quantity = result.getValue({name: 'quantity', summary: search.Summary.SUM});
    const item = result.getText({name: 'item', summary: search.Summary.GROUP});
    
    console.log(`${quantity} ${item} ordered last month.`);
    
    return true;
  }
});
```

Unfortunately, there is no Filter that says "Only show me the Item lines". Instead, we have to *explicitly exclude* 
the *other* sublists (Shipping, Tax, and COGS) by setting their respective Filters to `false`.

Of course we can also use these same Filters in various combinations when we *are* interested in the data from these 
sublists. In this way, we can focus specifically on Shipping, Tax, or COGS for highly targeted reporting and analysis.
