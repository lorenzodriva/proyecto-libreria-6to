const libros = [
	{id:1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', precio: 'USD 12.99', img: 'https://via.placeholder.com/400x300?text=Cien+años'},
	{id:2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', precio: 'USD 9.50', img: 'https://via.placeholder.com/400x300?text=Don+Quijote'},
	{id:3, titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', precio: 'USD 11.00', img: 'https://via.placeholder.com/400x300?text=La+sombra'},
	{id:4, titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', precio: 'USD 7.99', img: 'https://via.placeholder.com/400x300?text=Principito'},
	{id:5, titulo: '1984', autor: 'George Orwell', precio: 'USD 8.75', img: 'https://via.placeholder.com/400x300?text=1984'},
	{id:6, titulo: 'La ciudad y los perros', autor: 'Mario Vargas Llosa', precio: 'USD 10.25', img: 'https://via.placeholder.com/400x300?text=La+ciudad'}
];

function crearCard(libro){
	const card = document.createElement('article');
	card.className = 'card';

	card.innerHTML = `
		<img src="${libro.img}" alt="Portada de ${libro.titulo}">
		<div class="info">
			<h3 class="title">${libro.titulo}</h3>
			<div class="meta">${libro.autor}</div>
			<div class="price">${libro.precio}</div>
			<div class="actions">
				<button class="btn btn-primary">Agregar</button>
				<button class="btn btn-secondary">Ver</button>
			</div>
		</div>
	`;

	return card;
}

function renderCatalogo(){
	const cont = document.getElementById('catalogo');
	if(!cont) return;
	cont.innerHTML = '';
	libros.forEach(libro => cont.appendChild(crearCard(libro)));
}

document.addEventListener('DOMContentLoaded', renderCatalogo);
