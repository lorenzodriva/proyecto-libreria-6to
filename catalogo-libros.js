const STORAGE_KEY = 'libreria-libros';

const libroMasPopular = {
    id: 999,
    titulo: 'La Biblia 2',
    autor: 'Ricardo Fort',
    precio: 'USD 1.50',
    img: 'https://i1.whakoom.com/small/29/1b/912b88072b38420db2dc44df95cc0c5e.jpg',
    generos: ['Terror', 'Comedia', 'Romance', 'Otros'],
    descripcion: 'Una historia intensa, atrapante y de gran impacto para los lectores más curiosos.',
    estado: 'Publicado'
};

const librosIniciales = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', precio: 'USD 12.99', img: 'https://via.placeholder.com/400x300?text=Cien+a%C3%B1os', generos: ['Realismo mágico'], descripcion: 'Una novela épica y compleja.', estado: 'Publicado' },
    { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', precio: 'USD 9.50', img: 'https://via.placeholder.com/400x300?text=Don+Quijote', generos: ['Clásico'], descripcion: 'La obra más emblemática de la literatura española.', estado: 'Publicado' },
    { id: 3, titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', precio: 'USD 11.00', img: 'https://via.placeholder.com/400x300?text=La+sombra', generos: ['Misterio'], descripcion: 'Un misterio lleno de evocación y nostalgia.', estado: 'Publicado' },
    { id: 4, titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', precio: 'USD 7.99', img: 'https://via.placeholder.com/400x300?text=Principito', generos: ['Infantil'], descripcion: 'Una reflexión poética y profunda.', estado: 'Publicado' },
    { id: 5, titulo: '1984', autor: 'George Orwell', precio: 'USD 8.75', img: 'https://via.placeholder.com/400x300?text=1984', generos: ['Distopía'], descripcion: 'Un clásico de la ciencia ficción política.', estado: 'Publicado' },
    { id: 6, titulo: 'La ciudad y los perros', autor: 'Mario Vargas Llosa', precio: 'USD 10.25', img: 'https://via.placeholder.com/400x300?text=La+ciudad', generos: ['Novela'], descripcion: 'Una obra brutal y realista.', estado: 'Publicado' }
];

function normalizarPrecioUSD(precio) {
    if (typeof precio !== 'string') {
        return `USD ${Number(precio || 0).toFixed(2)}`;
    }

    const limpio = precio.trim();
    if (!limpio) {
        return 'USD 0.00';
    }

    const conUSD = limpio.toUpperCase().startsWith('USD');
    const sinPrecio = limpio.replace(/[^0-9.]/g, '');
    const valor = Number(sinPrecio || 0);

    return conUSD ? `USD ${valor.toFixed(2)}` : `USD ${valor.toFixed(2)}`;
}

function getLibros() {
    const guardados = localStorage.getItem(STORAGE_KEY);

    if (!guardados) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(librosIniciales));
        return [...librosIniciales];
    }

    try {
        const parsed = JSON.parse(guardados);
        const normalizados = Array.isArray(parsed) ? parsed.map(libro => ({
            ...libro,
            precio: normalizarPrecioUSD(libro.precio)
        })) : [...librosIniciales];

        if (Array.isArray(parsed) && parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizados));
            return normalizados;
        }

        return [...librosIniciales];
    } catch (error) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(librosIniciales));
        return [...librosIniciales];
    }
}

function renderPopularBook() {
    const popularContainer = document.getElementById('libro-mas-popular');
    if (!popularContainer) return;

    popularContainer.innerHTML = `
        <div class="popular-book-card">
            <div class="popular-cover-wrap">
                <img src="${libroMasPopular.img}" alt="Portada de ${libroMasPopular.titulo}" class="popular-cover">
            </div>
            <div class="popular-info">
                <h3>${libroMasPopular.titulo}</h3>
                <p class="popular-author">${libroMasPopular.autor}</p>
                <p class="popular-genres">${libroMasPopular.generos.join(', ')}</p>
                <p class="popular-price">${libroMasPopular.precio}</p>
            </div>
        </div>
    `;
}

function crearCard(libro) {
    const card = document.createElement('article');
    card.className = 'card';

    const descripcion = libro.descripcion || 'Sin descripción disponible.';

    card.innerHTML = `
        <div class="card-image-wrap">
            <img src="${libro.img}" alt="Portada de ${libro.titulo}">
            <div class="card-description">
                <p>${descripcion}</p>
            </div>
        </div>
        <div class="info">
            <h3 class="title">${libro.titulo}</h3>
            <div class="meta">${libro.autor}</div>
            <div class="meta">${Array.isArray(libro.generos) ? libro.generos.join(', ') : 'Sin género'}</div>
            <div class="price">${libro.precio}</div>
            <div class="actions">
                <button class="btn btn-primary" type="button">Agregar</button>
                <button class="btn btn-secondary" type="button">Ver</button>
            </div>
        </div>
    `;

    return card;
}

function renderCatalogo() {
    const cont = document.getElementById('catalogo');
    if (!cont) return;

    const libros = getLibros();
    cont.innerHTML = '';
    libros.forEach(libro => cont.appendChild(crearCard(libro)));
}

function setupMenu() {
    const toggle = document.getElementById('menu-toggle');
    const panel = document.getElementById('creator-menu');
    const actionButton = document.getElementById('agregar-libro-btn');

    if (toggle && panel) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            panel.classList.toggle('hidden');
        });
    }

    if (actionButton) {
        actionButton.addEventListener('click', () => {
            window.location.href = 'agregar-libro.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    renderPopularBook();
    renderCatalogo();
});
