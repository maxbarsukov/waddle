# Waddle

[![Build Status](https://github.com/maxbarsukov/waddle/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/maxbarsukov/waddle/actions/workflows/main.yml)
[![Codecov](https://codecov.io/gh/maxbarsukov/waddle/branch/master/graph/badge.svg?token=DAVZ1WBI7Q)](https://codecov.io/gh/maxbarsukov/waddle)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/maxbarsukov/waddle)

***Waddle*** is a strongly-typed *object-oriented* toy programming language whose syntax is partially inspired by **Kotlin** and **Ruby**.

- Object-oriented language.
- Statically typed language with **type inference**.
- The *last value evaluated in a method is its return value*.
- ***Everything is an object***.

## Documentation

Have a look in the [examples](https://github.com/maxbarsukov/waddle/tree/master/docs) directory to learn more.

## Installation

    $ npm install -g waddle

## Usage

Run **Repl**:
```bash
waddle
```

or run file:
```bash
waddle examples/hello.waddle
```

## Examples of code

Basic:
```kotlin
// comment

"This is a string" // res0: String = "This is a string"
"Hello, " + "Max" // res1: String = "Hello, Max"

1 + 2 // => res2: Int = 3
-2 * 3 + (1 - 2) // res3: Int = -7

2e4 // res4: Double = 20000
3.14 // res5: Double = 3.14

10.toString() // res6: String = "10"
15.+(1).*(3) // res7: Int = 48

if (true) "true" else "false" // res8: String = "true"
if ("hello" == "he" + "llo") {
  42
} else {
  -1 
} // res9: Int = 42

"hello".length() // res10: Int = 5
"how are you?".at(2) // res11: String = "w"
"abscde".replace("a", "111") // res12: String = "111bscde"

null // res13: Null = null
null.toString()

100.unary_-() // res14: Int = -100
```

Booleans  :
```kotlin
true // res0: Bool = true
false // res1: Bool = false
!false // res2: Bool = true
1 >= 3 // res4: Bool = false
2 == "hey" // res5: Bool = false
true || false // res6: Bool = true
true && true // res7: Bool = true
false.unary_!() // res8: Bool = true
```

Let:
```kotlin
let message: String = "Hello, World!" in {
  IO.println(message)
}
// type inference
let message = "Hello, World!" in {
  IO.println(message)
}

let a = 2, b = 3 in {
  a + b
} // res0: Int = 5

let a = 2, b = 3 in a + b // res1: Int = 5
```

While:
```kotlin
let i = 1 in {
  while (i <= 10) {
    IO.println(i)
    i += 1
  }
} // 1 2 3 4 5 6 7 8 9 10
```

Variables:
```kotlin
var message: String = "Hello" // message: String = Hello!
// type inference
var message1 = "Hello, World!" // message1: String = Hello!
```

Functions:
```kotlin
def add(a: Int, b: Int): Int = {
  a + b
}
// add(a: Int, b: Int): Int
add(42, 1) // res0: Int = 43

def add2(a: Int, b: Int): Int = a + b
// add2(a: Int, b: Int): Int
add2(42, 1) // res0: Int = 43

def sayHi() = IO.println("Hi!")
sayHi() // Hi!
```

IO:
```kotlin
IO.println(1 + 2) // 3
IO.println(-2 * 3 + (1 - 2)) // -7
```

Math:
```kotlin
Math // Math: Math$ = Math$@0
Math.pi() // res0: Double = 3.141592653589793
Math.log2(16) // res1: Double = 4
Math.max(16, 42) // res10: Int = 42
```

OOP:
```kotlin
class Person(firstname: String, lastname: String) {
  var age: Int = 0
  
  def firstname(): String = {
    firstname
  }
  
  def setFirstname(name: String) = {
    firstname = name
  }
  
  def whoIsPrivate() = {
    IO.println(somePrivateMethod())
  }
  
  // override func
  override def toString(): String = {
    "Person(" + firstname + ", " + lastname + ")"
   }
  
  // functions are public by default
  // private func
  private def somePrivateMethod(): String = "I'm private!"
}

// inheritence
class Employee(
  firstname: String,
  lastname: String,
  company: String
) extends Person(firstname, lastname) {
  def company(): String = company
  def setCompany(c: String) = company = c
}

var person = new Person("John", "Doe") // person: Person = Person(John, Doe)

person.whoIsPrivate() // I'm private!
IO.println(person) // Person(John, Doe)

person.firstname() // res8: String = "John"
person.setFirstname("Max")
person.firstname() // res9: String = "Max"

var employee = new Employee("John", "Doe", "company")
employee.firstname() // res10: String = "John"
employee.company() // res11: String = "company"
```

Fraction class in ***Waddle***:
```kotlin
class Fraction(n: Int, d: Int) {
  var g: Int = gcd(Math.abs(n), Math.abs(d))

  var num: Int = n / g
  var den: Int = d / g

  def num(): Int = num
  def setNum(n: Int) = num = n / gcd(Math.abs(n), Math.abs(den))

  def den(): Int = den
  def setDen(d: Int) = den = d / gcd(Math.abs(num), Math.abs(d))

  def +(that: Fraction): Fraction = new Fraction(
        num * that.den() + den * that.num(),
        den * that.den()
      )

  def +(that: Int): Fraction = this + new Fraction(that, 1)

  def -(that: Fraction): Fraction = new Fraction(
        num * that.den() - den * that.num(),
        den * that.den()
      )

  def -(that: Int): Fraction = this - new Fraction(that, 1)
  def *(that: Fraction): Fraction = new Fraction(num * that.num(), den * that.den())
  def *(that: Int): Fraction = this * new Fraction(that, 1)
  def /(that: Fraction): Fraction = this * new Fraction(that.den(), that.num())
  def /(that: Int): Fraction = this / new Fraction(that, 1)

  override def ==(that: Object): Bool = {
      if (!that.instanceOf("Fraction"))
          false
      else {
          let frac = that as Fraction in {
              num == frac.num() && den == frac.den()
          }
      }
  }

  override def toString(): String = num + if (den > 1) "/" + den else ""

  private def gcd(a: Int, b: Int): Int = if (b == 0) a else gcd(b, a % b)
}
```

## Building

### Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/);

### Getting start

- Clone the repository
```bash
git clone --depth=1 https://github.com/maxbarsukov/waddle.git
```
- Install dependencies
```bash
cd waddle
npm install
```
- Run
```bash
npm run start
````
- **Tests**
```bash
npm test
```
- **Linting**
```bash
npm run lint
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/maxbarsukov/waddle. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/maxbarsukov/waddle/blob/master/CODE_OF_CONDUCT.md).

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Waddle project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/maxbarsukov/waddle/blob/master/CODE_OF_CONDUCT.md).
