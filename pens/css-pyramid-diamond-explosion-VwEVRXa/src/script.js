(() => {
  const object = document.getElementById("object");
  object.addEventListener("animationend", (event) => {
    if (event.animationName === "rotation") {
      object.classList.remove("expand");
    }
  });
  document.body.addEventListener("click", () => {
    if (object.classList.contains("expand")) {
      object.classList.remove("expand");
      setTimeout(() => {
        object.classList.add("expand");
      });
    } else {
      object.classList.add("expand");
    }
  });
})();
