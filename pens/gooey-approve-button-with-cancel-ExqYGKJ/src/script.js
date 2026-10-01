let template = document.createElement("template");
template.innerHTML = `
<style>

button {
    text-transform: uppercase;
    cursor: pointer;
    color: color-mix(in srgb, var(--labs-sys-color-on-primary-container) calc(100% - var(--labs-button-disabled)), rgba(0,0,0,.1) var(--labs-button-disabled));
    padding: var(--labs-sys-size-5) var(--labs-sys-size-6);
    border: var(--labs-sys-size-0);
    border-radius: var(--labs-sys-shape-corner-extra-large);
    background: transparent; 
    font: var(--labs-sys-typescale-label-large-weight) var(--labs-sys-typescale-label-large-size) / var(--labs-sys-typescale-label-large-line-height) var(--labs-sys-typescale-label-large-font);
    letter-spacing: var(--labs-sys-typescale-label-large-tracking);
    position: relative;
    white-space: nowrap;
    background: var(--labs-sys-color-primary-container);    
    background:  color-mix(in srgb, var(--labs-sys-color-primary-container) calc(100% - var(--labs-button-disabled)), var(--color-quaternary) var(--labs-button-disabled));    
    transition: transform .45s ease-in-out, outline-color .2s linear;
    z-index: 1;
    user-select: none;
}

button:focus {
    outline-color: var(--color-tertiary);
    outline-style: solid;
}

.action {
    &:before {
        transform: translate3d(0,0,0);
        content: '';
        border-radius: inherit;
        position: absolute;
        inset: var(--labs-sys-size-00000);
        background: conic-gradient(from 100deg, var(--labs-sys-color-on-primary-container) var(--labs-button-progress),0, transparent calc(100% - var(--labs-button-progress)));
        z-index: -1;
    }
    
    &:after {
        content: '';
        border-radius: inherit;
        position: absolute;
        inset: var(--labs-sys-size-0);
        background: inherit;
        z-index: -1;
    }
}

.cancel {
    transform: translateX(calc(-50% + var(--labs-sys-size-4))) scale(.5);
    z-index: 0;
    width: var(--labs-sys-size-9);
    height: var(--labs-sys-size-9);
    display: grid;
    place-items: center;
    border-radius:var(--labs-sys-shape-corner-full);
    position: absolute;
    right: 0;
    font: var(--labs-sys-typescale-label-small-weight) var(--labs-sys-typescale-label-small-size) / var(--labs-sys-typescale-label-small-line-height) var(--labs-sys-typescale-label-small-font);
  letter-spacing: var(--labs-sys-typescale-label-small-tracking);
  
  &:before {
    content: 'x';
  }
  
  &.success {
      &:before {
        content: '✓';
        animation: zoom-in-out .35s ease-in-out;
      }
  }
}





.container {
display: flex;
width: min-content;
align-items: center;
filter: url(#goo);

    &.active {
        .action {
            pointer-events: none;
           
            &:before {
            animation: progress-bar var(--labs-button-duration) linear forwards;
            }
            animation: activate-action .3s ease-in-out forwards, action-press .3s cubic-bezier(0.71, 0.26, 0.62, 1.9);
            animation-delay: .2s, 0s;
        }
        .cancel {
           transform: translateX(calc(100% + var(--labs-sys-size-4))) scale(.9);
           pointer-events: all;
        }      
    }
    
    &.success {
        .cancel {
           transition-duration: 1.2s;
           transition-timing-function: ease-in-out;
           pointer-events: all;
        }     
    }
}

:host(.disabled) {
    pointer-events: none;
   
}

:host {
 filter:drop-shadow(0 0 .5rem rgba(0,0,0,.5))
}

@keyframes activate-action {
    from {
        --labs-button-disabled: 0%;
    }
    
    to {
        --labs-button-disabled: 60%;
    }
}

@keyframes action-press {
    from {
        transform: scale(1);
    }
    
    50% {
        transform: scale(.9);
    }
    
    to {
        transform: scale(1);
    }
}

@keyframes progress-bar {
  0% {
    --labs-button-progress: 0%;
  }
 
  100% {
    --labs-button-progress: 100%;
  }
}
@keyframes zoom-in-out {
  0% {
    transform: scale(1);
    filter: saturate(0);
  }
  
  50% {
      transform: scale(2);
      
  }
 
  100% {
    transform: scale(1.5);
    filter: saturate(1) brightness(1.5);
  }
}

.filter {
  display: block;
  width: 0; 
  height: 0;
  overflow: visible !important;
  position: absolute;
}
</style>
<div class="container">
<button class="action"><slot/></button>
<button class="cancel"></button>
</div>


<svg class="filter" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="9.5" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
      <feBlend in="SourceGraphic" in2="goo" />
  </filter>
  </defs>
</svg>
`;

const DELAY = "delay";
const SKIP_DELAY = 42;
const ACTIVE = "active";
const DISABLED = "disabled";
const SUCCESS = "success";
const CONTAINER = ".container";
const ACTION = ".action";
const CANCEL = ".cancel";

class DelayedMouseEvent extends MouseEvent {}

class LabsButton extends HTMLElement {
  isDelayed = () => this.hasAttribute(DELAY);
  active = null;
  static observedAttributes = ["delay"];

  constructor() {
    super();
    this.addEventListener("click", (e) => this.handleClick(e), {
      capture: true
    });

    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  handleClick(event) {
    if (event instanceof DelayedMouseEvent) {
      return; // skip
    }
    if (this.isDelayed()) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const container = this.shadowRoot.querySelector(CONTAINER);
      const action = container.querySelector(ACTION);
      const cancel = container.querySelector(CANCEL);
      container.classList.toggle(ACTIVE);
      container.classList.remove(SUCCESS);
      this.shadowRoot.host.classList.add(DISABLED);
      cancel.classList.remove(SUCCESS);
      if (this.active !== null) {
        clearTimeout(this.active);
        this.active = null;
        container.classList.remove(ACTIVE);
        this.shadowRoot.host.classList.remove(DISABLED);
        action.focus();
        return;
      }

      cancel.focus();
      this.active = setTimeout(() => {
        container.classList.remove(ACTIVE);
        container.classList.add(SUCCESS);
        cancel.classList.add(SUCCESS);
        this.shadowRoot.host.classList.remove(DISABLED);
        this.dispatchEvent(
          new DelayedMouseEvent("click", {
            bubbles: false,
            cancelable: true,
            detail: SKIP_DELAY
          })
        );
        this.active = null;
        action.focus();
      }, +this.getAttribute(DELAY));
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === DELAY) {
      const container = this.shadowRoot.querySelector(CONTAINER);
      container.style.setProperty("--labs-button-duration", `${newValue}ms`);
    }
  }
}

customElements.define("labs-button", LabsButton);

setTimeout(() => button.click(), 90);
