---
label: 'Internal IDs in Search Results'
---

Every Search Result in SuiteScript is fundamentally a reference to a Record in NetSuite. It's very common
to run a Search and then want to use the Internal ID for the Record that the Result represents.

## What's the Internal ID for this Search Result?

In fact, it's so common that (almost) every Search Result in SuiteScript has an `id` property that contains the 
corresponding Record's internal ID; there is no need to add `internalid` as a Search Column in your Search!

```javascript
require(['N/search'], function (search) {
  const plainSearch = search.create({
    type: search.Type.EMPLOYEE,
    filters: [
      ['isinactive', search.Operator.IS, 'F']
    ],
    columns: [
      {name: 'formulatext', formula: "{firstname} || ' ' || {lastname}"}
    ]
  });

  console.log('IDs for Plain Search:');
  plainSearch.run().each(printEmployeeId);

  function printEmployeeId(result) {
    console.log(result.id);
    return false; // only process first result
  }
});
```

This will print the internal ID of every active Employee just by accessing `result.id`; no `internalid` Column needed.

## Except...

As with all things NetSuite, however, there is an exception to this: Summary Columns.

Summarized Search Results no longer reference a single Record, but rather an aggregate of Records; for summarized 
Search Results, the `id` property will be `undefined`, and thus not very helpful. However, it's common to summarize 
your Search Results, but also need to drill down into the data for the individual Records that make up the summary.

Let's modify our example to group the Employees by their Hire Date:

```javascript
search.create({
  type: search.Type.EMPLOYEE,
  filters: [
    ['isinactive', search.Operator.IS, 'F']
  ],
  columns: [
    {name: 'hiredate', summary: search.Summary.GROUP},
    {name: 'formulatext', formula: "{firstname} || ' ' || {lastname}", summary: search.Summary.GROUP}
  ]
});
```

How do we access the Internal ID for Search Results within a Summary?

We first add an `internalid` Search Column:

```javascript
columns: [
  {name: 'hiredate', summary: search.Summary.GROUP},
  {name: 'formulatext', formula: "{firstname} || ' ' || {lastname}", summary: search.Summary.GROUP},
  // Add the internalid Column
  {name: 'internalid', summary: search.Summary.GROUP}
]
```

Then we need to access it using `getValue` instead of `id`:

```javascript
function printEmployeeId(result) {
  // Utilize getValue instead of .id
  console.log(result.getValue({name: 'internalid', summary: search.Summary.GROUP}));
  return false; // only process first result
}
```
