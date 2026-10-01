const card = document.querySelector(".card");

const updatePointerPosition = ({ x, y }) => {
	card.classList.remove('rotate');
	const rect = card.getBoundingClientRect();
	const hw = rect.width / 2;
	const hh = rect.height / 2;
	const ratioX = (x - (rect.x + hw)) / hw;
	const ratioY = (y - (rect.y + hh)) / hh;
	card.style.setProperty("--ratio-x", ratioX);
	card.style.setProperty("--ratio-y", ratioY);
};

card.addEventListener("pointermove", updatePointerPosition);

card.addEventListener("pointerleave", () => {
	card.style.setProperty("--ratio-x", 0);
	card.style.setProperty("--ratio-y", 0);
});
