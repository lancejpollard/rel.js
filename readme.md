
# Basic Relational Algebra Structure in JavaScript

Basically there are two things that need to happen here. First, we need to have a data structure which can represent a relational algebra "tree". Second is we need to create a DSL which makes it more intuitive for writing a query, basically like what the SQL standard is. But we don't want to use SQL because there are better ways of specifying queries, such as like GraphQL, or others.

The first piece is important (defining a relational algebra model), because it tells us which steps/actions we need to perform right out of the box. We can then take this relational algebra tree and start directly performing the pieces/steps of the overall query.

The second piece is important, because it should be easy to read and write, and also easy to serialize into JSON, and then transform into the relational algebra form. Ideally you shouldn't need to know exactly how to write the relational algebra form, but the system would take your query in a nice DSL JSON object, and convert it to the most optimal relational algebra form. However, I am not sure exactly how that would be done, that is in the realm of query planning and optimization, which also needs to take into account the physical layout of your data and do cost estimates to find a good relational algebra tree to end up with. That is for far future, when we can eventually figure it out.

In principle, you would from the browser create a DSL query, and send that to the backend. Then the backend would convert that query to a basic relational algebra tree. It would then somehow know about the state of all your shards and their properties, so it could optimize the relational algebra tree. Then it would evaluate the relational algebra tree basically, going step by step, requesting from various shards what it needs, and then sending results back to the app. So the browser would only care about the DSL, but the backend would also care about the relational algebra. The frontend could potentially also use the relational algebra if it wanted to perform an in-memory query like a real database would, as well.

Another thing I'd like to potentially do here is have the cost evaluator for the query. So it would take JSON describing the state of your database system (RAM each machine has, table sizes, average record sizes, IO times, etc.) and it would use this information to figure out the optimal query plan.

So basically:

1. query JSON structure to use in apps.
2. relational algebra tree to use for making queries.
3. transformer from query to relational algebra tree.
4. cost estimator, given JSON description of system.
5. query optimizer / simplifier, so it can make roughly optimal queries.

It won't actually perform the queries, that will be saved for somewhere else.

## DSL

Taking into account SQL and GraphQL (and other graph query languages like Gremlin), this section should ultimately land upon a robust query DSL using JSON-like syntax. It should literally be easiest to write in JavaScript, using JSON objects so it serializes nicely, not some alternative made-up syntax which we would then have to parse.

- SQL is _declarative_ (what)
- Relational algebra is _procedual_ (how)

## Relational Algebra Data Structure

This is still being figured out, but here is a rough approximation currently.

Some notes on [Relational Algebra math notation](https://github.com/lancejpollard/math-notation/blob/make/book.ipynb). Also, try seeing what relational algebra diagrams would look like by [converting SQL to relational algebra here](http://www.grammaticalframework.org/qconv/qconv-a.html).

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

_Note: Extended (Generalized) Projection allows for functions like count and min/max involving arithmetic expressions to be projected. So basically, you can do functions here too._

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

## SQL to Relational Algebra Examples

Perhaps could try [this tool](https://dbis-uibk.github.io/relax/landing) as well.

### Left Outer Join

Left outer join (also called just "left join") returns all the rows of the leftmost table and the matching rows for the rightmost table.

```sql
SELECT b.id, b.title, b.type, a.last_name AS author, t.last_name AS translator
FROM books b
LEFT OUTER JOIN authors a
ON b.author_id = a.id
LEFT OUTER JOIN translators t
ON b.translator_id = t.id
ORDER BY b.id
```

```
τ b.id
 π b.id, b.title, b.type, a.last_name → author, t.last_name → translator
  (ρ b books ⋈oL b.author_id = a.id
   ρ a authors ⋈oL b.translator_id = t.id
    ρ t translators)
```

![https://imgur.com/tc7lOxu.png](https://imgur.com/tc7lOxu.png)

### Right Outer Join

Right join (also called just "right join") returns all the rows of the rightmost table of and the matching rows for the leftmost table.

```sql
SELECT b.id, b.title, e.last_name AS editor
FROM books b
RIGHT OUTER JOIN editors e
ON b.editor_id = e.id
ORDER BY b.id
```

```
τ b.id
 π b.id, b.title, e.last_name → editor
  (ρ b books ⋈oR b.editor_id = e.id
   ρ e editors)
```

![https://imgur.com/vsrWMcm.png](https://imgur.com/vsrWMcm.png)

### Full Outer Join

Full join returns all records when there is a match in either the left table or right table.

```sql
SELECT b.id, b.title, a.last_name AS author, e.last_name AS editor, t.last_name AS translator
FROM books b
FULL OUTER JOIN authors a
ON b.author_id = a.id
FULL OUTER JOIN editors e
ON b.editor_id = e.id
FULL OUTER JOIN translators t
ON b.translator_id = t.id
ORDER BY b.id
```

```
τ b.id
 π b.id, b.title, a.last_name → author, e.last_name → editor, t.last_name → translator
  (ρ b books ⋈o b.author_id = a.id
   ρ a authors ⋈o b.editor_id = e.id
    ρ e editors ⋈o b.translator_id = t.id
     ρ t translators)
```

![https://imgur.com/wzvswte.png](https://imgur.com/wzvswte.png)

### Inner Join

Inner join returns dataset that have matching values in both tables.

```sql
SELECT b.id, b.title, a.first_name, a.last_name
FROM books b
INNER JOIN authors a
ON b.author_id = a.id
ORDER BY b.id
```

```
τ b.id
 π b.id, b.title, a.first_name, a.last_name
  (ρ b books ⋈ b.author_id = a.id
   ρ a authors)
```

[![https://imgur.com/xrKeK6x.png](https://imgur.com/xrKeK6x.png)](https://learnsql.com/blog/sql-join-examples-with-explanations/)

### Join

```sql
SELECT b.id, b.title, b.type, t.last_name AS translator
FROM books b
JOIN translators t
ON b.translator_id = t.id
ORDER BY b.id
```

```
τ b.id
 π b.id, b.title, b.type, t.last_name → translator
  (ρ b books ⋈ b.translator_id = t.id
   ρ t translators)
```

![https://imgur.com/bwfKEF8.png](https://imgur.com/bwfKEF8.png)

### Group By

```sql
SELECT agents.agent_code, agents.agent_name, SUM(orders.advance_amount)
FROM agents, orders
WHERE agents.agent_code = orders.agent_code
GROUP BY agents.agent_code, agents.agent_name
ORDER BY agents.agent_code
```

```
τ agents.agent_code
 γ agent_code, agent_name, SUM(advance_amount)
  σ agents.agent_code = orders.agent_code (agents × orders)
```

![https://imgur.com/My9iV3D.png](https://imgur.com/My9iV3D.png)

### Count + Nested Select + Union + Join

```sql
SELECT name, COUNT(*)
FROM
 (SELECT name
  FROM videos_games
  INNER JOIN game_tags
  ON game_tags.game_id = videos_games.id
  WHERE game_tags.id IN(10, 3)
  UNION ALL
  SELECT name
  FROM videos_games
  INNER JOIN games_genres
  ON games_genres.game_id = videos_games.id
  WHERE games_genres.id IN(17, 22)) AS nameslist
GROUP BY NAME
ORDER BY COUNT(*) DESC
```

```
τ COUNT (*) ↓
 γ name, COUNT (*)
  ρ nameslist
   (π name
    σ game_tags.id = 10 OR game_tags.id = 3 (videos_games ⋈ game_tags.game_id = videos_games.id game_tags) ∪
     π name
      σ games_genres.id = 17 OR games_genres.id = 22 (videos_games ⋈ games_genres.game_id = videos_games.id games_genres))
```

![https://imgur.com/ZlL9nMS.png](https://imgur.com/ZlL9nMS.png)

### Intersect

```sql
SELECT supplier_id
FROM suppliers
WHERE supplier_id > 78
INTERSECT
SELECT supplier_id
FROM orders
WHERE quantity <> 0
```

```
π supplier_id
 σ supplier_id > 78 suppliers ∩
  π supplier_id
   σ quantity <> 0 orders
```

![https://imgur.com/lL0mX6E.png](https://imgur.com/lL0mX6E.png)

### Group by and Having

```sql
SELECT age, SUM(salary) FROM people
GROUP BY age
HAVING age = 30
```

```
σ age = 30
 γ age, SUM(salary) people
```

![https://imgur.com/SHF81sT.png](https://imgur.com/SHF81sT.png)

### Distinct

```sql
SELECT id, COUNT(DISTINCT(val)), COUNT(DISTINCT(found))
FROM (SELECT id, val, found FROM TEST_DATA) TMP
GROUP BY id
```

```
γ id, COUNT(\delta val), COUNT(\delta found)
 ρ tmp
  π id, val, found test_data
```

![https://imgur.com/Q1dpT8M.png](https://imgur.com/Q1dpT8M.png)

## Joins in More Detail

- https://dataschool.com/how-to-teach-people-sql/sql-join-types-explained-visually/
- https://dataschool.com/how-to-teach-people-sql/full-outer-join-animated/
- https://www.educative.io/blog/what-are-sql-joins

## Notes

Two relational algebra expressions are said to be
equivalent if on every legal database instance the
two expressions generate the same set of tuples.

- for CNF, convert to negation normal form with De Morgan laws then distribute OR over AND
- for DNF, convert to negation normal form with De Morgan laws then distribute AND over OR

You only need select, project, and rename. The joins can be defined in terms of those.

Aggregation function takes a collection of values and
returns a single value as a result.

- avg: average value
- min: minimum value
- max: maximum value
- sum: sum of values
- count: number of values

Pure relational algebra removes all duplicates, e.g. after projection.
_Multiset_ relational algebra retains duplicates, to match SQL
semantics.

Thanks to [this nice presentation](http://itu.dk/~mogel/SIDD2012/lectures/SIDD.2012.05.pdf) from _Rasmus Ejlers Møgelberg_, we have a mapping from SQL statements to relational algebra.

### Select

```
select name, salary from instructor
```
```
Π{name, salary}(instructor)
```

```
select * from instructor where salary > 90000;
```
```
σ{salary>90000}(instructor)
```

```
select name, dept_name from instructor
where salary > 90000;
```

```
Π{name, dept_name}(σ{salary>90000}(instructor))
```

Relational algebra expression says:

- First do selection
- Then do projection

(i.e., start from leaves and work your way back to the base).

```
-- cartesian product
select * from instructor, department;
```

```
instructor × department
```

```
select * from student join advisor on s_ID = ID;
```

```
student ⋈{(ID=s ID)} advisor
```

```
select avg(salary), dept_name from instructor
group by dept_name;
```

```
{dept_name}G{average}(salary)
```

r ⋈ s is defined as:
```
∏{r.A, r.B, r.C, r.D, s.E}(σ{r.B = s.B ∧ r.D = s.D}(r x s))
```
