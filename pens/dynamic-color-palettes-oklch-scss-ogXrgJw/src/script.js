document.querySelectorAll('.colors').forEach((color) => {
  const input = color.querySelector('input');
  const role = new Array(...color.classList)[1];
  input.addEventListener('change', (event) => {
    document.documentElement.style.setProperty('--md-ref-' + role, event.target.value);
    
  })
})

base.addEventListener('change', (event) => {
  document.documentElement.style.setProperty('--chroma-base-input', event.target.value)
})
