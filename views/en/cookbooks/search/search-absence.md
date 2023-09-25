---
label: Finding Absent Records
---

The majority of the time that we're building searches, we're searching for the *existence* of Records that meet our 
criteria. Once in a while, however, we actually need to search for the *absence* of something, and this can often be 
trickier.

## Which Employees have no Time Entries in the past week?

For example, which Employees have no Time Entries for this week?

Because we are looking for the *absence* of a Record, we'll actually need to combine the Results from two different 
searches. If the Records don't exist, we won't be able to find them directly, so we take a slightly different approach:

```javascript
/**
 * Finds Employees that have no Time Entries for the last week.
 *
 * Combines the Results from two different searches in order to search
 * for the absence of Records.
 */
require(['N/search'], function (search) {
  const employeeSearch = search.create({
    type: search.Type.EMPLOYEE,
    filters: [
      ['isinactive', search.Operator.IS, 'F']
    ],
    columns: [
      {name: 'formulatext', formula: '{firstname} || ' ' || {lastname}'}
    ]
  });
  console.log(`# Employees = ${employeeSearch.runPaged().count}`);
  const timeSearch = search.create({
    type: search.Type.TIME_BILL,
    filters: [
      ['date', search.Operator.WITHIN, 'thisBusinessWeek'], 'and',
      ['type', search.Operator.ANYOF, 'A'] // Actual Time
    ],
    columns: [
      {name: 'employee', summary: search.Summary.GROUP}
    ]
  });
  console.log(`# Employees with Entries = ${timeSearch.runPaged().count}`);

  const employees = employeeSearch.run().getRange({start: 0, end: 1000});
  const timeEntries = timeSearch.run().getRange({start: 0, end: 1000});
  
  const employeesWithNoEntries = findEmployeesWithNoEntries(employees, timeEntries);
  console.log(`# Employees With No Entries = ${employeesWithNoEntries.length}`);
  employeesWithNoEntries.forEach(printEmployeeName);

  // Does the given employee have at least one Time Entry in entries Array?
  const employeeHasEntry = (entries, employee) => {
    return entries.some(entry => {
      const entryEmployee = entry.getValue({name: 'employee', summary: search.Summary.GROUP});
      return (entryEmployee == employee.id);
    });
  };

  // Returns a copy of employees Array that does *not* include any Employees
  // that *do* have Time Entries in entries Array
  const findEmployeesWithNoEntries = (employees, entries) =>
    employees.filter(employee => !employeeHasEntry(entries, employee));

  const printEmployeeName = result => console.log(result.getValue({name:'formulatext'}));
});
```

In this case, we get the list of all active Employees *and* the list of all Employees who *have* created Time 
Entries for this week:

```javascript
const employeeSearch = search.create({
  type: search.Type.EMPLOYEE,
  filters: [
    ['isinactive', search.Operator.IS, 'F']
  ],
  columns: [
    {name: 'formulatext', formula: '{firstname} || ' ' || {lastname}'}
  ]
});
console.log(`# Employees = ${employeeSearch.runPaged().count}`);
const timeSearch = search.create({
  type: search.Type.TIME_BILL,
  filters: [
    ['date', search.Operator.WITHIN, 'thisBusinessWeek'], 'and',
    ['type', search.Operator.ANYOF, 'A'] // Actual Time
  ],
  columns: [
    {name: 'employee', summary: search.Summary.GROUP}
  ]
});
console.log(`# Employees with Entries = ${timeSearch.runPaged().count}`);

const employees = employeeSearch.run().getRange({start: 0, end: 1000});
const timeEntries = timeSearch.run().getRange({start: 0, end: 1000});
```

So far there's nothing new here; we're just running two separate Searches.

Now in order to determine which Employees don't have any Time Entries, we essentially need to find which Employees 
exist in *both* lists, and remove them from our final Results. This will leave us only with Employees who do not 
have Time Entries.

To accomplish this, we can leverage the JavaScript Array's
[`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
and
[`some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
methods.

First, we write the `employeeHasEntry` function that accepts an Array of Time Entry Search Results and an Employee 
Search Result. Its job is to determine whether a specific Employee has a Time Entry:

```javascript
const employeeHasEntry = (entries, employee) => {
  return entries.some(entry => {
    const entryEmployee = entry.getValue({name: 'employee', summary: search.Summary.GROUP});
    return (entryEmployee == employee.id);
  });
};
```

We use `some` to determine if the given `employee` exists within the `entries` Array.

Now that we can detect whether a single Employee has any Time Entries, we need to extend that over the
full list of Employees. This falls to `findEmployeesWithNoEntries`:

```javascript
const findEmployeesWithNoEntries = (employees, entries) =>
  employees.filter(employee => !employeeHasEntry(entries, employee));
```

We use `employeeHasEntry` in conjunction with `filter` to remove any Employees that *do* have a Time Entry.

We can now pass in our two separate Result Arrays and list the Employees that have no Time Entries this week:

```javascript
const employeesWithNoEntries = findEmployeesWithNoEntries(employees, timeEntries);
console.log(`# Employees With No Entries = ${employeesWithNoEntries.length}`);
employeesWithNoEntries.forEach(printEmployeeName);
```
