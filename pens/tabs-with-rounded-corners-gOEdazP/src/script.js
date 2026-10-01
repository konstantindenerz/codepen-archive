(() => {
 const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
    })
  });
})()
