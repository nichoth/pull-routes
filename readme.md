## goals
From a high level our goal is to reduce complexity. What makes this complicated?

* all app code should be declarative. Any time our code says *how* to do something (imperative code), a bug will probably be introduced.
* don't write any async code. It's harder to think about. We are dealing with side effects & mutation.
* no duplication
