---
chapterTitle: 'Formulas in Searches'
---

In order to perform calculations or comparisons on fields in our Search Results, we need to leverage NetSuite's 
Formula capabilities. When searching, we can leverage formulae in both Filters and Columns.

## Which Time Entries were created more than 7 days after the work was completed?

Let's look at an example to find all Time Entries where the entry was created more than 7 days after the work was 
actually completed.

```javascript
/**
 * Retrieves the Time Entries that were created more than one week after
 * the work was completed by comparing the Date field to the Date Created
 * field on the Time Entry
 */
require(['N/search'], function (search) {
  // Formula for calculating the difference (in Days) between the Date
  // and the Date Created, rounded up with CEIL
  const daysElapsedFormula = 'CEIL({date}-{datecreated})';

  const lateEntriesSearch = search.create({
    type: search.Type.TIME_BILL,
    filters: [
      ['formulanumeric: ' + daysElapsedFormula, search.Operator.GREATERTHAN, 7]
    ],
    columns: [
      'employee',
      'date',
      'datecreated',
      {name: 'formulanumeric', formula: daysElapsedFormula}
    ]
  });

  console.log(`# Late Entries = ${lateEntriesSearch.runPaged().count}`);
  const results = lateEntriesSearch.run().getRange({start: 0, end: 1000});
  const lateEntries = results.map(resultToObject);
  console.table(lateEntries);

  const resultToObject = result => ({
    employeeName: result.getText({name: 'employee'}),
    daysElapsed: result.getValue({name: 'formulanumeric'})
  });
});
```

We start by defining the formula itself:

```javascript
// Formula for calculating the difference (in Days) between the Date
// and the Date Created, rounded up with CEIL
const daysElapsedFormula = 'CEIL({date}-{datecreated})';
```

While it's not necessary to put this into its own variable like this, I've done so to avoid repeating the same 
formula in both the Filter and the Column. This way when I need to change it, I can do so in one spot, and the 
change will be reflected everywhere it's necessary.

With the formula defined, we create our Search, specifying a Formula Filter and a Formula Column for showing the 
number of days elapsed from Date Created to Date:

```javascript
const lateEntriesSearch = search.create({
  type: search.Type.TIME_BILL,
  filters: [
    ['formulanumeric: ' + daysElapsedFormula, search.Operator.GREATERTHAN, 7]
  ],
  columns: [
    'employee',
    'date',
    'datecreated',
    {name: 'formulanumeric', formula: daysElapsedFormula}
  ]
});
```

Note that when you subtract two Date fields in a Formula, NetSuite will give you the number of Days between those 
two Dates.

Because the subtraction of two Dates results in a Number, we use `formulanumeric` rather than `formuladate`. The 
formula type you choose depends on the *output* of your formula, *not on the inputs*.

Once again, we execute our Search and retrieve results just like any other Search:

```javascript
console.log(`# Late Entries = ${lateEntriesSearch.runPaged().count}`);
const results = lateEntriesSearch.run().getRange({start: 0, end: 1000});
```

In this case I want to map over all my Search Results and turn each one into a flat Object so that they are nicely 
printable by `console.table`. The `resultToObject` function turns a single Result into an Object, and then we pass 
this function to `map` so it will translate all the elements of the `results` Array.

```javascript
const lateEntries = results.map(resultToObject);
console.table(lateEntries);

const resultToObject = result => ({
  employeeName: result.getText({name: 'employee'}),
  daysElapsed: result.getValue({name: 'formulanumeric'})
});
```

Notice how we read the value of the Formula Column by specifying `formulanumeric` as the `name`:

```javascript
daysElapsed: result.getValue({name: 'formulanumeric'})
```

## What happens if I have multiple Formula Columns?

Since we retrieve the value of a Formula Column by specifying `formulanumeric`, we also need a way to distinguish 
between multiple Formula Columns of the same type.

Let's add a non-rounded version of the same Formula to our Search Columns:

```javascript
require(['N/search'], function (search) {
  // Formula for calculating the difference (in Days) between the Date
  // and the Date Created, rounded up with CEIL
  const daysElapsedFormula = 'CEIL({date}-{datecreated})';

  const lateEntriesSearch = search.create({
    type: search.Type.TIME_BILL,
    filters: [
      ['formulanumeric: ' + daysElapsedFormula, search.Operator.GREATERTHAN, 7]
    ],
    columns: [
      'employee',
      'date',
      'datecreated',
      {name: 'formulanumeric', formula: daysElapsedFormula},
      {name: 'formulanumeric', formula: '{date}-{datecreated}'}
    ]
  });

  console.log(`# Late Entries = ${lateEntriesSearch.runPaged().count}`);
  const results = lateEntriesSearch.run().getRange({start: 0, end: 1000});
  const lateEntries = results.map(resultToObject);
  console.table(lateEntries);

  function resultToObject(result) {
    const res = result.toJSON();
    console.log(res);
    return {
      employeeName: result.getText({name: 'employee'}),
      daysElapsed: res.values.formulanumeric,
      daysElapsedNoRound: res.values.formulanumeric_1
    };
  }
});
```

First we've added our new non-rounded Formula Column:

```javascript
columns: [
  'employee',
  'date',
  'datecreated',
  {name: 'formulanumeric', formula: daysElapsedFormula},
  {name: 'formulanumeric', formula: '{date}-{datecreated}'}
]
```

However, since both columns are technically named `formulanumeric`, `getValue` is unable to distinguish between them 
and would simply retrieve the last one defined.

In order to use multiple Formula Columns of the same type, we have to get a little creative here and turn the Search 
Result into a plain JavaScript Object using the Result's `toJSON()` method:

```javascript
const res = result.toJSON();
console.log(res);
```

We log out the Object here, so you can inspect its structure for yourself.

From here, each subsequent `formulanumeric` gets a number appended to it, like `formulanumeric_1`; we use this 
knowledge to distinguish between our Formulae of the same type:

```javascript
return {
  employeeName: result.getText({name: 'employee'}),
  daysElapsed: res.values.formulanumeric,
  daysElapsedNoRound: res.values.formulanumeric_1
};
```

## Column Comparisons

When we're building Searches, it's common that we'll need to return the data for individual Columns, and also need 
to compare values between those Columns.

Formula Columns are the best way to accomplish these comparisons, just like we've done in this example, comparing 
the Date to the Date Created on the Time Entry:

```javascript
columns: [
  'employee',
  'date',
  'datecreated',
  {name: 'formulanumeric', formula: '{date}-{datecreated}'}
]
```

In this instance, we happen to be subtracting the two, but you could use any operator or available SQL formula you 
choose to compare the values.
