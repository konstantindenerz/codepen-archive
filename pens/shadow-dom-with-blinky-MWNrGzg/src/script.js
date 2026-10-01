/**
 * Inputs: --costume-* (colors)
 *
 */
class BlinkyComponent extends HTMLElement {
  static observedAttributes = ["costume"];
  overrides = new Map();

  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const ghost = document.createElement("div");
    ghost.classList.add("ghost", "blinky");
    ghost.setAttribute("part", "body");
    const style = document.createElement("style");
    style.textContent = `
    :host {
      border: .35rem dotted var(--dot);
      padding: 1rem;
    }
    @property --ghost-eye-size {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}
.ghost {
  --ghost-eye-size: 1;
  --ghost-chomp-color: transparent;
  display: grid;
  background: radial-gradient(calc(0.45rem * var(--ghost-eye-size)) calc(0.45rem * var(--ghost-eye-size)) at 0.85rem 1rem, var(--eye-color, var(--ghost-variant)) 50%, transparent 50%, transparent), radial-gradient(calc(0.45rem * var(--ghost-eye-size)) calc(0.45rem * var(--ghost-eye-size)) at 1.75rem 1rem, var(--eye-color, var(--ghost-variant)) 50%, transparent 50%, transparent), radial-gradient(calc(0.6rem * var(--ghost-eye-size)) calc(0.75rem * var(--ghost-eye-size)) at 0.75rem 1rem, white 50%, transparent 50%, transparent), radial-gradient(calc(0.6rem * var(--ghost-eye-size)) calc(0.75rem * var(--ghost-eye-size)) at 1.6rem 1rem, white 50%, transparent 50%, transparent), var(--ghost-color);
  -webkit-clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 99% 100%, 77% 86%, 58% 100%, 42% 84%, 27% 100%, 15% 84%);
          clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 99% 100%, 77% 86%, 58% 100%, 42% 84%, 27% 100%, 15% 84%);
  -webkit-animation: ghost-body 0.3s ease infinite;
          animation: ghost-body 0.3s ease infinite;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  width: 2rem;
  height: 2.4rem;
  margin-top: 0.35rem;
  left: 1rem;
  z-index: 8;
  place-items: center;
}
.ghost:after {
  content: "";
  background: var(--ghost-chomp-color, white);
  height: 0.4rem;
  width: 1.25rem;
  transform: translate(0.25rem, 0.5rem);
  -webkit-clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
          clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
  -webkit-animation: ghost-chomp 0.3s ease infinite;
          animation: ghost-chomp 0.3s ease infinite;
}
.ghost.pinky {
  --ghost-color: var(--ghost-color-variant, var(--ghost-1));
}
.ghost.clyde {
  --ghost-color: var(--ghost-color-variant, var(--ghost-2));
}
.ghost.inky {
  --ghost-color: var(--ghost-color-variant, var(--ghost-3));
}
.ghost.blinky {
  --ghost-color: var(--ghost-color-variant, var(--ghost-4));
}
.ghost.dizzied {
  --ghost-color: var(--ghost-variant);
  --ghost-color-variant: var(--ghost-variant);
  --ghost-eye-size: 0.5;
  --ghost-eye-color: transparent;
  --ghost-chomp-color: white;
}

@-webkit-keyframes ghost-body {
  from {
    -webkit-clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
            clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
  }
  50% {
    -webkit-clip-path: polygon(0% 75.25%, 0% 0%, 100% 0%, 100% 75.25%, 90.56% 90.56%, 83.3% 100%, 75.44% 90.56%, 65.96% 73.58%, 56.49% 90.56%, 49.96% 100%, 42.25% 91.5%, 31.23% 73.58%, 21.24% 92.09%, 14.98% 100%, 8.5% 91.5%);
            clip-path: polygon(0% 75.25%, 0% 0%, 100% 0%, 100% 75.25%, 90.56% 90.56%, 83.3% 100%, 75.44% 90.56%, 65.96% 73.58%, 56.49% 90.56%, 49.96% 100%, 42.25% 91.5%, 31.23% 73.58%, 21.24% 92.09%, 14.98% 100%, 8.5% 91.5%);
  }
  to {
    -webkit-clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
            clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
  }
}

@keyframes ghost-body {
  from {
    -webkit-clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
            clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
  }
  50% {
    -webkit-clip-path: polygon(0% 75.25%, 0% 0%, 100% 0%, 100% 75.25%, 90.56% 90.56%, 83.3% 100%, 75.44% 90.56%, 65.96% 73.58%, 56.49% 90.56%, 49.96% 100%, 42.25% 91.5%, 31.23% 73.58%, 21.24% 92.09%, 14.98% 100%, 8.5% 91.5%);
            clip-path: polygon(0% 75.25%, 0% 0%, 100% 0%, 100% 75.25%, 90.56% 90.56%, 83.3% 100%, 75.44% 90.56%, 65.96% 73.58%, 56.49% 90.56%, 49.96% 100%, 42.25% 91.5%, 31.23% 73.58%, 21.24% 92.09%, 14.98% 100%, 8.5% 91.5%);
  }
  to {
    -webkit-clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
            clip-path: polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 90.56% 90.56%, 82.44% 73.62%, 75.44% 90.56%, 65.13% 100%, 56.49% 90.56%, 47.44% 73.62%, 42.25% 91.5%, 31.22% 100%, 21.24% 92.09%, 15% 73.62%, 8.5% 91.5%);
  }
}
@-webkit-keyframes ghost-chomp {
  from {
    -webkit-clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
            clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
  }
  50% {
    -webkit-clip-path: polygon(0 5%, 22% 64%, 44% 5%, 61% 70%, 77% 6%, 99% 76%, 79% 33%, 61% 91%, 44% 37%, 21% 95%);
            clip-path: polygon(0 5%, 22% 64%, 44% 5%, 61% 70%, 77% 6%, 99% 76%, 79% 33%, 61% 91%, 44% 37%, 21% 95%);
  }
  to {
    -webkit-clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
            clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
  }
}
@keyframes ghost-chomp {
  from {
    -webkit-clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
            clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
  }
  50% {
    -webkit-clip-path: polygon(0 5%, 22% 64%, 44% 5%, 61% 70%, 77% 6%, 99% 76%, 79% 33%, 61% 91%, 44% 37%, 21% 95%);
            clip-path: polygon(0 5%, 22% 64%, 44% 5%, 61% 70%, 77% 6%, 99% 76%, 79% 33%, 61% 91%, 44% 37%, 21% 95%);
  }
  to {
    -webkit-clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
            clip-path: polygon(0% 77%, 24% 7%, 45% 47%, 63% 0%, 77% 45%, 94% 2%, 80% 76%, 63% 30%, 46% 90%, 25% 39%);
  }
}
@-webkit-keyframes ghost-move {
  from {
    transform: translateX(-15rem);
    --ghost-eye-size: 1;
    --ghost-chomp-color: transparent;
  }
  49.99% {
    transform: translateX(5rem);
    --ghost-eye-size: 1;
    --ghost-chomp-color: transparent;
    --ghost-color-variant: unset;
    --ghost-eye-color: unset;
  }
  50% {
    transform: translateX(7rem) scaleX(-1);
    --ghost-color-variant: var(--ghost-variant);
    --ghost-eye-size: 0.5;
    --ghost-eye-color: transparent;
    --ghost-chomp-color: white;
  }
  60% {
    transform: translateX(2rem) scaleX(-1);
  }
  to {
    transform: translateX(-15rem) scaleX(-1);
  }
}
@keyframes ghost-move {
  from {
    transform: translateX(-15rem);
    --ghost-eye-size: 1;
    --ghost-chomp-color: transparent;
  }
  49.99% {
    transform: translateX(5rem);
    --ghost-eye-size: 1;
    --ghost-chomp-color: transparent;
    --ghost-color-variant: unset;
    --ghost-eye-color: unset;
  }
  50% {
    transform: translateX(7rem) scaleX(-1);
    --ghost-color-variant: var(--ghost-variant);
    --ghost-eye-size: 0.5;
    --ghost-eye-color: transparent;
    --ghost-chomp-color: white;
  }
  60% {
    transform: translateX(2rem) scaleX(-1);
  }
  to {
    transform: translateX(-15rem) scaleX(-1);
  }
}`;
    shadow.appendChild(style);
    shadow.appendChild(ghost);
    for (let [key, value] of this.overrides) {
      ghost.style.setProperty(key, value);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "costume" && newValue !== null) {
      this.overrides.set("--ghost-color-variant", `var(--${name}-${newValue})`);
    } else {
      //       TODO remove
    }
  }
}

window.customElements.define("pacman-blinky", BlinkyComponent);
