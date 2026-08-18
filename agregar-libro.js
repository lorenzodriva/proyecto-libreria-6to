const STORAGE_KEY = 'libreria-libros';
const librosIniciales = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', precio: '$12.99', img: 'https://via.placeholder.com/400x300?text=Cien+a%C3%B1os', generos: ['Realismo mágico'], descripcion: 'Una novela épica y compleja.', estado: 'Publicado' },
    { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', precio: '$9.50', img: 'https://via.placeholder.com/400x300?text=Don+Quijote', generos: ['Clásico'], descripcion: 'La obra más emblemática de la literatura española.', estado: 'Publicado' },
    { id: 3, titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', precio: '$11.00', img: 'https://via.placeholder.com/400x300?text=La+sombra', generos: ['Misterio'], descripcion: 'Un misterio lleno de evocación y nostalgia.', estado: 'Publicado' }
];

function getLibros() {
    const guardados = localStorage.getItem(STORAGE_KEY);

    if (!guardados) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(librosIniciales));
        return [...librosIniciales];
    }

    try {
        const parsed = JSON.parse(guardados);
        return Array.isArray(parsed) && parsed.length ? parsed : [...librosIniciales];
    } catch (error) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(librosIniciales));
        return [...librosIniciales];
    }
}

function formatearPrecioUSD(valor) {
    const numero = Number(valor);
    if (Number.isNaN(numero)) return 'USD 0.00';
    return `USD ${numero.toFixed(2)}`;
}

function guardarLibros(libros) {
    const normalizados = libros.map(libro => ({
        ...libro,
        precio: typeof libro.precio === 'string' ? libro.precio.replace(/^\$\s*/, 'USD ') : formatearPrecioUSD(libro.precio)
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizados));
}

function obtenerGenerosSeleccionados() {
    return Array.from(document.querySelectorAll('.tag.selected')).map(tag => tag.dataset.genero);
}

function mostrarMensaje(texto, tipo = 'error') {
    const message = document.getElementById('message');
    if (!message) return;

    message.textContent = texto;
    message.classList.toggle('success', tipo === 'success');
}

function obtenerTituloNormalizado(texto) {
    return texto.trim().toLowerCase();
}

function existeTituloDuplicado(titulo) {
    const tituloNormal = obtenerTituloNormalizado(titulo);
    return getLibros().filter(libro => obtenerTituloNormalizado(libro.titulo) === tituloNormal);
}

function actualizarDuplicados() {
    const titulo = document.getElementById('titulo')?.value || '';
    const duplicadoContainer = document.getElementById('duplicado-container');
    const select = document.getElementById('duplicadoLibro');
    const coincidencias = existeTituloDuplicado(titulo);

    if (!duplicadoContainer || !select) return;

    if (titulo.trim() && coincidencias.length > 0) {
        duplicadoContainer.classList.remove('hidden');
        const opciones = [
            '<option value="">Seleccionar</option>',
            ...coincidencias.map(libro => `<option value="${libro.id}">${libro.titulo}</option>`),
            '<option value="otro">Otro</option>'
        ];
        select.innerHTML = opciones.join('');
    } else {
        duplicadoContainer.classList.add('hidden');
        select.innerHTML = '<option value="">Seleccionar</option>';
    }
}

function validarFormulario() {
    const titulo = document.getElementById('titulo')?.value.trim() || '';
    const urlImagen = document.getElementById('urlImagen')?.value.trim() || '';
    const autor = document.getElementById('autor')?.value.trim() || '';
    const descripcion = document.getElementById('descripcion')?.value.trim() || '';
    const precio = document.getElementById('precio')?.value.trim() || '';
    const generos = obtenerGenerosSeleccionados();
    const duplicadoSelect = document.getElementById('duplicadoLibro');
    const duplicadoContainer = document.getElementById('duplicado-container');
    const coincidencias = existeTituloDuplicado(titulo);
    const duplicadoVisible = !!duplicadoContainer && !duplicadoContainer.classList.contains('hidden');

    const faltantes = [];

    if (!titulo) faltantes.push('nombre');
    if (!urlImagen) faltantes.push('foto del libro');
    if (!generos.length) faltantes.push('género');
    if (!autor) faltantes.push('autor');
    if (!descripcion) faltantes.push('descripción');
    if (!precio || Number(precio) <= 0) faltantes.push('precio');
    if (coincidencias.length > 0 && duplicadoVisible && duplicadoSelect && !duplicadoSelect.value) {
        faltantes.push('qué libro es');
    }

    return {
        valido: faltantes.length === 0,
        faltantes
    };
}

function actualizarVistaPrevia() {
    const previewBtn = document.getElementById('previewBtn');
    const resultado = validarFormulario();
    if (previewBtn) {
        previewBtn.disabled = !resultado.valido;
    }
}

function construirLibroDesdeFormulario() {
    const titulo = document.getElementById('titulo').value.trim();
    const urlImagen = document.getElementById('urlImagen').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const precioValor = Number(document.getElementById('precio').value);
    const generos = obtenerGenerosSeleccionados();
    const libros = getLibros();
    const nuevoId = libros.length ? Math.max(...libros.map(libro => Number(libro.id) || 0)) + 1 : 1;

    return {
        id: nuevoId,
        titulo,
        autor,
        descripcion,
        precio: formatearPrecioUSD(precioValor),
        img: urlImagen,
        generos,
        estado: 'En revisión'
    };
}

function renderPreview() {
    const preview = document.getElementById('preview-book');
    const modal = document.getElementById('preview-modal');
    if (!preview || !modal) return;

    const libro = construirLibroDesdeFormulario();
    preview.innerHTML = `
        <img src="${libro.img}" alt="Portada de ${libro.titulo}">
        <div class="preview-title">${libro.titulo}</div>
        <div class="preview-meta">${libro.autor} · ${libro.generos.join(', ')}</div>
        <div class="preview-description">${libro.descripcion}</div>
        <div class="preview-meta"><strong>Precio:</strong> ${libro.precio}</div>
        <div class="preview-meta"><strong>Estado:</strong> ${libro.estado}</div>
    `;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

function manejarSubmit(event) {
    event.preventDefault();
    const resultado = validarFormulario();

    if (!resultado.valido) {
        mostrarMensaje(`Faltan completar: ${resultado.faltantes.join(', ')}.`, 'error');
        return;
    }

    const libros = getLibros();
    const nuevoLibro = construirLibroDesdeFormulario();
    libros.push(nuevoLibro);
    guardarLibros(libros);
    mostrarMensaje('Libro cargado correctamente.', 'success');

    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.remove('hidden');
        successModal.setAttribute('aria-hidden', 'false');
    }

    setTimeout(() => {
        window.location.href = 'home-libreria.html';
    }, 1400);
}

function setupForm() {
    const form = document.getElementById('libro-form');
    const previewBtn = document.getElementById('previewBtn');
    const cancelBtn = document.getElementById('cancelarBtn');
    const closePreview = document.getElementById('closePreview');
    const successModal = document.getElementById('success-modal');
    const titleInput = document.getElementById('titulo');

    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
            actualizarVistaPrevia();
            actualizarDuplicados();
        });
    });

    [
        document.getElementById('titulo'),
        document.getElementById('urlImagen'),
        document.getElementById('autor'),
        document.getElementById('descripcion'),
        document.getElementById('precio')
    ].forEach(element => {
        if (element) {
            element.addEventListener('input', () => {
                actualizarVistaPrevia();
                actualizarDuplicados();
            });
        }
    });

    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            const resultado = validarFormulario();
            if (!resultado.valido) {
                mostrarMensaje(`Faltan completar: ${resultado.faltantes.join(', ')}.`, 'error');
                return;
            }
            renderPreview();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'home-libreria.html';
        });
    }

    if (closePreview) {
        closePreview.addEventListener('click', () => cerrarModal('preview-modal'));
    }

    if (form) {
        form.addEventListener('submit', manejarSubmit);
    }

    if (successModal) {
        successModal.addEventListener('click', () => cerrarModal('success-modal'));
    }

    if (titleInput) {
        titleInput.addEventListener('blur', actualizarDuplicados);
    }

    actualizarVistaPrevia();
    actualizarDuplicados();
}

document.addEventListener('DOMContentLoaded', setupForm);