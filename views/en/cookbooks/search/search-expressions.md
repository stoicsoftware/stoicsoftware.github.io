---
label: 'Filter Expressions'
---

Filter Expressions are a different syntax for specifying our Search Filters.

## `AND` Relationships in Filter Expressions

So far we've only seen how to specify a single Filter in our Filter Expression. Let's make our previous
example a little more generic. We'll create a function that searches for Customers by a given State and
Sales Rep that we provide:

```javascript
/**
 * Creates and executes a Customer search that counts all Customers located
 * within California for a specific Sales Rep.
 *
 * Shows how to specify AND relationship between multiple criteria in Filter Expressions
 *
 * @author Eric T Grubaugh <eric@stoic.software>
 */
require(["N/search"], function (s) {

    // Replace "45" with the internal ID of any Sales Rep ID in your account
    findCustomersByStateAndRep("CA", "45").each(printCustomerName);

    function findCustomersByStateAndRep(state, salesRepId) {
        return s.create({
            type: s.Type.CUSTOMER,
            filters: [
                ["state", s.Operator.ANYOF, [state]], 'and',
                ["salesrep", s.Operator.ANYOF, salesRepId]
            ],
            columns: ["entityid", "email"]
        }).run();
    }

    function printCustomerName(result) {
        console.log(result.getValue({name: "entityid"}));
        return true;
    }
});
```

We have moved our Search creation inside a function that accepts parameters for the State and Sales Rep:

```javascript
function findCustomersByStateAndRep(state, salesRepId) {
    return s.create({
        type: s.Type.CUSTOMER,
        filters: [
            ["state", s.Operator.ANYOF, [state]], 'and',
            ["salesrep", s.Operator.ANYOF, salesRepId]
        ],
        columns: ["entityid", "email"]
    }).run();
}
```

The function creates and immediately runs the search, returning the `ResultSet` instance created by
`run()`.

This pattern of creating the Search instance and returning it from a function named `find*` is a common
design structure I use to isolate my search logic. I find that this makes it very easy to comprehend,
modify, and reuse my Searches.

Focusing in on our Filter Expression, you can see that we've added a second filter and placed an `'and'`
between them:

```javascript
// ...
filters: [
    ["state", s.Operator.ANYOF, [state]], 'and',
    ["salesrep", s.Operator.ANYOF, salesRepId]
],
// ...
```

This shows us a more general pattern of Filter Expressions:

```javascript
[
    filter1,
    logicalOperator1,
    filter2,
    logicalOperator2,
    filter3,
    ...
]
```

Where `filterN` is in the format `[fieldName, operator, values]`, and `logicalOperatorN` is one of
`'and'` or `'or'`, depending on the logical relationship between the filters.

The UI equivalent of SuiteScript's Filter Expressions is checking the *Use Expressions* box in a
Saved Search's Criteria tab.
