const container = document.querySelector('.solution-list');
const items = document.querySelectorAll('.solution-list .solution-item');

items.forEach(item => {
  item.addEventListener('mouseenter', () => {
    container.classList.add('active');

    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });

  item.addEventListener('mouseleave', () => {
    container.classList.remove('active');

    items.forEach(i => i.classList.remove('active'));
  });
});