WARNING (by Clay Ferguson, meta64 dev): 

The meta64 project has a hacked SystemJS implementation because of the two following lines
of code that had to be put in the "fetchFetch()" function in order to support cache busting.

if (systemJsCacheBuster) {
	  url += systemJsCacheBuster;
}

==========================================================
Update... (after above hack had been in place for a while)

Here's the online thread about this that I also contributed to:

https://github.com/systemjs/systemjs/issues/172

As Guy Bedfort posted on Feb. 9, there is this solution that he says works which I have not yet tried:

let resolve = System[System.constructor.resolve];

System[System.constructor.resolve] = function (key, parentKey) {
  return resolve.call(this, key, parentKey).then(function (resolved) {
    return resolved + '?cache';
  });
};

todo-0: try Guy's solution above.
