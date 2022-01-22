
# Basic Relational Algebra Structure in JavaScript

## Not

```js
{
  type: 'not',
  base: path,
  expression: condition
}
```

## Attribute Comparison

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

## Logical Combination

### And Combination

```js
{
  type: 'and',
  expression: [...condition]
}
```

### Or Combination

```js
{
  type: 'or',
  expression: [...condition]
}
```

## Selection

```js
{
  type: 'selection',
  condition: [...],
  table: 'name'
}
```

## Projection

```js
{
  field: [name, ...],
  selection: [selection]
}
```

## Renaming

rBeersInfo(beer,maker)	Beers(name,	manuf)

## Natural Join

```js
{
  type: 'natural-join',
  base: relation,
  head: relation,
}
```

## Theta Join

```js
{
  type: 'theta-join',
  base: relation,
  condition: condition,
  head: relation,
}
```

## Semi Join

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

## Outer Join

## Union

## Set Difference

## Cross Product

## Intersection

## Division

## Notes

Two relational algebra expressions are said to be
equivalent if on every legal database instance the
two expressions generate the same set of tuples.
