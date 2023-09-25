---
label: 'Summarized Search Filters'
eleventyNavigation:
  key: search-summary
  title: 'Summarized Filters'
  order: 90
---

There are many times we'll want to _filter_ Search Results based on an aggregate value, like a `SUM`, `COUNT`, or 
`MAX`. To accomplish this, we can leverage *Summary Filters*.

## Which Employees have logged more than 40 hours this week?

Let's look at an example where we find Employees who have entered more than 40 hours of time this week.

```javascript
/**
 * Finds all Employees who have entered more than 40 hours of time during
 * the current business week.
 *
 * Uses a Summary Filter to find Time Duration greater than 40
 */
require(['N/search'], function (search) {
  const overtimeSearch = search.create({
    type: search.Type.TIME_BILL,
    filters: [
      ['type', search.Operator.ANYOF, 'A'], 'and', // Actual Time
      ['date', search.Operator.WITHIN, 'thisBusinessWeek'], 'and',
      ['SUM(durationdecimal)', search.Operator.GREATERTHAN, 40]
    ],
    columns: [
      {name: 'employee', summary: search.Summary.GROUP},
      {name: 'durationdecimal', summary: search.Summary.SUM}
    ]
  });
  console.log(overtimeSearch.runPaged().count);
  overtimeSearch.run().each(printEmployee);
  
  function printEmployee(result) {
    const employeeName = result.getText({name: 'employee', summary: search.Summary.GROUP});
    const employeeHours = result.getValue({name: 'durationdecimal', summary: search.Summary.SUM});
    
    console.log(`${employeeName}: ${employeeHours}`);
  }
});
```

We create our Time Bill search to find all Time Entries where the Type is *Actual Time*, the Date is
within the current business week, and the Sum of the Duration is greater than 40. In our Results, we
want the Sum of the Duration grouped by Employee.

```javascript
const overtimeSearch = search.create({
  type: search.Type.TIME_BILL,
  filters: [
    ['type', search.Operator.ANYOF, 'A'], 'and', // Actual Time
    ['date', search.Operator.WITHIN, 'thisBusinessWeek'], 'and',
    ['SUM(durationdecimal)', search.Operator.GREATERTHAN, 40]
  ],
  columns: [
    {name: 'employee', summary: search.Summary.GROUP},
    {name: 'durationdecimal', summary: search.Summary.SUM}
  ]
});
```

The focus here is on the `durationdecimal` Search Filter:

```javascript
['SUM(durationdecimal)', search.Operator.GREATERTHAN, 40]
```

In a Filter Expression, we simply wrap the name of our Filter field in the Summary function we want:

* `SUM` for a summation
* `MAX` for a maximum
* `MIN` for a minimum
* `COUNT` for a count
* `AVG` for an average

If we are using Filter Objects instead, we could express this same Filter as:

```javascript
{
  name: 'durationdecimal',
  summary: search.Summary.SUM,
  operator: search.Operator.GREATERTHAN,
  values: 40
}
```

After that, we can execute and process our Search like any other.
