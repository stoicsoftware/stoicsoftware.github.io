---
label: 'Searching by Transaction Status'
eleventyNavigation:
  key: 'Transaction Statuses'
  order: 99
---

Frequently we need to retrieve or filter by Status in our Transaction Searches, but Statuses are notoriously 
confusing to work with in SuiteScript. Status fields behave uniquely when compared to any other Select-type field in 
NetSuite.

## Transaction Status in Searches

Normally, a Select field has a text value that you see in the UI, and a numeric internal ID that you use in 
SuiteScript. Statuses, however, do not have this numeric ID. Instead, they have an alphabet letter identifier, 
sometimes coupled with the record type.

The examples below will demonstrate how to work with Transaction Statuses in both Search Filters and Columns.

### What are all the unapproved Return Authorizations from last month?

```javascript
/**
 * Retrieves the 10 oldest, unapproved Return Authorizations from last month
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.RETURN_AUTHORIZATION,
    filters: [
      ['mainline', search.Operator.IS, true], 'and',
      ['trandate', search.Operator.WITHIN, 'lastMonth'], 'and',
      ['status', search.Operator.ANYOF, ['RtnAuth:A']]
    ],
    columns: [
      'status',
      {name: 'trandate', sort: search.Sort.ASC}
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  const printOrder = result => {
    console.group(result.id);
    console.log(`Status Value: ${result.getValue({name: 'status'})}`);
    console.log(`Status Text: ${result.getText({name: 'status'})}`);
    console.groupEnd();
    
    return true;
  }
});
```

In the results, the `value` of `status` is `'pendingApproval'`, while the `text` is `"Pending Approval"`.

These same values do not work when used as the Filter value; you must use the `RecordType:Letter` format for the 
Filter value. Unfortunately, there is no official documentation that shows the correct identifiers of the various 
Statuses. The only public source I have found for these values is this blog post from DreamXTream in 2011:
https://dreamxtream.wordpress.com/2011/04/18/netsuite-transaction-status-codes/
