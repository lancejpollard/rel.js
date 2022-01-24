
# Basic Relational Algebra Structure in JavaScript

Basically there are two things that need to happen here. First, we need to have a data structure which can represent a relational algebra "tree". Second is we need to create a DSL which makes it more intuitive for writing a query, basically like what the SQL standard is. But we don't want to use SQL because there are better ways of specifying queries, such as like GraphQL, or others.

The first piece is important (defining a relational algebra model), because it tells us which steps/actions we need to perform right out of the box. We can then take this relational algebra tree and start directly performing the pieces/steps of the overall query.

The second piece is important, because it should be easy to read and write, and also easy to serialize into JSON, and then transform into the relational algebra form. Ideally you shouldn't need to know exactly how to write the relational algebra form, but the system would take your query in a nice DSL JSON object, and convert it to the most optimal relational algebra form. However, I am not sure exactly how that would be done, that is in the realm of query planning and optimization, which also needs to take into account the physical layout of your data and do cost estimates to find a good relational algebra tree to end up with. That is for far future, when we can eventually figure it out.

In principle, you would from the browser create a DSL query, and send that to the backend. Then the backend would convert that query to a basic relational algebra tree. It would then somehow know about the state of all your shards and their properties, so it could optimize the relational algebra tree. Then it would evaluate the relational algebra tree basically, going step by step, requesting from various shards what it needs, and then sending results back to the app. So the browser would only care about the DSL, but the backend would also care about the relational algebra. The frontend could potentially also use the relational algebra if it wanted to perform an in-memory query like a real database would, as well.

## DSL

Taking into account SQL and GraphQL (and other graph query languages like Gremlin), this section should ultimately land upon a robust query DSL using JSON-like syntax. It should literally be easiest to write in JavaScript, using JSON objects so it serializes nicely, not some alternative made-up syntax which we would then have to parse.

## Relational Algebra Data Structure

This is still being figured out, but here is a rough approximation currently.

Some notes on [Relational Algebra math notation](https://github.com/lancejpollard/math-notation/blob/make/book.ipynb).

### Not

```js
{
  type: 'not',
  base: path,
  expression: condition
}
```

### Attribute Comparison

```js
{
  type: 'gt',
  base: path,
  operation: string,
  head: path
}
```

- GT
- LT
- GTE
- LTE
- EQ

### Logical Combination

#### And Combination

```js
{
  type: 'and',
  expression: [...condition]
}
```

#### Or Combination

```js
{
  type: 'or',
  expression: [...condition]
}
```

### Selection

```js
{
  type: 'selection',
  condition: [...],
  table: 'name'
}
```

### Projection

```js
{
  field: [name, ...],
  selection: [selection]
}
```

### Renaming

```js
{
  type: 'renaming',
  mapping: [...relationRenamingMapping]
}
```

```js
{
  type: 'relation-renaming-mapping',
  base: string,
  head: string,
  attribute: [...attributeRenamingMapping]
}
```

```js
{
  type: 'attribute-renaming-mapping',
  base: string,
  head: string,
}
```

### Natural Join

```js
{
  type: 'natural-join',
  base: relation,
  head: relation,
}
```

### Theta Join

```js
{
  type: 'theta-join',
  base: relation,
  condition: condition,
  head: relation,
}
```

### Semi Join

1. Compute natural join of R and S.
2. Output the projection of that on just the attributes of R.

```js
{
  type: 'semi-join',
  base: relation,
  attribute: [...attribute],
  head: relation,
}
```

### Outer Join

### Union

### Set Difference

### Cross Product

### Intersection

### Division

### Send Operator

### Receive Operator

### Temp Operator

### Scan Operator

### Notes

Two relational algebra expressions are said to be
equivalent if on every legal database instance the
two expressions generate the same set of tuples.

- for CNF, convert to negation normal form with De Morgan laws then distribute OR over AND
- for DNF, convert to negation normal form with De Morgan laws then distribute AND over OR
