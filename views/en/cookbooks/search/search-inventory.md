---
chapterTitle: 'Location-Based Inventory Searches'
---

While not technically a Transaction Search, Inventory Searches are usually closely tied to Transactions.

In NetSuite, we retrieve Inventory values via Searches on the Item record, which has a number of Inventory-specific 
Filters and Columns.

## How much On Hand Inventory do I have for each Item?

First, NetSuite Items offer a number of columns for determining the total Inventory you have for an Item across all 
Locations.

```javascript
/**
 * Retrieves the On Hand Inventory for the 10 Inventory Items with the most On Hand quantity
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.INVENTORY_ITEM,
    filters: [
      ['type', search.Operator.IS, 'InvtPart'], 'and',
      ['quantityonhand', search.Operator.ISNOTEMPTY, '']
    ],
    columns: [
      {name: 'displayname'},
      {name: 'quantityonhand', sort: search.Sort.DESC}
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  function printOrder(result) {
    const displayName = result.getValue({name: 'displayname'});
    const quantity = result.getValue({name: 'quantityonhand'});
    
    console.log(`${displayName}: ${quantity}`);
    
    return true;
  }
});
```

The Search Columns for total Inventory all start with `quantity*`, e.g. `quantityonhand`, `quantityonorder`, etc. As 
always, see the Records Browser for the complete list.

## What is my Inventory breakdown at a specific Location?

Next, NetSuite Items also allow you to retrieve Inventory quantity values for a specific Location using a separate 
set of Filters and Columns.

```javascript
/**
 * Retrieves the On Hand Inventory for the 10 Inventory Items
 * with the most On Hand quantity
 */
require(['N/search'], function (search) {
  search.create({
    type: search.Type.INVENTORY_ITEM,
    filters: [
      ['type', search.Operator.IS, 'InvtPart'], 'and',
      ['inventorylocation', search.Operator.ANYOF, ['4']], 'and',
      ['locationquantityonhand', search.Operator.ISNOTEMPTY, '']
    ],
    columns: [
      'displayname',
      'locationquantitybackordered',
      'locationquantityonhand',
      'locationquantityonorder'
    ]
  }).run().getRange({start: 0, end: 10}).forEach(printOrder);
  
  function printOrder(result) {
    const displayName = result.getValue({name: 'displayname'});
    const onHand = result.getValue({name: 'locationquantityonhand'});
    const onOrder = result.getValue({name: 'locationquantityonorder'});
    const backOrdered = result.getValue({name: 'locationquantitybackordered'});
    
    console.group(displayName);
    console.log(`On Hand: ${onHand}`);
    console.log(`On Order: ${onOrder}`);
    console.log(`Backordered: ${backOrdered}`);
    console.groupEnd();
    
    return true;
  }
});
```

The Search Columns for Location-based Inventory all start with `locationquantity*`, e.g. `locationquantityonhand`, 
`locationquantityonorder`, etc. Again, see the Records Browser for the complete list.

In order to use these `locationquantity*` Columns, you must specify the `inventorylocation` Filter in your Search.
