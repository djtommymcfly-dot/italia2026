// Smooth scroll and active nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active nav on scroll
const sections = document.querySelectorAll('.day-section');
const navLinks = document.querySelectorAll('.nav-days a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.activity').forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
});

// =============================================
// FUNÇÃO PARA ATUALIZAR ORÇAMENTO
// =============================================
function updateBudgetFromActivities() {
    const categories = {
        voo: 0,
        hoteis: 0,
        trens: 0,
        alimentacao: 0,
        passeios: 0,
        compras: 0,
        onibus: 0,
        extras: 0
    };

    document.querySelectorAll('.cost-input').forEach(input => {
        const cat = input.dataset.category;
        const val = parseFloat(input.value) || 0;
        if (categories.hasOwnProperty(cat)) {
            categories[cat] += val;
        }
    });

    document.getElementById('voo').value = categories.voo.toFixed(2);
    document.getElementById('hoteis').value = categories.hoteis.toFixed(2);
    document.getElementById('trens').value = categories.trens.toFixed(2);
    document.getElementById('alimentacao').value = categories.alimentacao.toFixed(2);
    document.getElementById('passeios').value = categories.passeios.toFixed(2);
    document.getElementById('compras').value = categories.compras.toFixed(2);
    document.getElementById('onibus').value = categories.onibus.toFixed(2);
    document.getElementById('extras').value = categories.extras.toFixed(2);

    const total = categories.voo + categories.hoteis + categories.trens + 
                 categories.alimentacao + categories.passeios + categories.compras + 
                 categories.onibus + categories.extras;
    document.getElementById('totalValue').textContent = total.toFixed(2);
}

document.querySelectorAll('.cost-input').forEach(input => {
    input.addEventListener('input', updateBudgetFromActivities);
});

updateBudgetFromActivities();

// =============================================
// PLAYER DE ÁUDIO
// =============================================
const audioPlayer = document.getElementById('audioPlayer');
const audioButton = document.getElementById('audioButton');
let isPlaying = false;
let currentTrack = 0;

const playlist = [
    'assets/1.mp3',
    'assets/2.mp3',
    'assets/3.mp3',
    'assets/4.mp3',
    'assets/5.mp3',
    'assets/6.mp3',
    'assets/7.mp3',
    'assets/8.mp3',
    'assets/9.mp3'
];

function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        audioPlayer.src = playlist[index];
        audioPlayer.load();
        if (isPlaying) {
            playWithRetry();
        }
    }
}

audioPlayer.addEventListener('ended', function() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
});

function playWithRetry() {
    if (!audioPlayer.src) {
        audioPlayer.src = playlist[0];
    }
    
    audioPlayer.volume = 0.5;
    audioPlayer.muted = false;
    
    let playPromise = audioPlayer.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            audioButton.innerHTML = '⏸️';
            audioButton.classList.add('playing');
        }).catch(error => {
            console.log('Autoplay bloqueado. Toque no botão ▶️ para iniciar.');
            isPlaying = false;
            audioButton.innerHTML = '▶️';
            audioButton.classList.remove('playing');
        });
    }
}

function toggleAudio() {
    if (isPlaying) {
        audioPlayer.pause();
        audioButton.innerHTML = '▶️';
        audioButton.classList.remove('playing');
        isPlaying = false;
    } else {
        playWithRetry();
    }
}

function prevTrack() {
    if (playlist.length > 0) {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrack);
        if (isPlaying) {
            playWithRetry();
        }
    }
}

function nextTrack() {
    if (playlist.length > 0) {
        currentTrack = (currentTrack + 1) % playlist.length;
        loadTrack(currentTrack);
        if (isPlaying) {
            playWithRetry();
        }
    }
}

// =============================================
// FUNÇÕES DE TRADUÇÃO
// =============================================
let currentLang = 'pt-pt';

function translatePage(lang) {
    if (!translations[lang]) return;
    
    // Hero
    document.getElementById('hero-title').textContent = translations[lang]['hero.title'];
    document.getElementById('hero-subtitle').textContent = translations[lang]['hero.subtitle'];
    document.getElementById('hero-chegada').textContent = translations[lang]['hero.chegada'];
    document.getElementById('hero-saida').textContent = translations[lang]['hero.saida'];
    document.getElementById('hero-duracao').textContent = translations[lang]['hero.duracao'];
    document.getElementById('hero-dias').textContent = translations[lang]['hero.dias'];
    
    // Navigation
    document.querySelectorAll('.nav-dia').forEach(el => {
        el.textContent = translations[lang]['nav.dia'];
    });
    
    // Dias títulos
    for (let i = 1; i <= 7; i++) {
        const title = document.getElementById(`dia${i}-title`);
        if (title) title.textContent = translations[lang][`dia${i}.title`];
    }
    
    // Cidades
    document.getElementById('dia1-city').textContent = translations[lang]['city.milao'];
    document.getElementById('dia2-city').textContent = translations[lang]['city.veneza'];
    document.getElementById('dia3-city').textContent = translations[lang]['city.roma'];
    document.getElementById('dia4-city').textContent = translations[lang]['city.roma_napoles'];
    document.getElementById('dia5-city').textContent = translations[lang]['city.napoles_milao'];
    document.getElementById('dia6-city').textContent = translations[lang]['city.milao'];
    document.getElementById('dia7-city').textContent = translations[lang]['city.milao_bergamo'];
    
    // Hotel labels
    document.querySelectorAll('[id^="hotel-label"]').forEach(el => {
        if (el) el.textContent = translations[lang]['hotel.label'];
    });
    
    document.querySelectorAll('.hotel-input').forEach(el => {
        el.placeholder = translations[lang]['hotel.placeholder'];
    });
    
    // Atividades - todas
    for (let dia = 1; dia <= 7; dia++) {
        for (let act = 1; act <= 9; act++) {
            const title = document.getElementById(`dia${dia}-act${act}-title`);
            const location = document.getElementById(`dia${dia}-act${act}-location`);
            const note = document.getElementById(`dia${dia}-act${act}-note`);
            
            if (title) title.textContent = translations[lang][`dia${dia}.act${act}.title`];
            if (location) location.textContent = translations[lang][`dia${dia}.act${act}.location`];
            if (note) note.textContent = translations[lang][`dia${dia}.act${act}.note`];
        }
    }
    
    // Transport
    document.getElementById('transport-title').textContent = translations[lang]['transport.title'];
    document.getElementById('transport-1').innerHTML = translations[lang]['transport.milao_veneza'] + '<br><small>31 março • 2h15min</small>';
    document.getElementById('transport-2').innerHTML = translations[lang]['transport.veneza_roma'] + '<br><small>1 abril • ~4h</small>';
    document.getElementById('transport-3').innerHTML = translations[lang]['transport.roma_napoles'] + '<br><small>2 abril • 1h13min</small>';
    document.getElementById('transport-4').innerHTML = translations[lang]['transport.napoles_milao'] + '<br><small>3 abril • 4h30min</small>';
    
    // Budget
    document.getElementById('budget-title').textContent = translations[lang]['budget.title'];
    document.getElementById('budget-voo').textContent = translations[lang]['budget.voo'];
    document.getElementById('budget-hoteis').textContent = translations[lang]['budget.hoteis'];
    document.getElementById('budget-trens').textContent = translations[lang]['budget.trens'];
    document.getElementById('budget-alimentacao').textContent = translations[lang]['budget.alimentacao'];
    document.getElementById('budget-passeios').textContent = translations[lang]['budget.passeios'];
    document.getElementById('budget-compras').textContent = translations[lang]['budget.compras'];
    document.getElementById('budget-onibus').textContent = translations[lang]['budget.onibus'];
    document.getElementById('budget-extras').textContent = translations[lang]['budget.extras'];
    document.getElementById('budget-total-title').textContent = translations[lang]['budget.total'];
    document.getElementById('budget-auto').textContent = translations[lang]['budget.auto'];
    
    // Checklist
    document.getElementById('checklist-title').textContent = translations[lang]['checklist.title'];
    for (let i = 1; i <= 8; i++) {
        const el = document.getElementById(`checklist-${i}`);
        if (el) el.innerHTML = translations[lang][`checklist.${i}`];
    }
    
    // Footer
    document.getElementById('footer-text').innerHTML = translations[lang]['footer.text'] + '<br>30 Março - 5 Abril 2026';
    
    // Cost labels
    document.querySelectorAll('.cost-label').forEach(el => {
        el.textContent = translations[lang]['cost.label'];
    });
}

function setLanguage(lang, event) {
    currentLang = lang;
    translatePage(lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.documentElement.lang = lang === 'pt-pt' ? 'pt-PT' : 'es-ES';
}

// =============================================
// SISTEMA DE LOGIN COM LOCALSTORAGE
// =============================================
const STORAGE_KEY = 'italia_user_data';
let currentUser = null;

function loadUserData(username) {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return allData[username] || {};
}

function saveUserData(username, data) {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    allData[username] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

function loadSavedData() {
    if (!currentUser) return;
    
    const userData = loadUserData(currentUser);
    
    // Preencher campos de hotel
    document.querySelectorAll('.hotel-input').forEach(input => {
        const id = input.id;
        if (userData[id]) {
            input.value = userData[id];
        }
    });
    
    // Preencher campos de custo
    document.querySelectorAll('.cost-input').forEach(input => {
        const parent = input.closest('.activity');
        const timeElem = parent?.querySelector('.time');
        const titleElem = parent?.querySelector('.activity-title');
        const key = `cost_${timeElem?.textContent?.trim()}_${titleElem?.textContent?.trim()}`.replace(/\s+/g, '_');
        
        if (userData[key]) {
            input.value = userData[key];
        }
    });
    
    updateBudgetFromActivities();
}

function saveAllData() {
    if (!currentUser) return;
    
    const userData = {};
    
    // Salvar campos de hotel
    document.querySelectorAll('.hotel-input').forEach(input => {
        userData[input.id] = input.value;
    });
    
    // Salvar campos de custo
    document.querySelectorAll('.cost-input').forEach(input => {
        const parent = input.closest('.activity');
        const timeElem = parent?.querySelector('.time');
        const titleElem = parent?.querySelector('.activity-title');
        const key = `cost_${timeElem?.textContent?.trim()}_${titleElem?.textContent?.trim()}`.replace(/\s+/g, '_');
        userData[key] = input.value;
    });
    
    saveUserData(currentUser, userData);
}

function updateLoginUI() {
    const loginBox = document.getElementById('loginBox');
    const userBox = document.getElementById('userBox');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (currentUser) {
        loginBox.style.display = 'none';
        userBox.style.display = 'flex';
        usernameDisplay.textContent = currentUser;
    } else {
        loginBox.style.display = 'flex';
        userBox.style.display = 'none';
    }
}

function handleLogin() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) {
        alert(currentLang === 'pt-pt' ? 'Por favor, digite seu nome!' : '¡Por favor, escriba su nombre!');
        return;
    }
    currentUser = username;
    updateLoginUI();
    loadSavedData();
    sessionStorage.setItem('currentUser', username);
}

function handleLogout() {
    currentUser = null;
    updateLoginUI();
    sessionStorage.removeItem('currentUser');
    
    document.querySelectorAll('.hotel-input, .cost-input').forEach(input => {
        input.value = '';
    });
    
    updateBudgetFromActivities();
}

function checkSavedLogin() {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        updateLoginUI();
        loadSavedData();
    }
}

// Autosave
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('hotel-input') || e.target.classList.contains('cost-input')) {
        if (currentUser) {
            clearTimeout(window.saveTimeout);
            window.saveTimeout = setTimeout(() => {
                saveAllData();
            }, 500);
        }
    }
});

// Sincronizar hotel de Milão entre dia 1 e dia 6
document.addEventListener('DOMContentLoaded', function() {
    const hotelMilao = document.getElementById('hotel-milao');
    const hotelMilao2 = document.getElementById('hotel-milao2');
    
    if (hotelMilao && hotelMilao2) {
        hotelMilao.addEventListener('input', function() {
            hotelMilao2.value = this.value;
            if (currentUser) saveAllData();
        });
        
        hotelMilao2.addEventListener('input', function() {
            hotelMilao.value = this.value;
            if (currentUser) saveAllData();
        });
    }
});

// =============================================
// FUNÇÕES DE NAVEGAÇÃO ENTRE DIAS
// =============================================
function goToPrevDay() {
    const sections = document.querySelectorAll('.day-section');
    const currentHash = window.location.hash || '#dia1';
    let currentId = currentHash.replace('#', '');
    
    let currentIndex = -1;
    sections.forEach((section, index) => {
        if (section.id === currentId) {
            currentIndex = index;
        }
    });
    
    if (currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        window.location.hash = prevSection.id;
        prevSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        const lastSection = sections[sections.length - 1];
        window.location.hash = lastSection.id;
        lastSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function goToHome() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.location.hash = '#dia1';
}

// =============================================
// INICIALIZAÇÃO
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    translatePage('pt-pt');
    checkSavedLogin();
    
    // Iniciar áudio
    setTimeout(() => {
        if (!isPlaying) {
            playWithRetry();
        }
    }, 1000);
});

// Tornar funções globais
window.goToPrevDay = goToPrevDay;
window.goToHome = goToHome;
window.prevTrack = prevTrack;
window.nextTrack = nextTrack;
window.toggleAudio = toggleAudio;
window.setLanguage = setLanguage;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
