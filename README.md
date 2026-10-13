# Calculator
A browser-based calculator built with vanilla HTML, CSS, and JavaScript. It handles chained operations, decimals, and keyboard input, and it doesn't crash when you divide by zero.


## Features
- Basic operations: addition, subtraction, multiplication, and division
- Chained calculations that evaluate one pair of numbers at a time (`12 + 7 - 1 = 18`)
- Decimal input, limited to one decimal point per number
- Backspace to undo the last input
- Clear button that fully resets the calculator
- Keyboard support
- Long decimal results are rounded so they never overflow the display
- A snarky error message for division by zero

## Project structure
```
calculator/
├── index.html   # Calculator layout and buttons
├── style.css    # Styling
├── script.js    # Calculator logic
└── README.md
```

## Built with
- HTML
- CSS
- JavaScript (no frameworks or libraries)

## What I learned
- Planning and managing state for an interactive UI
- Separating calculation logic from display updates
- Finding and fixing edge-case bugs
- Handling both click and keyboard events
- Committing early and often with clear commit messages

## Acknowledgments
This project is part of [The Odin Project](https://www.theodinproject.com/) curriculum.