---
title: Note about Planner language
---

The name of Scheme (Schemer) comes from [Planner](<https://en.wikipedia.org/wiki/Planner_(programming_language)>).

- MIT AI Memos: [PLANNER: A Language for Manipulating Models and Proving Theorems in a Robot](https://dspace.mit.edu/handle/1721.1/6171)

```human
  Turing is a human
  All humans are fallible
so
  Turing is a fallible.
```

```planner
(ASSERT (HUMAN TURING))
(DEFINE THEOREM1
  (CONSEQUENT (X) (FALLIBLE ?X)
    (GOAL (HUMAN ?X))))
```

```cicada
judgment Human(String) {
  Human("turing")
  --------------- turing_is_a_human
}

judgment Fallible(String) {
  Fallible(x)
  ----------- all_humans_are_fallible
  Human(x)
}
```

To solve the goal Fallible("turing"),
is to search for a value of type Fallible("turing").

```
Fallible.all_humans_are_fallible(Human.turing_is_a_human)
```

is such a value. and the following is another way of writing it:

```
Fallible("turing")
------------------ Fallible.all_humans_are_fallible
Human("turing")
------------------ Human.turing_is_a_human
```
