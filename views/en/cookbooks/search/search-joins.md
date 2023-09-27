---
chapterTitle: 'Joins: Retrieving Data from Related Records'
---

So far all of our searches have only retrieved data from the exact records that show up in our results. We know from 
navigating the UI that those records are related to many other records.

For instance, the Customers we have been searching are related to Sales Reps, to Contacts, to Transactions. Can we 
use our searches to retrieve data from these records as well?

Of course we can! We do this using "joins" in our Filters and Columns.

Let's expand our previous example to retrieve not only the Customer's main email address, but also the email address 
of the Primary Contact:

```javascript
/**
 * Creates and executes a Customer search that finds all Customers for a specific
 * Sales Rep that are either on Credit Hold or have an Overdue Balance.
 *
 * Shows how to specify Joined Columns to retrieve data from related records
 */
require(['N/search'], function (search) {
  // Replace "17" with the internal ID of any Sales Rep ID in your account
  findProblemCustomersByRep('17').each(printPrimaryContactEmail);

  function findProblemCustomersByRep(salesRepId) {
    return search.create({
      type: search.Type.CUSTOMER,
      filters: [
        ['salesrep', search.Operator.ANYOF, salesRepId], 'and',
        ['salesrep.isinactive', search.Operator.IS, 'F'], 'and',
        [
          ['overduebalance', search.Operator.GREATERTHAN, 0], 'or',
          ['credithold', search.Operator.ANYOF, 'ON']
        ]
      ],
      columns: ['entityid', 'email', 'contactprimary.email']
    }).run();
  }

  function printPrimaryContactEmail(result) {
    console.log(result.getValue({name: 'email', join: 'contactprimary'}));
    return true;
  }
});
```

## Specifying Join Columns

Here, we are adding a Column to our results:

```javascript
columns: ['entityid', 'email', 'contactprimary.email']
```

The format for a joined column uses a very simple dot syntax: `'joinId.columnId'`.

To see the available Joins for a specific Record Type, find the Record Type in the
[Records Browser](https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2023_1/script/record/account.html)
and explore the "Search Joins" section.

## Reading Data from Join Columns

We've renamed our iteration function to `printPrimaryContactEmail` and updated it accordingly.  When we go to read 
the value of a Join column, there is a slight addition to our `getValue` call:

```javascript
result.getValue({name: 'email', join: 'contactprimary'})
```

We must specify the additional `join` property to properly retrieve the value for the Join column. The same addition 
would apply to the `getText` method as well.

## Specifying Join Filters

We can also filter our Searches based on data from related records using Join Filters. The syntax for a Join Filter 
is exactly the same as a Join Column, with the dot syntax: `'joinId.filterId'`.

Notice in our example, we also wanted to make sure our Sales Rep record was not inactive, so we added a `'salesrep.
isinactive'` Filter:

```javascript
// ...
['salesrep.isinactive', search.Operator.IS, 'F'], 'and',
// ...
```
