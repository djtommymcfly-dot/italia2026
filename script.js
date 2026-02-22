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
// FUNÇÃO PARA ATUALIZAR ORÇAMENTO A PARTIR DAS ATIVIDADES
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
// PLAYER DE ÁUDIO COM AUTOPLAY REFORÇADO
// =============================================
const audioPlayer = document.getElementById('audioPlayer');
const audioButton = document.getElementById('audioButton');
let isPlaying = false;
let currentTrack = 0;
let playAttempts = 0;

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
        console.log('🎵 Carregando:', playlist[index]);
        if (isPlaying) {
            playWithRetry();
        }
    }
}

audioPlayer.addEventListener('ended', function() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
});

// Função para tocar com múltiplas tentativas
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
            playAttempts = 0;
            console.log('✅ Áudio tocando:', audioPlayer.src);
        }).catch(error => {
            console.log('❌ Erro no autoplay:', error);
            console.log('   Motivo: Navegador bloqueou autoplay. Clique no botão play.');
            isPlaying = false;
            audioButton.innerHTML = '▶️';
            audioButton.classList.remove('playing');
        });
    }
}

// ESTRATÉGIAS DE AUTOPLAY
function initAudio() {
    currentTrack = 0;
    audioPlayer.src = playlist[0];
    audioPlayer.load();
    console.log('🎵 Inicializando áudio com:', playlist[0]);
    
    // Tentativa 1: Imediata
    setTimeout(() => {
        playWithRetry();
    }, 500);
    
    // Tentativa 2: Após 2 segundos
    setTimeout(() => {
        if (!isPlaying) {
            playWithRetry();
        }
    }, 2000);
    
    // Tentativa 3: Após 5 segundos
    setTimeout(() => {
        if (!isPlaying) {
            playWithRetry();
        }
    }, 5000);
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initAudio);

// Tentar novamente quando a página carregar completamente
window.addEventListener('load', function() {
    if (!isPlaying) {
        playWithRetry();
    }
});

// Se o usuário clicar em qualquer lugar, tentar tocar (último recurso)
document.body.addEventListener('click', function once() {
    if (!isPlaying) {
        playWithRetry();
    }
}, { once: true });

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

// =============================================
// FUNÇÕES DE TRADUÇÃO
// =============================================
let currentLang = 'pt-pt';

function translatePage(lang) {
    if (!translations[lang]) return;
    
    document.getElementById('hero-title').textContent = translations[lang]['hero.title'];
    document.getElementById('hero-subtitle').textContent = translations[lang]['hero.subtitle'];
    document.getElementById('hero-chegada').textContent = translations[lang]['hero.chegada'];
    document.getElementById('hero-saida').textContent = translations[lang]['hero.saida'];
    document.getElementById('hero-duracao').textContent = translations[lang]['hero.duracao'];
    document.getElementById('hero-dias').textContent = translations[lang]['hero.dias'];
    
    document.querySelectorAll('.nav-dia').forEach(el => {
        el.textContent = translations[lang]['nav.dia'];
    });
    
    document.getElementById('dia1-title').textContent = translations[lang]['dia1.title'];
    document.getElementById('dia2-title').textContent = translations[lang]['dia2.title'];
    document.getElementById('dia3-title').textContent = translations[lang]['dia3.title'];
    document.getElementById('dia4-title').textContent = translations[lang]['dia4.title'];
    document.getElementById('dia5-title').textContent = translations[lang]['dia5.title'];
    document.getElementById('dia6-title').textContent = translations[lang]['dia6.title'];
    document.getElementById('dia7-title').textContent = translations[lang]['dia7.title'];
    
    // Atualizar dias da semana
    const weekdays = {
        'dia1-date': 'week.segunda',
        'dia2-date': 'week.terca',
        'dia3-date': 'week.quarta',
        'dia4-date': 'week.quinta',
        'dia5-date': 'week.sexta',
        'dia6-date': 'week.sabado',
        'dia7-date': 'week.domingo'
    };
    
    Object.keys(weekdays).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            let text = el.innerHTML;
            const parts = text.split(',');
            if (parts.length > 1) {
                parts[0] = translations[lang][weekdays[id]];
                el.innerHTML = parts.join(',');
            }
        }
    });
    
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
    
    // Atividades Dia 1
    for (let i = 1; i <= 7; i++) {
        const actTitle = document.getElementById(`dia1-act${i}-title`);
        const actLocation = document.getElementById(`dia1-act${i}-location`);
        const actNote = document.getElementById(`dia1-act${i}-note`);
        
        if (actTitle) actTitle.textContent = translations[lang][`dia1.act${i}.title`];
        if (actLocation) actLocation.textContent = translations[lang][`dia1.act${i}.location`];
        if (actNote) actNote.textContent = translations[lang][`dia1.act${i}.note`];
    }
    
    // Atividades Dia 2
    for (let i = 1; i <= 8; i++) {
        const actTitle = document.getElementById(`dia2-act${i}-title`);
        const actLocation = document.getElementById(`dia2-act${i}-location`);
        const actNote = document.getElementById(`dia2-act${i}-note`);
        
        if (actTitle) actTitle.textContent = translations[lang][`dia2.act${i}.title`];
        if (actLocation) actLocation.textContent = translations[lang][`dia2.act${i}.location`];
        if (actNote) actNote.textContent = translations[lang][`dia2.act${i}.note`];
    }
    
    // Atividades Dia 3
    for (let i = 1; i <= 8; i++) {
        const actTitle = document.getElementById(`dia3-act${i}-title`);
        const actLocation = document.getElementById(`dia3-act${i}-location`);
        const actNote = document.getElementById(`dia3-act${i}-note`);
        
        if (actTitle) actTitle.textContent = translations[lang][`dia3.act${i}.title`];
        if (actLocation) actLocation.textContent = translations[lang][`dia3.act${i}.location`];
        if (actNote) actNote.textContent = translations[lang][`dia3.act${i}.note`];
    }
    
    // Atividades Dia 4
    for (let i = 1; i <= 8; i++) {
        const actTitle = document.getElementById(`dia4-act${i}-title`);
        const actLocation = document.getElementById(`dia4-act${i}-location`);
        const actNote = document.getElementById(`dia4-act${i}-note`);
        
        if (actTitle) actTitle.textContent = translations[lang][`dia4.act${i}.title`];
        if (actLocation) actLocation.textContent = translations[lang][`dia4.act${i}.location`];
        if (actNote) actNote.textContent = translations[lang][`dia4.act${i}.note`];
    }
    
    // Atividades Dia 5
    for (let i = 1; i <= 8; i++) {
        const actTitle = document.getElementById(`dia5-act${i}-title`);
        const actLocation = document.getElementById(`dia5-act${i}-location`);
        const actNote = document.getElementById(`dia5-act${i}-note`);
        
        if (actTitle) actTitle.textContent = translations[lang][`dia5.act${i}.title`];
        if (actLocation) actLocation.textContent = translations[lang][`dia5.act${i}.location`];
        if (actNote) actNote.textContent = translations[lang][`dia5.act${i}.note`];
    }
    
    // Atividades Dia 6
    for (let i = 1; i <= 8; i++) {
        const actTitle = document.getElementById(`dia6-act${i}-title`);
        const actLocation = document.getElementById(`dia6-act${i}-location`);
        const actNote = document.getElementById(`dia6-act${i}-note`);
        
        if (actTitle) actTitle.textContent = translations[lang][`dia6.act${i}.title`];
        if (actLocation) actLocation.textContent = translations[lang][`dia6.act${i}.location`];
        if (actNote) actNote.textContent = translations[lang][`dia6.act${i}.note`];
    }
    
    // Atividades Dia 7
    for (let i = 1; i <= 9; i++) {
        const actTitle = document.getElementById(`dia7-act${i}-title`);
        const actLocation = document.getElementById(`dia7-act${i}-location`);
        const actNote = document.getElementById(`dia7-act${i}-note`);
        
        if (actTitle) actTitle.textContent = translations[lang][`dia7.act${i}.title`];
        if (actLocation) actLocation.textContent = translations[lang][`dia7.act${i}.location`];
        if (actNote) actNote.textContent = translations[lang][`dia7.act${i}.note`];
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
    document.getElementById('footer-text').innerHTML = translations[lang]['footer.text'] + '<br>30 Março - 5 Abril 2025';
    
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

// Carregar dados do usuário atual
function loadUserData(username) {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return allData[username] || {};
}

// Salvar dados do usuário atual
function saveUserData(username, data) {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    allData[username] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

// Carregar todos os dados salvos para o usuário atual
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
        // Criar um identificador único para cada campo
        const parent = input.closest('.activity');
        const timeElem = parent?.querySelector('.time');
        const titleElem = parent?.querySelector('.activity-title');
        const key = `cost_${timeElem?.textContent?.trim()}_${titleElem?.textContent?.trim()}`.replace(/\s+/g, '_');
        
        if (userData[key]) {
            input.value = userData[key];
        }
    });
    
    // Atualizar calculadora
    updateBudgetFromActivities();
}

// Salvar todos os dados do usuário atual
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
    console.log('✅ Dados salvos para:', currentUser);
}

// Atualizar interface de login
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

// Handler de login
function handleLogin() {
    const username = document.getElementById('usernameInput').value.trim();
    if (username) {
        currentUser = username;
        updateLoginUI();
        loadSavedData();
        
        // Salvar usuário atual para recarregar depois
        sessionStorage.setItem('currentUser', username);
    }
}

// Handler de logout
function handleLogout() {
    currentUser = null;
    updateLoginUI();
    sessionStorage.removeItem('currentUser');
    
    // Limpar todos os campos
    document.querySelectorAll('.hotel-input, .cost-input').forEach(input => {
        input.value = '';
    });
    
    // Resetar calculadora
    updateBudgetFromActivities();
}

// Verificar se já estava logado
function checkSavedLogin() {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        updateLoginUI();
        loadSavedData();
    }
}

// Adicionar autosave a cada alteração
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('hotel-input') || e.target.classList.contains('cost-input')) {
        if (currentUser) {
            // Debounce para não salvar a cada tecla
            clearTimeout(window.saveTimeout);
            window.saveTimeout = setTimeout(() => {
                saveAllData();
            }, 500);
        }
    }
});

// =============================================
// FUNÇÕES PARA NAVEGAÇÃO ENTRE DIAS
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
        // Se estiver no dia 1, vai para o último dia (loop)
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
// FUNÇÕES PARA O PLAYER DE MÚSICA
// =============================================
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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    translatePage('pt-pt');
    checkSavedLogin();
});

// Garantir que as funções estão disponíveis globalmente
window.goToPrevDay = goToPrevDay;
window.goToHome = goToHome;
window.prevTrack = prevTrack;
window.nextTrack = nextTrack;
window.toggleAudio = toggleAudio;
window.setLanguage = setLanguage;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
