
function nestedJoin(R, S, compare) {
  const out = []

  for (const r of R) {
    for (const s of S) {
      if (compare(r, s)) {
        out.push([ r, s ])
      }
    }
  }

  return out
}

function indexJoin(R, S) {
  const out = []

  for (const r of R) {
    const X = findInIndex(S.C, r.c)
    for (const s of X) {
      out.push([ r, s ])
    }
  }

  return out
}

function hashJoin(R, S, rHashKey, sHashKey) {
  const RMap = new Map

  for (const r of R) {
    RMap.set(r[rHashKey], r)
  }

  const tuples = []

  for (const s of S) {
    const sHash = s[sHashKey]
    // get the post from the comment.postId
    const r = RMap.get(sHash)

    if (r) {
      tuples.push([ r, s ])
    }
  }

  return tuples
}
