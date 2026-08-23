---
title: Getting Started with TypeScript fdf
description: >-
  A beginner-friendly guide to TypeScript fundamentals, covering types,
  interfaces, generics, and why you should consider using it in your next
  project.
date: 2025-01-10
tags:
  - TypeScript
  - JavaScript
  - Web Development
---
## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing and compiles to plain JavaScript, giving you better tooling and catching errors before they reach production.

## Why Use TypeScript?

JavaScript is dynamically typed, which means type errors only appear at runtime. TypeScript catches these errors during development, providing a better developer experience.

### Key Benefits

* **Early error detection** — catch bugs before running your code
* **Better IDE support** — autocompletion, navigation, and refactoring
* **Self-documenting code** — types serve as documentation
* **Safer refactoring** — the compiler tells you what broke

## Basic Types

```typescript
// Primitives
let name: string = "Erfan"
let age: number = 25
let isStudent: boolean = true

// Arrays
let hobbies: string[] = ["coding", "reading"]

// Objects
interface User {
  name: string
  age: number
  email?: string // optional
}

const user: User = {
  name: "Erfan",
  age: 25,
}
```

## Interfaces vs Types

Both interfaces and type aliases let you define shapes of objects. Interfaces are extendable, while type aliases can represent unions and intersections more naturally.

```typescript
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

type Cat = Animal & {
  lives: number
}
```

## Generics

Generics let you write reusable, type-safe code:

```typescript
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0]
}

const num = firstElement([1, 2, 3]) // type: number
const str = firstElement(["a", "b"]) // type: string
```

## Getting Started

To start a TypeScript project:

```bash
npm init -y
npm install -D typescript @types/node
npx tsc --init
```

Create a `tsconfig.json` with strict mode enabled for the best experience.

## Conclusion

TypeScript is a powerful tool that makes JavaScript development safer and more productive. Start small — add types gradually to your existing projects and see the benefits firsthand.
