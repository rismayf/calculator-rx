const { merge, fromEvent } = rxjs
const { map, takeUntil, tap, switchMap } = rxjs.operators

const numbers = document.querySelectorAll(".angka>button")
const operator = document.querySelectorAll(".operand>button")
const display = document.getElementById("display")

const plus  = operator[0]
const minus = operator[1]
const multi = operator[2]
const div   = operator[3]

const zero$  = fromEvent(numbers[9], 'click').pipe(map(() => 0))
const one$   = fromEvent(numbers[6], 'click').pipe(map(() => 1))
const two$   = fromEvent(numbers[7], 'click').pipe(map(() => 2))
const three$ = fromEvent(numbers[8], 'click').pipe(map(() => 3))
const four$  = fromEvent(numbers[3], 'click').pipe(map(() => 4))
const five$  = fromEvent(numbers[4], 'click').pipe(map(() => 5))
const six$   = fromEvent(numbers[5], 'click').pipe(map(() => 6))
const seven$ = fromEvent(numbers[0], 'click').pipe(map(() => 7))
const eight$ = fromEvent(numbers[1], 'click').pipe(map(() => 8))
const nine$  = fromEvent(numbers[2], 'click').pipe(map(() => 9))

const eq$    = fromEvent(numbers[10], 'click').pipe(map(() => "equal"))
const clear$    = fromEvent(numbers[11], 'click').pipe(map(() => "clear"))

const plus$  = fromEvent(plus, 'click').pipe(map(() => "+"))
const minus$ = fromEvent(minus, 'click').pipe(map(() => "-"))
const multi$ = fromEvent(multi, 'click').pipe(map(() => "*"))
const div$   = fromEvent(div, 'click').pipe(map(() => "/"))

const numbers$ = merge(zero$, one$, two$, three$, four$, five$, six$, seven$, eight$, nine$)
const operators$ = merge(plus$, minus$, multi$, div$)

// merge(numbers$, operator$).subscribe((val) => console.log(val))

let number1 = ''
let number2 = ''
let operand = null
let res = ''

const calculator$ = numbers$
.pipe(
    tap((number) => {
    number1 = number1 + number
    display.value = number1
    }),
    takeUntil(operators$),
    map((operator) => {
    return operator
    }),
    switchMap(() => {
        return operators$.pipe(
            tap((operator) => {
                operand = operator
                display.value = operand
            })
        )
    }),
    switchMap(() => {
        return numbers$.pipe(
            tap((number) => {
                number2 = number2 + number
                display.value = number2
                }),
                takeUntil(eq$),
                map((operator) => {
                return operator
            })
        )
    })
)

calculator$.subscribe((calc) => {
    console.log(number1, operand, number2)
})

eq$.subscribe((c) => {
    if (operand == "+") {
        res = parseInt(number1) + parseInt(number2)
    } else if (operand == "-") {
        res = parseInt(number1) - parseInt(number2)
    } else if (operand == "*") {
        res = parseInt(number1) * parseInt(number2)
    } else if (operand == "/") {
        res = parseInt(number1) / parseInt(number2)
    }
    display.value = res
})

clear$.subscribe((clear) => {
    // number1 = ''
    // number2 = ''
    // operand = null
    // display.value = ''
    console.log(number1, operand, number2)
    window.location.reload(true)
})
