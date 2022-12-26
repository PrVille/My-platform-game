const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
  e: {
    pressed: false,
  },
  ctrl: {
    pressed: false,
  },
  esc: {
    pressed: false,
  },
  enter: {
    pressed: false,
  },
}

let lastKey = ""
this.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true
      lastKey = "w"
      break
    case "a":
      keys.a.pressed = true
      lastKey = "a"
      break
    case "s":
      keys.s.pressed = true
      lastKey = "s"
      break
    case "d":
      keys.d.pressed = true
      lastKey = "d"
      break
    case " ":
      keys.space.pressed = true
      lastKey = " "
      break
    case "q":
      keys.q.pressed = true
      lastKey = "q"
      break
    case "e":
      keys.e.pressed = true
      lastKey = "e"
      break
    case "Control":
      keys.ctrl.pressed = true
      lastKey = "Control"
      break
    case "Escape":
      keys.esc.pressed = true
      lastKey = "Escape"
      break
    case "Enter":
      keys.enter.pressed = true
      lastKey = "Enter"
      break
  }
})

this.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false
      break
    case "a":
      keys.a.pressed = false
      break
    case "s":
      keys.s.pressed = false
      break
    case "d":
      keys.d.pressed = false
      break
    case " ":
      keys.space.pressed = false
      break
    case "q":
      keys.q.pressed = false
      break
    case "e":
      keys.e.pressed = false
      break
    case "Control":
      keys.ctrl.pressed = false
      break
    case "Escape":
      keys.esc.pressed = false
      break
    case "Enter":
      keys.enter.pressed = false
      break
  }
})
