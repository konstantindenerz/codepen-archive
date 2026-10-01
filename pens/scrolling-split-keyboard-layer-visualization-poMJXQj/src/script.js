const keyTemplate = document.createElement("template");
keyTemplate.innerHTML = `
    <div class="container">
        <div class="face top" data-value></div>
        <div class="face front" data-tag></div>
        <div class="face left"></div>
        <div class="face right"></div>
        <div class="face back"></div>
    </div>
`;

const TAG = "tag";
const VALUE = "value";

class Key extends HTMLElement {
  static observedAttributes = [TAG, VALUE];

  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(keyTemplate.content.cloneNode(true));
    const container = shadow.querySelector(".container");
    shadow.querySelector("[data-tag]").innerHTML = this.tag;
    shadow.querySelector("[data-value]").innerHTML = this.value;

    container.addEventListener("mousedown", () => {
      this.classList.add("keypress");
    });
    container.addEventListener("mouseup", () => {
      this.classList.remove("keypress");
    });
    container.addEventListener("mouseleave", (e) => {
      if (e.buttons > 0) {
        this.classList.remove("keypress");
      }
    });

    const style = document.createElement("style");
    style.textContent = `
    
.container {
  width: var(--width);
  height: var(--width);
  transform-style: preserve-3d;
  position: relative;
  transform: rotate3d(1, 0, 0, -90deg);

  .face {
    transform-style: preserve-3d;
    position: absolute;
    display: grid;
    place-items: center;
    font-size: 0.75rem;
    background: radial-gradient(
      circle at 50% -40%,
      var(--key-color),
      transparent 80%
    );
    border-radius: 0 0 var(--key-radius) var(--key-radius);
    opacity: 0.5;

    &.front {
      width: var(--width);
      height: calc(var(--height) - var(--key-height-delta));
      transform: translate3d(0, var(--key-height-delta), var(--depth-half));
    }

    &.back {
      width: var(--width);
      height: calc(var(--height) - var(--key-height-delta));
      transform: rotate3d(0, 1, 0, 180deg)
        translate3d(0, var(--key-height-delta), var(--depth-half));
    }

    &.left {
      width: var(--depth);
      height: calc(var(--height) - var(--key-height-delta));
      transform: rotate3d(0, 1, 0, -90deg)
        translate3d(0, var(--key-height-delta), var(--width-half));
    }

    &.right {
      width: var(--depth);
      height: calc(var(--height) - var(--key-height-delta));
      transform: rotate3d(0, 1, 0, 90deg)
        translate3d(0, var(--key-height-delta), var(--width-half));
    }

    &.top {
      width: var(--width);
      height: var(--depth);
      color: white;
      --key-color: rgba(255, 255, 255, 0.2);
      transform: rotate3d(1, 0, 0, 90deg)
        translate3d(0, 0, calc(var(--width-half) - var(--key-height-delta)));
      border-radius: var(--key-radius);
      border: 1px solid rgba(255, 255, 255, 0.13);
      opacity: 1;
      text-shadow: -1px -1px rgba(0, 0, 0, 0.3);

      background: radial-gradient(
        120% 120% at center,
        transparent,
        var(--key-color)
      );
    }
  }
}

:host {
  display: block;
  --key-radius: 0.5rem;
  --width: var(--key-width, 4rem);
  --depth: var(--key-depth, 4rem);
  --height: var(--key-height, 1rem);
  --width-half: calc(var(--width) / 2);
  --width-half-n: calc(var(--width) / -2);
  --depth-half: calc(var(--depth) / 2);
  --depth-half-n: calc(var(--depth) / -2);
  --width-n: calc(var(--width) * -1);
  --height-half: calc(var(--height) / 2);
  --height-half-n: calc(var(--height) / -2);
  position: relative;
  transform-style: preserve-3d;
  width: var(--width);
  height: var(--depth);
  cursor: pointer;
  user-select: none;
}
:host(.keypress){
    --key-height-delta: 0;
    animation: keypress 0.1s ease forwards;
}

@keyframes keypress {
  from {
    --key-height-delta: 0rem;
  }

  to {
    --key-height-delta: calc(var(--key-height) * 0.3);
  }
}
    `;
    shadow.appendChild(style);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }
}

customElements.define("labs-key", Key);

const splitKeyboardTemplate = document.createElement("template");
splitKeyboardTemplate.innerHTML = `
    
        <section class="left"></section>
        <section class="right"></section>
    
`;

class SplitKeyboard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(splitKeyboardTemplate.content.cloneNode(true));
    this.left = shadow.querySelector(".left");
    this.right = shadow.querySelector(".right");
    const style = document.createElement("style");
    style.textContent = `

:host {
  transform-style: preserve-3d;
  padding: 1rem 1rem 6rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  gap: calc(var(--key-width) * 2 + 2rem);

  &:after {
    transform-style: flat;
    background: #333;
    background: rgba(255, 255, 255, 0.08);
    background: linear-gradient(288deg, #e8d1a047, transparent);
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    --c1: 31%;
    mask-image: radial-gradient(
        82% 129% at 22% 40%,
        black var(--c1),
        transparent var(--c1)
      ),
      radial-gradient(
        82% 129% at 78% 40%,
        black var(--c1),
        transparent var(--c1)
      ),
      linear-gradient(to bottom, transparent 30%, black 30%),
      radial-gradient(
        126% 129% at 6% 118%,
        black var(--c1),
        transparent var(--c1)
      ),
      radial-gradient(
        126% 129% at 95% 118%,
        black var(--c1),
        transparent var(--c1)
      ),
      linear-gradient(
        to right,
        transparent 49%,
        black 49%,
        black 51%,
        transparent 51%
      );
    mask-composite: add, add, exclude, add;
    mask-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 70%;
    mask-position: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%,
      100% 100%;
    mask-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat,
      no-repeat;
    pointer-events: none;
  }

  &:before {
        pointer-events: none;
    transform-style: preserve-3d;
    background: rgba(255, 255, 255, 0.05);
    content: "";
    position: absolute;
    transform: translate3d(0.45rem, 0.45rem, -0.45rem);

    inset: 0;
    --c1: 31%;
    mask-image: radial-gradient(
        82% 129% at 22% 40%,
        black var(--c1),
        transparent var(--c1)
      ),
      radial-gradient(
        82% 129% at 78% 40%,
        black var(--c1),
        transparent var(--c1)
      ),
      linear-gradient(to bottom, transparent 30%, black 30%),
      radial-gradient(
        126% 129% at 6% 118%,
        black var(--c1),
        transparent var(--c1)
      ),
      radial-gradient(
        126% 129% at 95% 118%,
        black var(--c1),
        transparent var(--c1)
      ),
      linear-gradient(
        to right,
        transparent 49%,
        black 49%,
        black 51%,
        transparent 51%
      );
    mask-composite: add, add, exclude, add;
    mask-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 70%;
    mask-position: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%,
      100% 100%;
    mask-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat,
      no-repeat;

  }
}

.left {
  transform-style: preserve-3d;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 0.5rem;

  > labs-key:nth-child(5n + 1) {
    transform: translateY(calc(var(--key-depth)));
  }

  > labs-key:nth-child(5n + 2) {
    transform: translateY(calc(var(--key-depth) / 2.5));
  }

  > labs-key:nth-child(5n + 4) {
    transform: translateY(calc(var(--key-depth) / 3));
  }

  > labs-key:nth-child(5n + 5) {
    transform: translateY(calc(var(--key-depth) / 2));
  }

  > labs-key:nth-last-of-type(-2n + 2) {
    transform: translate3d(
        calc(var(--key-depth) / 2),
        calc(var(--key-depth) / 1.5),
        0
      )
      rotateZ(10deg);
  }

  > labs-key:nth-last-of-type(-2n + 1) {
    transform: translate3d(
        calc(var(--key-depth) / 1.5),
        calc(var(--key-depth)),
        0
      )
      rotateZ(20deg);
  }
}

.right {
  transform-style: preserve-3d;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 0.5rem;

  > labs-key:nth-child(5n + 1) {
    transform: translateY(calc(var(--key-depth) / 2));
  }

  > labs-key:nth-child(5n + 2) {
    transform: translateY(calc(var(--key-depth) / 3));
  }

  > labs-key:nth-child(5n + 4) {
    transform: translateY(calc(var(--key-depth) / 2.5));
  }

  > labs-key:nth-child(5n + 5) {
    transform: translateY(calc(var(--key-depth)));
  }

  > labs-key:nth-last-of-type(-2n + 2) {
    //border: 1px solid yellowgreen;
    transform: translate3d(
        calc(var(--key-depth) / -1.5),
        calc(var(--key-depth)),
        0
      )
      rotateZ(-20deg);
  }

  > labs-key:nth-last-of-type(-2n + 1) {
    //border: 1px solid magenta;
    transform: translate3d(
        calc(var(--key-depth) / -2),
        calc(var(--key-depth) / 1.5),
        0
      )
      rotateZ(-10deg);
  }
}
    `;
    shadow.appendChild(style);
  }

  processRow(row, element) {
    if (row === undefined) {
      return;
    }
    row.forEach((cell) => {
      if (cell === undefined) {
        const placeholder = document.createElement("div");
        element.appendChild(placeholder);
        return;
      }
      const key = document.createElement("labs-key");
      key.setAttribute("tag", cell.tag);
      key.setAttribute("value", cell.value);
      element.appendChild(key);
    });
  }

  setConfig(config) {
    const elements = [this.left, this.right];
    config.items.forEach((item) => {
      [
        item.slice(0, Math.ceil(item.length / 2)),
        item.slice(item.length / 2)
      ].forEach((group, index) => {
        const element = elements[index];
        this.processRow(group, element);
      });
    });
  }
}

customElements.define("labs-split-keyboard", SplitKeyboard);

// CONFIG
const configs = [
  {
    items: [
      [
        { value: "Q", tag: "&kp Q" },
        { value: "W", tag: "&kp W" },
        { value: "F", tag: "&kp F" },
        { value: "P", tag: "&kp P" },
        { value: "B", tag: "&kp B" },
        { value: "J", tag: "&kp J" },
        { value: "L", tag: "&kp L" },
        { value: "U", tag: "&kp U" },
        { value: "Y", tag: "&kp Y" },
        { value: "SQT", tag: "&kp SQT" }
      ],
      [
        { value: "A", tag: "&kp A" },
        { value: "R", tag: "&kp R" },
        { value: "S", tag: "&kp S" },
        { value: "T", tag: "&kp T" },
        { value: "G", tag: "&kp G" },
        { value: "M", tag: "&kp M" },
        { value: "N", tag: "&kp N" },
        { value: "E", tag: "&kp E" },
        { value: "I", tag: "&kp I" },
        { value: "O", tag: "&kp O" }
      ],
      [
        { value: "Z", tag: "&kp Z" },
        { value: "X", tag: "&kp X" },
        { value: "C", tag: "&kp C" },
        { value: "D", tag: "&kp D" },
        { value: "V", tag: "&kp V" },
        { value: "K", tag: "&kp K" },
        { value: "H", tag: "&kp H" },
        { value: "COMMA", tag: "&kp COMMA" },
        { value: "DOT", tag: "&kp DOT" },
        { value: "FSLH", tag: "&kp FSLH" }
      ],
      [
        undefined,
        undefined,
        undefined,
        { value: "Mo(NAV)", tag: "&mo NAV" },
        { value: "LSHIFT", tag: "&kp LSHIFT" },
        { value: "SPC", tag: "&kp SPC" },
        { value: "Mo(SYM)", tag: "&mo SYM" },
        undefined,
        undefined,
        undefined
      ]
    ]
  },
  {
    items: [
      [
        { value: "Q", tag: "&kp Q" },
        { value: "W", tag: "&kp W" },
        { value: "E", tag: "&kp E" },
        { value: "R", tag: "&kp R" },
        { value: "T", tag: "&kp T" },
        { value: "Y", tag: "&kp Y" },
        { value: "U", tag: "&kp U" },
        { value: "I", tag: "&kp I" },
        { value: "O", tag: "&kp O" },
        { value: "P", tag: "&kp P" }
      ],
      [
        { value: "A", tag: "&kp A" },
        { value: "S", tag: "&kp S" },
        { value: "D", tag: "&kp D" },
        { value: "F", tag: "&kp F" },
        { value: "G", tag: "&kp G" },
        { value: "H", tag: "&kp H" },
        { value: "J", tag: "&kp J" },
        { value: "K", tag: "&kp K" },
        { value: "L", tag: "&kp L" },
        { value: "SQT", tag: "&kp SQT" }
      ],
      [
        { value: "Z", tag: "&kp Z" },
        { value: "X", tag: "&kp X" },
        { value: "C", tag: "&kp C" },
        { value: "V", tag: "&kp V" },
        { value: "B", tag: "&kp B" },
        { value: "N", tag: "&kp N" },
        { value: "M", tag: "&kp M" },
        { value: "COMMA", tag: "&kp COMMA" },
        { value: "DOT", tag: "&kp DOT" },
        { value: "FSLH", tag: "&kp FSLH" }
      ],
      [
        undefined,
        undefined,
        undefined,
        { value: "Mo(NAV)", tag: "&mo NAV" },
        { value: "LSHIFT", tag: "&kp LSHIFT" },
        { value: "SPC", tag: "&kp SPC" },
        { value: "Mo(SYM)", tag: "&mo SYM" },
        undefined,
        undefined,
        undefined
      ]
    ]
  },
  {
    items: [
      [
        { value: "ESC", tag: "&kp ESC" },
        { value: "LALT+LEFT", tag: "&am LALT LEFT" },
        { value: "LCTRL+F", tag: "&am LCTRL F" },
        { value: "LALT+RIGHT", tag: "&am LALT RIGHT" },
        { value: "INS", tag: "&kp INS" },
        { value: "PG_UP", tag: "&kp PG_UP" },
        { value: "PG_DN", tag: "&kp PG_DN" },
        { value: "HOME", tag: "&kp HOME" },
        { value: "END", tag: "&kp END" },
        { value: "CAPS", tag: "&kp CAPS" }
      ],
      [
        { value: "LALT", tag: "&sk LALT" },
        { value: "LGUI", tag: "&sk LGUI" },
        { value: "RSHIFT", tag: "&kp RSHIFT" },
        { value: "LCTL", tag: "&sk LCTL" },
        { value: "RALT", tag: "&kp RALT" },
        { value: "LEFT", tag: "&kp LEFT" },
        { value: "DOWN", tag: "&kp DOWN" },
        { value: "UP", tag: "&kp UP" },
        { value: "RIGHT", tag: "&kp RIGHT" },
        { value: "DEL", tag: "&kp DEL" }
      ],
      [
        { value: "LGUI+Z", tag: "&am LGUI Z" },
        { value: "LGUI+X", tag: "&am LGUI X" },
        { value: "LGUI+C", tag: "&am LGUI C" },
        { value: "LGUI", tag: "&kp LGUI" },
        { value: "LGUI+V", tag: "&am LGUI V" },
        { value: "RET", tag: "&kp RET" },
        { value: "BSPC", tag: "&kp BSPC" },
        { value: "TAB", tag: "&kp TAB" },
        { value: "K_APP", tag: "&kp K_APP" },
        { value: "C_AC_PRINT", tag: "&kp C_AC_PRINT" }
      ],
      [
        undefined,
        undefined,
        undefined,
        { value: "RET", tag: "&kp RET" },
        { value: "Mo(FUN)", tag: "&mo FUN" },
        { value: "SPC", tag: "&kp SPC" },
        { value: "Mo(SYM)", tag: "&mo SYM" },
        undefined,
        undefined,
        undefined
      ]
    ]
  },
  {
    items: [
      [
        { value: "EXCL", tag: "&kp EXCL" },
        { value: "AT", tag: "&kp AT" },
        { value: "HASH", tag: "&kp HASH" },
        { value: "DLLR", tag: "&kp DLLR" },
        { value: "PRCNT", tag: "&kp PRCNT" },
        { value: "EQUAL", tag: "&kp EQUAL" },
        { value: "GRAVE", tag: "&kp GRAVE" },
        { value: "COLON", tag: "&kp COLON" },
        { value: "SEMI", tag: "&kp SEMI" },
        { value: "PLUS", tag: "&kp PLUS" }
      ],
      [
        { value: "CARET", tag: "&kp CARET" },
        { value: "STAR", tag: "&kp STAR" },
        { value: "LPAR", tag: "&kp LPAR" },
        { value: "LBRC", tag: "&kp LBRC" },
        { value: "LBKT", tag: "&kp LBKT" },
        { value: "STAR", tag: "&kp STAR" },
        { value: "LPAR", tag: "&kp LPAR" },
        { value: "RPAR", tag: "&kp RPAR" },
        { value: "RBRC", tag: "&kp RBRC" },
        { value: "RBKT", tag: "&kp RBKT" }
      ],
      [
        { value: "BSLH", tag: "&kp BSLH" },
        { value: "PIPE", tag: "&kp PIPE" },
        { value: "AMPS", tag: "&kp AMPS" },
        { value: "TILDE", tag: "&kp TILDE" },
        { value: "MINUS", tag: "&kp MINUS" },
        { value: "UNDER", tag: "&kp UNDER" },
        { value: "TILDE", tag: "&kp TILDE" },
        { value: "FSLH", tag: "&kp FSLH" },
        { value: "AMPS", tag: "&kp AMPS" },
        { value: "MINUS", tag: "&kp MINUS" }
      ],
      [
        undefined,
        undefined,
        undefined,
        { value: "Trans", tag: "&trans" },
        { value: "Mo(NUMB)", tag: "&mo NUMB" },
        { value: "SPC", tag: "&kp SPC" },
        { value: "Mo(SYM)", tag: "&mo SYM" },
        undefined,
        undefined,
        undefined
      ]
    ]
  },
  {
    items: [
      [
        { value: "C_STOP", tag: "&kp C_STOP" },
        { value: "C_PREV", tag: "&kp C_PREV" },
        { value: "C_PP", tag: "&kp C_PP" },
        { value: "C_NEXT", tag: "&kp C_NEXT" },
        { value: "C_BRI_UP", tag: "&kp C_BRI_UP" },
        { value: "F12", tag: "&kp F12" },
        { value: "F7", tag: "&kp F7" },
        { value: "F8", tag: "&kp F8" },
        { value: "F9", tag: "&kp F9" },
        { value: "CLM", tag: "&to CLM" }
      ],
      [
        { value: "LALT", tag: "&sk LALT" },
        { value: "LGUI", tag: "&sk LGUI" },
        { value: "RSHIFT", tag: "&kp RSHIFT" },
        { value: "LCTL", tag: "&sk LCTL" },
        { value: "C_BRI_DN", tag: "&kp C_BRI_DN" },
        { value: "F11", tag: "&kp F11" },
        { value: "F4", tag: "&kp F4" },
        { value: "F5", tag: "&kp F5" },
        { value: "F6", tag: "&kp F6" },
        { value: "QWERTY", tag: "&to QWERTY" }
      ],
      [
        { value: "C_MUTE", tag: "&kp C_MUTE" },
        { value: "C_VOL_DN", tag: "&kp C_VOL_DN" },
        { value: "BSLH", tag: "&kp BSLH" },
        { value: "C_VOL_UP", tag: "&kp C_VOL_UP" },
        { value: "AMPS", tag: "&kp AMPS" },
        { value: "F10", tag: "&kp F10" },
        { value: "F1", tag: "&kp F1" },
        { value: "F2", tag: "&kp F2" },
        { value: "F3", tag: "&kp F3" },
        { value: "None", tag: "&none" }
      ],
      [
        undefined,
        undefined,
        undefined,
        { value: "RET", tag: "&kp RET" },
        { value: "Mo(FUN)", tag: "&mo FUN" },
        { value: "SPC", tag: "&kp SPC" },
        { value: "Mo(SYM)", tag: "&mo SYM" },
        undefined,
        undefined,
        undefined
      ]
    ]
  },
  {
    items: [
      [
        { value: "None", tag: "&none" },
        { value: "None", tag: "&none" },
        { value: "None", tag: "&none" },
        { value: "None", tag: "&none" },
        { value: "None", tag: "&none" },
        { value: "EQUAL", tag: "&kp EQUAL" },
        { value: "N7", tag: "&kp N7" },
        { value: "N8", tag: "&kp N8" },
        { value: "N9", tag: "&kp N9" },
        { value: "PLUS", tag: "&kp PLUS" }
      ],
      [
        { value: "LALT", tag: "&sk LALT" },
        { value: "LGUI", tag: "&sk LGUI" },
        { value: "RSHIFT", tag: "&kp RSHIFT" },
        { value: "LCTL", tag: "&sk LCTL" },
        { value: "None", tag: "&none" },
        { value: "STAR", tag: "&kp STAR" },
        { value: "N4", tag: "&kp N4" },
        { value: "N5", tag: "&kp N5" },
        { value: "N6", tag: "&kp N6" },
        { value: "MINUS", tag: "&kp MINUS" }
      ],
      [
        { value: "BT_CLR_ALL", tag: "&bt BT_CLR_ALL" },
        { value: "None", tag: "&none" },
        { value: "BT_CLR", tag: "&bt BT_CLR" },
        { value: "BT_PRV", tag: "&bt BT_PRV" },
        { value: "BT_NXT", tag: "&bt BT_NXT" },
        { value: "N0", tag: "&kp N0" },
        { value: "N1", tag: "&kp N1" },
        { value: "N2", tag: "&kp N2" },
        { value: "N3", tag: "&kp N3" },
        { value: "SLASH", tag: "&kp SLASH" }
      ],
      [
        undefined,
        undefined,
        undefined,
        { value: "RET", tag: "&kp RET" },
        { value: "Mo(NUMB)", tag: "&mo NUMB" },
        { value: "SPC", tag: "&kp SPC" },
        { value: "Mo(SYM)", tag: "&mo SYM" },
        undefined,
        undefined,
        undefined
      ]
    ]
  }
];

document.querySelectorAll("labs-split-keyboard").forEach((keyboard, index) => {
  keyboard.setConfig(configs[index]);
});

document.addEventListener("scrollsnapchange", (event) => {
  const target = event.snapTargetBlock;
  const activeIndex = Array.from(target.parentNode.children).indexOf(target);
  Array.from(layers.children).forEach((item, index) => {
    if (index < activeIndex) {
      item.classList.add("before");
      item.classList.remove("active");
    } else if (index === activeIndex) {
      item.classList.add("active");
      item.classList.remove("before");
    } else {
      item.classList.remove("active", "before");
    }
  });
});


setTimeout(() => document.documentElement.scrollTo({
  top: window.innerHeight,
  behavior: "smooth",
}),1000);
