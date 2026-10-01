class FabContainer {
  constructor() {
    this.element = document.getElementById("fab-container");
    this.close = document.getElementById("close");
    this.overlay = this.element.querySelector(".fab-overlay");

    this.close.addEventListener("click", () => this.collapse());

    setTimeout(() => container.toggle(), 1000);
    setTimeout(() => container.toggle(), 1500);
  }

  get isExpanded() {
    return this.element.classList.contains("expanded");
  }

  expand() {
    const { element, overlay } = this;
    if (!element.classList.contains("expanded")) {
      overlay.style.setProperty("--top", `${overlay.offsetTop}px`);
      overlay.style.setProperty("--left", `${overlay.offsetLeft}px`);
      element.classList.add("expanded");
      element.classList.remove("collapse");
    }
  }

  collapse() {
    this.element.classList.add("collapse");
    this.element.classList.remove("expanded");
  }

  toggle() {
    this.isExpanded ? this.collapse() : this.expand();
  }

  reset() {
    this.overlay.style.removeProperty('--top');
    this.overlay.style.removeProperty('--left');
  }
}

const container = new FabContainer();

class Fab {
  constructor() {
    this.element = document.getElementById("fab");
  }
}

const fab = new Fab();
fab.element.addEventListener("click", () => {
  container.expand();
});

window.addEventListener("resize", () => {
  container.reset();
});
