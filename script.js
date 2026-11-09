
/* =========================================
   1. CONFIGURACIÓN DE INTERESES
========================================= */

const TOPICS = [
    { id: 'deportes', label: 'Deportes y fútbol', emoji: '⚽' },
    { id: 'musica', label: 'Música y artistas', emoji: '🎵' },
    { id: 'humor', label: 'Humor y entretenimiento', emoji: '😂' },
    { id: 'moda', label: 'Moda y belleza', emoji: '✨' },
    { id: 'tecnologia', label: 'Tecnología', emoji: '💻' },
    { id: 'gaming', label: 'Videojuegos', emoji: '🎮' },
    { id: 'fitness', label: 'Entrenamiento y bienestar', emoji: '🏋️' },
    { id: 'viajes', label: 'Viajes', emoji: '🌍' },
    { id: 'negocios', label: 'Emprendimiento', emoji: '🚀' },
    { id: 'aprendizaje', label: 'Aprendizaje y tutoriales', emoji: '📚' },
    { id: 'noticias', label: 'Noticias y actualidad', emoji: '📰' }
];


/* =========================================
   2. CONFIGURACIÓN DE REDES SOCIALES
========================================= */

const NETWORKS = {

    instagram: {
        label: 'Instagram',
        emoji: '📸',
        description: 'Perfiles, reels e ideas para descubrir',
        topics: [
            'deportes', 'musica', 'humor', 'moda',
            'tecnologia', 'fitness', 'viajes',
            'negocios', 'aprendizaje'
        ]
    },

    tiktok: {
        label: 'TikTok',
        emoji: '🎬',
        description: 'Videos cortos y búsquedas sugeridas',
        topics: [
            'deportes', 'musica', 'humor', 'moda',
            'tecnologia', 'gaming', 'fitness',
            'viajes', 'aprendizaje'
        ]
    },

    whatsapp: {
        label: 'WhatsApp',
        emoji: '💬',
        description: 'Temas para buscar comunidades y canales',
        topics: [
            'deportes', 'musica', 'gaming', 'tecnologia',
            'fitness', 'negocios', 'aprendizaje', 'noticias'
        ]
    },

    facebook: {
        label: 'Facebook',
        emoji: '👥',
        description: 'Páginas, grupos y contenido',
        topics: [
            'deportes', 'musica', 'humor', 'moda',
            'gaming', 'viajes', 'negocios',
            'aprendizaje', 'noticias'
        ]
    },

    x: {
        label: 'X',
        emoji: '𝕏',
        description: 'Conversaciones, temas y actualidad',
        topics: [
            'deportes', 'musica', 'humor', 'tecnologia',
            'gaming', 'negocios', 'noticias', 'aprendizaje'
        ]
    }

};


/* =========================================
   3. ALMACENAMIENTO DE INFORMACIÓN
========================================= */

// Se utiliza localStorage para conservar los datos
// cuando el usuario cierra o actualiza la página.

const STORE = 'socialmatch_demo_v2';

function readState() {
    try {
        return JSON.parse(localStorage.getItem(STORE)) || {};
    } catch {
        return {};
    }
}

const stored = readState();

const state = {

    name: typeof stored.name === 'string'
        ? stored.name
        : '',

    network: NETWORKS[stored.network]
        ? stored.network
        : null,

    selected: Array.isArray(stored.selected)
        ? stored.selected.filter(id =>
            TOPICS.some(topic => topic.id === id)
        )
        : [],

    favorites: Array.isArray(stored.favorites)
        ? stored.favorites
        : [],

    history: Array.isArray(stored.history)
        ? stored.history
        : []

};


function persist() {
    try {
        localStorage.setItem(STORE, JSON.stringify(state));
    } catch (error) {
        console.warn('No se pudo guardar la información', error);
    }
}


/* =========================================
   4. FUNCIONES GENERALES
========================================= */

// Función para encontrar elementos HTML por su ID.

const $ = id => document.getElementById(id);


// Busca un interés dentro de la lista de temas.

function topic(id) {
    return TOPICS.find(item => item.id === id);
}


// Evita interpretar como HTML los textos dinámicos.

function safe(text) {
    return String(text).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}


/* =========================================
   5. NAVEGACIÓN ENTRE PÁGINAS
========================================= */

function showPage(id) {

    // Verifica que existan los datos necesarios.

    if (
        id === 'explore' &&
        (!state.network || !state.selected.length)
    ) {
        id = state.name ? 'networks' : 'home';
    }

    if (
        id === 'algorithm' &&
        (!state.network || !state.selected.length)
    ) {
        id = state.name ? 'networks' : 'home';
    }

    // Oculta todas las páginas y muestra la seleccionada.

    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === id);
    });

    // Actualiza la información de cada sección.

    if (id === 'favorites') {
        renderFavorites();
    }

    if (id === 'history') {
        renderHistory();
    }

    if (id === 'algorithm') {
        updateAlgorithm();
    }

    if (id === 'explore') {
        renderRecommendations();
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}


/* =========================================
   6. SELECCIÓN DE REDES SOCIALES
========================================= */

function renderNetworks() {

    $('network-greeting').textContent =
        `¡Hola, ${state.name}! 👋`;

    $('network-grid').innerHTML =
        Object.entries(NETWORKS).map(([id, network]) => `

            <button class="network-card" data-network="${id}">

                <span class="emoji">
                    ${network.emoji}
                </span>

                <strong>
                    ${network.label}
                </strong>

                <small>
                    ${network.description}
                </small>

            </button>

        `).join('');

}


function chooseNetwork(id) {

    state.network = id;

    // Conserva únicamente los intereses
    // disponibles en la red seleccionada.

    state.selected = state.selected.filter(
        interest => NETWORKS[id].topics.includes(interest)
    );

    persist();

    renderInterests();

    showPage('interests');

}


/* =========================================
   7. SELECCIÓN DE INTERESES
========================================= */

function renderInterests() {

    const network = NETWORKS[state.network];

    if (!network) return;

    $('interest-network').textContent =
        `${network.emoji} ${network.label.toUpperCase()} · TUS INTERESES`;

    $('interest-title').textContent =
        `${state.name}, ¿qué te gustaría encontrar en ${network.label}?`;

    $('interest-error').textContent = '';

    $('interest-grid').innerHTML =
        network.topics.map(id => {

            const interest = topic(id);

            const selected = state.selected.includes(id);

            return `

                <button
                    class="interest-card ${selected ? 'selected' : ''}"
                    data-topic="${id}"
                    aria-pressed="${selected}"
                >

                    <span class="emoji">
                        ${interest.emoji}
                    </span>

                    <strong>
                        ${interest.label}
                    </strong>

                    <small>
                        Seleccionar interés
                    </small>

                </button>

            `;

        }).join('');

}


// Agrega o quita intereses seleccionados.

function toggleTopic(id) {

    if (state.selected.includes(id)) {

        state.selected = state.selected.filter(
            interest => interest !== id
        );

    } else {

        state.selected.push(id);

    }

    persist();

    renderInterests();

}


/* =========================================
   8. RESUMEN DE PREFERENCIAS
========================================= */

function renderSummary() {

    $('summary-title').textContent =
        `¡Listo, ${state.name}! 🎉`;

    $('summary-chips').innerHTML =
        state.selected.map(id => {

            const interest = topic(id);

            return `
                <span class="chip">
                    ${interest.emoji} ${interest.label}
                </span>
            `;

        }).join('');

}


/* =========================================
   9. MATRIZ DE CONTENIDOS
========================================= */

// Cada fila representa una idea de contenido.
// Cada columna representa un interés.
// Los valores van de 0 a 5 y son datos de demostración.

const CATALOG = [];

const TYPE = {

    instagram: 'Perfiles y reels',
    tiktok: 'Videos para buscar',
    whatsapp: 'Comunidades y canales para buscar',
    facebook: 'Páginas y grupos para buscar',
    x: 'Temas y conversaciones para buscar'

};


// Genera los contenidos disponibles para cada red.

for (const [network, information] of Object.entries(NETWORKS)) {

    for (const id of information.topics) {

        const interest = topic(id);

        CATALOG.push({

            id: `${network}-${id}`,

            network: network,

            topic: id,

            title: `Explora ${interest.label.toLowerCase()}`,

            description:
                `Ideas de ${TYPE[network].toLowerCase()} relacionados con ${interest.label.toLowerCase()}.`,

            emoji: interest.emoji,

            search:
                `${interest.label} ${
                    network === 'whatsapp'
                        ? 'comunidad canal'
                        : network === 'facebook'
                            ? 'grupo página'
                            : network === 'instagram'
                                ? 'reels perfiles'
                                : network === 'tiktok'
                                    ? 'videos'
                                    : 'tendencias'
                }`,

            values: TOPICS.map(item => {

                if (item.id === id) {
                    return 5;
                }

                if (related(id, item.id)) {
                    return 2;
                }

                return 0;

            })

        });

    }

}


/* =========================================
   10. RELACIÓN ENTRE INTERESES
========================================= */

function related(a, b) {

    const groups = [

        ['deportes', 'fitness'],

        ['musica', 'humor'],

        ['tecnologia', 'gaming', 'aprendizaje'],

        ['moda', 'viajes'],

        ['negocios', 'aprendizaje', 'noticias']

    ];

    return groups.some(group =>
        group.includes(a) && group.includes(b)
    );

}


/* =========================================
   11. VECTOR DE PREFERENCIAS
========================================= */

// Cada interés seleccionado vale 1.
// Cada interés no seleccionado vale 0.

function vector() {

    return TOPICS.map(interest =>

        state.selected.includes(interest.id) ? 1 : 0

    );

}


/* =========================================
   12. PRODUCTO PUNTO Y RECOMENDACIONES
========================================= */

// Multiplica cada fila de la matriz por el vector.
// Suma los resultados para obtener la afinidad.

function calculateRecommendations() {

    const preferences = vector();

    return CATALOG

        .filter(content => content.network === state.network)

        .map(content => ({

            ...content,

            score: content.values.reduce(
                (sum, value, index) =>
                    sum + value * preferences[index],
                0
            )

        }))

        .sort((a, b) =>
            b.score - a.score ||
            a.title.localeCompare(b.title, 'es')
        );

}


/* =========================================
   13. HISTORIAL DE EXPLORACIÓN
========================================= */

function addHistory() {

    state.history.unshift({

        network: state.network,

        selected: [...state.selected],

        date: new Date().toLocaleString('es-CO')

    });

    // Conserva los últimos 20 registros.

    state.history = state.history.slice(0, 20);

    persist();

}


/* =========================================
   14. BÚSQUEDA EN REDES SOCIALES
========================================= */

function searchUrl(item) {

    const query = encodeURIComponent(item.search);

    const urls = {

        instagram:
            `https://www.instagram.com/explore/search/keyword/?q=${query}`,

        tiktok:
            `https://www.tiktok.com/search?q=${query}`,

        whatsapp:
            `https://www.google.com/search?q=${encodeURIComponent('WhatsApp ' + item.search)}`,

        facebook:
            `https://www.facebook.com/search/top?q=${query}`,

        x:
            `https://x.com/search?q=${query}`

    };

    return urls[item.network];

}


/* =========================================
   15. TARJETAS DE CONTENIDO
========================================= */

function card(item) {

    const saved = state.favorites.includes(item.id);

    const terms = state.selected

        .filter(id =>
            item.values[TOPICS.findIndex(topic => topic.id === id)] > 0
        )

        .map(id => topic(id).label);


    return `

        <article class="content-card">

            <span class="emoji">
                ${item.emoji}
            </span>

            <span class="tag">
                ${NETWORKS[item.network].label} · ${TYPE[item.network]}
            </span>

            <h3>
                ${safe(item.title)}
            </h3>

            <p>
                ${safe(item.description)}
            </p>

            <p class="score">
                Afinidad: ${item.score} puntos
            </p>

            <div class="card-actions">

                <button
                    class="small-btn ${saved ? 'saved' : ''}"
                    data-fav="${item.id}"
                >
                    ${saved ? '♥ Guardado' : '♡ Guardar'}
                </button>

                <button
                    class="small-btn"
                    data-reason="${item.id}"
                >
                    ¿Por qué?
                </button>

                <a
                    class="small-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="${searchUrl(item)}"
                >
                    Buscar en ${NETWORKS[item.network].label} ↗
                </a>

            </div>

            <div
                class="reason"
                id="reason-${item.id}"
                hidden
            >
                Seleccionaste: ${safe(terms.join(', ') || 'otros intereses')}.

                El algoritmo calcula la afinidad multiplicando
                la fila de este contenido por tu vector de preferencias.
            </div>

        </article>

    `;

}


/* =========================================
   16. MOSTRAR RECOMENDACIONES
========================================= */

function renderRecommendations() {

    $('explore-title').textContent =
        `${state.name}, esto es para ti ✨`;

    $('explore-description').textContent =
        `Ideas para explorar en ${NETWORKS[state.network].label}, basadas en tus gustos. No son tendencias verificadas en tiempo real.`;

    $('recommendation-list').innerHTML =

        calculateRecommendations()

            .filter(content => content.score > 0)

            .map(content => card(content))

            .join('');

}


/* =========================================
   17. SISTEMA DE FAVORITOS
========================================= */

function toggleFavorite(id) {

    if (state.favorites.includes(id)) {

        state.favorites = state.favorites.filter(
            favorite => favorite !== id
        );

    } else {

        state.favorites.push(id);

    }

    persist();

    if ($('favorites').classList.contains('active')) {

        renderFavorites();

    } else {

        renderRecommendations();

    }

}


function renderFavorites() {

    const preferences = vector();

    const items = CATALOG

        .filter(content => state.favorites.includes(content.id))

        .map(content => ({

            ...content,

            score: content.values.reduce(
                (sum, value, index) =>
                    sum + value * preferences[index],
                0
            )

        }));


    $('favorite-list').innerHTML = items.length

        ? items.map(content => card(content)).join('')

        : '<p>Todavía no tienes recomendaciones guardadas. Explora y guarda las que más te gusten.</p>';

}


/* =========================================
   18. MOSTRAR HISTORIAL
========================================= */

function renderHistory() {

    $('history-list').innerHTML = state.history.length

        ? state.history.map(item => `

            <article class="history-entry">

                <strong>
                    ${NETWORKS[item.network]?.label || 'Red social'}
                </strong>

                <p>
                    ${safe(
                        item.selected
                            .map(id => topic(id)?.label)
                            .filter(Boolean)
                            .join(', ')
                    )}
                </p>

                <small>
                    ${safe(item.date)}
                </small>

            </article>

        `).join('')

        : '<p>Aún no has explorado ninguna red social.</p>';

}


/* =========================================
   19. VISUALIZACIÓN DEL ALGORITMO
========================================= */

function updateAlgorithm() {

    const preferences = vector();

    const items = calculateRecommendations();


    // Muestra los nombres de las columnas de la matriz.

    $('math-labels').innerHTML =

        TOPICS.map(interest => `

            <span class="chip">
                ${interest.emoji} ${interest.label}
            </span>

        `).join('');


    // Muestra el vector de preferencias.

    $('user-vector').innerHTML =

        preferences.map(value => `

            <span class="number">
                ${value}
            </span>

        `).join('');


    // Muestra las filas de la matriz de contenidos.

    $('content-matrix').innerHTML =

        items.map(content => `

            <div class="matrix-row">

                <span class="matrix-label">
                    ${safe(content.title)}
                </span>

                ${content.values.map(value => `

                    <span class="number">
                        ${value}
                    </span>

                `).join('')}

            </div>

        `).join('');


    // Muestra el resultado del producto punto.

    $('score-results').innerHTML =

        items.map(content => `

            <div class="score-row">

                ${safe(content.title)}:

                <strong>
                    ${content.score} puntos
                </strong>

            </div>

        `).join('');

}


/* =========================================
   20. EVENTOS DEL FORMULARIO
========================================= */

// Registro del nombre del usuario.

$('name-form').addEventListener('submit', event => {

    event.preventDefault();

    const name = $('username').value.trim();

    if (!name) {

        $('name-error').textContent =
            'Escribe tu nombre para continuar.';

        return;

    }

    state.name = name;

    persist();

    renderNetworks();

    showPage('networks');

});


/* =========================================
   21. EVENTOS DE NAVEGACIÓN Y SELECCIÓN
========================================= */

document.addEventListener('click', event => {

    const navigation = event.target.closest('[data-page]');

    if (navigation) {

        event.preventDefault();

        showPage(navigation.dataset.page);

        return;

    }


    const network = event.target.closest('[data-network]');

    if (network) {

        chooseNetwork(network.dataset.network);

        return;

    }


    const interest = event.target.closest('[data-topic]');

    if (interest) {

        toggleTopic(interest.dataset.topic);

        return;

    }


    const favorite = event.target.closest('[data-fav]');

    if (favorite) {

        toggleFavorite(favorite.dataset.fav);

        return;

    }


    const reason = event.target.closest('[data-reason]');

    if (reason) {

        const element = $(`reason-${reason.dataset.reason}`);

        if (element) {
            element.hidden = !element.hidden;
        }

    }

});


/* =========================================
   22. CONFIRMAR INTERESES
========================================= */

$('confirm-interests').addEventListener('click', () => {

    if (!state.selected.length) {

        $('interest-error').textContent =
            'Selecciona al menos un gusto para continuar.';

        return;

    }

    renderSummary();

    showPage('summary');

});


/* =========================================
   23. INICIAR EXPLORACIÓN
========================================= */

$('start-exploring').addEventListener('click', () => {

    addHistory();

    showPage('explore');

});


/* =========================================
   24. BORRAR HISTORIAL
========================================= */

$('clear-history').addEventListener('click', () => {

    const confirmation = confirm(
        '¿Borrar el historial guardado en este navegador?'
    );

    if (confirmation) {

        state.history = [];

        persist();

        renderHistory();

    }

});


/* =========================================
   25. INICIALIZACIÓN DEL PROYECTO
========================================= */

// Recupera la información guardada al cargar la página.

$('username').value = state.name;

if (state.name) {
    renderNetworks();
}

if (state.network) {
    renderInterests();
}
