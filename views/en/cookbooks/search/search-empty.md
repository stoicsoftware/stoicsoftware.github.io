---
chapterTitle: 'Filtering by Empty Fields'
---

It is often the case that we will need to search for an empty field. How we filter for empty fields will vary 
depending on the type of field.

## Empty Text-Like Fields

Let's look first at text fields by finding all Customers that _don't_ have an email address:

```javascript
/**
 * Creates and executes a Customer search that finds all Customers with no email
 */
require(['N/search'], function (search) {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
      ['email', search.Operator.ISEMPTY, '']
    ],
    columns: ['entityid', 'email']
  });

  customerSearch.run().each(printCustomerName);

  function printCustomerName(result) {
    console.log(result.getValue({name: 'entityid'}));
    return true;
  }
});
```

Text fields have an Operator called `ISEMPTY` that matches empty fields.

```javascript
['email', search.Operator.ISEMPTY, '']
```

Note that the empty String `''` value is required even when we use `ISEMPTY`. If you forget this value, you will 
receive an Error with a message similar to `Wrong parameter type: filters is expected as Array.`

## Empty Select Fields

Select fields (dropdowns) do not have the same `ISEMPTY` Operator, so we need to specify our filter differently. 
NetSuite has made up a special `@NONE@` value for empty Select fields. Let's modify our example to locate all Customers 
with no assigned Sales Rep:

```javascript
require(['N/search'], function (search) {
  const customerSearch = search.create({
    type: search.Type.CUSTOMER,
    filters: [
      ['salesrep', search.Operator.ANYOF, '@NONE@']
    ],
    columns: ['entityid', 'email']
  });

  customerSearch.run().each(printCustomerName);

  function printCustomerName(result) {
    console.log(result.getValue({name: 'entityid'}));
    return true;
  }
});
```

We use the special `@NONE@` value to filter on an empty Select field. If we want records where the specified field 
*is empty* to match, we use `ANYOF` and `@NONE@`. If instead we want records where the specified field *is not 
empty* to match, we would use `NONEOF` and `@NONE@`.

To determine which Search Operators are available for specific Field Types, see the
[Search Operators](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_4094344956.html) documentation.
