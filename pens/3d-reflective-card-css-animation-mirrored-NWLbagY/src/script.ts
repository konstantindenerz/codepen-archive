const card = document.querySelector('.card');
const reflection = document.querySelector('.reflection');
const reflectionCard = reflection.querySelector('.card');

const rotateClass = 'rotate'; // demo
const updateProperies = (ratioX,ratioY) => {
	card.style.setProperty('--ratio-x', ratioX);
	card.style.setProperty('--ratio-y', ratioY);
	reflection.style.setProperty('--ratio-x', ratioX);
	reflection.style.setProperty('--ratio-y', ratioY);
	reflectionCard.style.setProperty('--ratio-x', ratioX);
	reflectionCard.style.setProperty('--ratio-y', ratioY);
} 
const updatePointerPosition = ({ x, y }) => {
	card.classList.remove(rotateClass);
	reflectionCard.classList.remove(rotateClass)
	const rect = card.getBoundingClientRect();
	const hw = rect.width / 2;
	const hh = rect.height / 2;
	const ratioX = (x - (rect.x + hw)) / hw;
	const ratioY = (y - (rect.y + hh)) / hh;
	updateProperies(ratioX, ratioY);
};

card.addEventListener('pointermove', updatePointerPosition);

card.addEventListener('pointerleave', () => updateProperies(0,0));
