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
    // Inicializar todas as categorias com 0
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

    // Somar todos os inputs das atividades por categoria
    document.querySelectorAll('.cost-input').forEach(input => {
        const cat = input.dataset.category;
        const val = parseFloat(input.value) || 0;
        if (categories.hasOwnProperty(cat)) {
            categories[cat] += val;
        }
    });

    // Atualizar os campos da calculadora (que estão readonly)
    document.getElementById('voo').value = categories.voo.toFixed(2);
    document.getElementById('hoteis').value = categories.hoteis.toFixed(2);
    document.getElementById('trens').value = categories.trens.toFixed(2);
    document.getElementById('alimentacao').value = categories.alimentacao.toFixed(2);
    document.getElementById('passeios').value = categories.passeios.toFixed(2);
    document.getElementById('compras').value = categories.compras.toFixed(2);
    document.getElementById('onibus').value = categories.onibus.toFixed(2);
    document.getElementById('extras').value = categories.extras.toFixed(2);

    // Calcular e mostrar o total
    const total = categories.voo + categories.hoteis + categories.trens + 
                 categories.alimentacao + categories.passeios + categories.compras + 
                 categories.onibus + categories.extras;
    document.getElementById('totalValue').textContent = total.toFixed(2);
}

// Adicionar evento a TODOS os inputs das atividades
document.querySelectorAll('.cost-input').forEach(input => {
    input.addEventListener('input', updateBudgetFromActivities);
});

// Executar uma vez para inicializar
updateBudgetFromActivities();

// =============================================
// PLAYER DE ÁUDIO COM AUTOPLAY
// =============================================
const audioPlayer = document.getElementById('audioPlayer');
const audioButton = document.getElementById('audioButton');
let isPlaying = false;
let currentTrack = 0;

// Lista de músicas (9 arquivos na pasta assets)
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

// Carregar faixa atual
function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        audioPlayer.src = playlist[index];
        if (isPlaying) {
            audioPlayer.play().catch(e => console.log('Playback falhou:', e));
        }
    }
}

// Quando a faixa terminar, tocar a próxima (loop)
audioPlayer.addEventListener('ended', function() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
});

// AUTOPLAY - Tentar tocar assim que possível
function tryPlay() {
    audioPlayer.volume = 0.3;
    
    let playPromise = audioPlayer.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            audioButton.innerHTML = '⏸️';
            audioButton.classList.add('playing');
        }).catch(() => {
            isPlaying = false;
            audioButton.innerHTML = '▶️';
            audioButton.classList.remove('playing');
        });
    }
}

// Iniciar com a primeira música e tentar autoplay
document.addEventListener('DOMContentLoaded', function() {
    currentTrack = 0;
    audioPlayer.src = playlist[0];
    tryPlay();
});

window.addEventListener('load', function() {
    if (!isPlaying) {
        tryPlay();
    }
});

function toggleAudio() {
    if (isPlaying) {
        audioPlayer.pause();
        audioButton.innerHTML = '▶️';
        audioButton.classList.remove('playing');
    } else {
        if (!audioPlayer.src) {
            audioPlayer.src = playlist[0];
        }
        audioPlayer.play().catch(e => console.log('Erro ao reproduzir:', e));
        audioButton.innerHTML = '⏸️';
        audioButton.classList.add('playing');
    }
    isPlaying = !isPlaying;
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
    document.getElementById('dia1-title').textContent = translations[lang]['dia1.title'];
    document.getElementById('dia2-title').textContent = translations[lang]['dia2.title'];
    document.getElementById('dia3-title').textContent = translations[lang]['dia3.title'];
    document.getElementById('dia4-title').textContent = translations[lang]['dia4.title'];
    document.getElementById('dia5-title').textContent = translations[lang]['dia5.title'];
    document.getElementById('dia6-title').textContent = translations[lang]['dia6.title'];
    document.getElementById('dia7-title').textContent = translations[lang]['dia7.title'];
    
    // Dias da semana
    document.getElementById('dia1-date').innerHTML = document.getElementById('dia1-date').innerHTML.replace(/[A-Za-zçãáéíóúâêô]+-feira/g, translations[lang]['week.segunda']);
    document.getElementById('dia2-date').innerHTML = document.getElementById('dia2-date').innerHTML.replace(/[A-Za-zçãáéíóúâêô]+-feira/g, translations[lang]['week.terca']);
    document.getElementById('dia3-date').innerHTML = document.getElementById('dia3-date').innerHTML.replace(/[A-Za-zçãáéíóúâêô]+-feira/g, translations[lang]['week.quarta']);
    document.getElementById('dia4-date').innerHTML = document.getElementById('dia4-date').innerHTML.replace(/[A-Za-zçãáéíóúâêô]+-feira/g, translations[lang]['week.quinta']);
    document.getElementById('dia5-date').innerHTML = document.getElementById('dia5-date').innerHTML.replace(/[A-Za-zçãáéíóúâêô]+-feira/g, translations[lang]['week.sexta']);
    document.getElementById('dia6-date').innerHTML = document.getElementById('dia6-date').innerHTML.replace(/[A-Za-zçãáéíóúâêô]+-feira/g, translations[lang]['week.sabado']);
    document.getElementById('dia7-date').innerHTML = document.getElementById('dia7-date').innerHTML.replace(/[A-Za-zçãáéíóúâêô]+-feira/g, translations[lang]['week.domingo']);
    
    // Cidades
    document.getElementById('dia1-city').textContent = translations[lang]['city.milao'];
    document.getElementById('dia2-city').textContent = translations[lang]['city.veneza'];
    document.getElementById('dia3-city').textContent = translations[lang]['city.roma'];
    document.getElementById('dia4-city').textContent = translations[lang]['city.roma_napoles'];
    document.getElementById('dia5-city').textContent = translations[lang]['city.napoles_milao'];
    document.getElementById('dia6-city').textContent = translations[lang]['city.milao'];
    document.getElementById('dia7-city').textContent = translations[lang]['city.milao_bergamo'];
    
    // Hotel labels
    document.querySelectorAll('#hotel-label, #hotel-label2, #hotel-label3, #hotel-label4, #hotel-label6').forEach(el => {
        if (el) el.textContent = translations[lang]['hotel.label'];
    });
    
    document.querySelectorAll('.hotel-input').forEach(el => {
        el.placeholder = translations[lang]['hotel.placeholder'];
    });
    
    // Dia 1 atividades
    document.getElementById('dia1-act1-title').textContent = translations[lang]['dia1.act1.title'];
    document.getElementById('dia1-act1-location').textContent = translations[lang]['dia1.act1.location'];
    document.getElementById('dia1-act1-note').textContent = translations[lang]['dia1.act1.note'];
    document.getElementById('dia1-act2-title').textContent = translations[lang]['dia1.act2.title'];
    document.getElementById('dia1-act2-location').textContent = translations[lang]['dia1.act2.location'];
    document.getElementById('dia1-act2-note').textContent = translations[lang]['dia1.act2.note'];
    document.getElementById('dia1-act3-title').textContent = translations[lang]['dia1.act3.title'];
    document.getElementById('dia1-act3-location').textContent = translations[lang]['dia1.act3.location'];
    document.getElementById('dia1-act3-note').textContent = translations[lang]['dia1.act3.note'];
    document.getElementById('dia1-act4-title').textContent = translations[lang]['dia1.act4.title'];
    document.getElementById('dia1-act4-location').textContent = translations[lang]['dia1.act4.location'];
    document.getElementById('dia1-act4-note').textContent = translations[lang]['dia1.act4.note'];
    document.getElementById('dia1-act5-title').textContent = translations[lang]['dia1.act5.title'];
    document.getElementById('dia1-act5-location').textContent = translations[lang]['dia1.act5.location'];
    document.getElementById('dia1-act5-note').textContent = translations[lang]['dia1.act5.note'];
    document.getElementById('dia1-act6-title').textContent = translations[lang]['dia1.act6.title'];
    document.getElementById('dia1-act6-location').textContent = translations[lang]['dia1.act6.location'];
    document.getElementById('dia1-act6-note').textContent = translations[lang]['dia1.act6.note'];
    document.getElementById('dia1-act7-title').textContent = translations[lang]['dia1.act7.title'];
    document.getElementById('dia1-act7-location').textContent = translations[lang]['dia1.act7.location'];
    document.getElementById('dia1-act7-note').textContent = translations[lang]['dia1.act7.note'];
    
    // Dia 2 atividades
    document.getElementById('dia2-act1-title').textContent = translations[lang]['dia2.act1.title'];
    document.getElementById('dia2-act1-location').textContent = translations[lang]['dia2.act1.location'];
    document.getElementById('dia2-act1-note').textContent = translations[lang]['dia2.act1.note'];
    document.getElementById('dia2-act2-title').textContent = translations[lang]['dia2.act2.title'];
    document.getElementById('dia2-act2-location').textContent = translations[lang]['dia2.act2.location'];
    document.getElementById('dia2-act2-note').textContent = translations[lang]['dia2.act2.note'];
    document.getElementById('dia2-act3-title').textContent = translations[lang]['dia2.act3.title'];
    document.getElementById('dia2-act3-location').textContent = translations[lang]['dia2.act3.location'];
    document.getElementById('dia2-act3-note').textContent = translations[lang]['dia2.act3.note'];
    document.getElementById('dia2-act4-title').textContent = translations[lang]['dia2.act4.title'];
    document.getElementById('dia2-act4-location').textContent = translations[lang]['dia2.act4.location'];
    document.getElementById('dia2-act4-note').textContent = translations[lang]['dia2.act4.note'];
    document.getElementById('dia2-act5-title').textContent = translations[lang]['dia2.act5.title'];
    document.getElementById('dia2-act5-location').textContent = translations[lang]['dia2.act5.location'];
    document.getElementById('dia2-act5-note').textContent = translations[lang]['dia2.act5.note'];
    document.getElementById('dia2-act6-title').textContent = translations[lang]['dia2.act6.title'];
    document.getElementById('dia2-act6-location').textContent = translations[lang]['dia2.act6.location'];
    document.getElementById('dia2-act6-note').textContent = translations[lang]['dia2.act6.note'];
    document.getElementById('dia2-act7-title').textContent = translations[lang]['dia2.act7.title'];
    document.getElementById('dia2-act7-location').textContent = translations[lang]['dia2.act7.location'];
    document.getElementById('dia2-act7-note').textContent = translations[lang]['dia2.act7.note'];
    document.getElementById('dia2-act8-title').textContent = translations[lang]['dia2.act8.title'];
    document.getElementById('dia2-act8-location').textContent = translations[lang]['dia2.act8.location'];
    document.getElementById('dia2-act8-note').textContent = translations[lang]['dia2.act8.note'];
    
    // Dia 3 atividades
    document.getElementById('dia3-act1-title').textContent = translations[lang]['dia3.act1.title'];
    document.getElementById('dia3-act1-location').textContent = translations[lang]['dia3.act1.location'];
    document.getElementById('dia3-act2-title').textContent = translations[lang]['dia3.act2.title'];
    document.getElementById('dia3-act2-location').textContent = translations[lang]['dia3.act2.location'];
    document.getElementById('dia3-act2-note').textContent = translations[lang]['dia3.act2.note'];
    document.getElementById('dia3-act3-title').textContent = translations[lang]['dia3.act3.title'];
    document.getElementById('dia3-act3-location').textContent = translations[lang]['dia3.act3.location'];
    document.getElementById('dia3-act3-note').textContent = translations[lang]['dia3.act3.note'];
    document.getElementById('dia3-act4-title').textContent = translations[lang]['dia3.act4.title'];
    document.getElementById('dia3-act4-location').textContent = translations[lang]['dia3.act4.location'];
    document.getElementById('dia3-act4-note').textContent = translations[lang]['dia3.act4.note'];
    document.getElementById('dia3-act5-title').textContent = translations[lang]['dia3.act5.title'];
    document.getElementById('dia3-act5-location').textContent = translations[lang]['dia3.act5.location'];
    document.getElementById('dia3-act5-note').textContent = translations[lang]['dia3.act5.note'];
    document.getElementById('dia3-act6-title').textContent = translations[lang]['dia3.act6.title'];
    document.getElementById('dia3-act6-location').textContent = translations[lang]['dia3.act6.location'];
    document.getElementById('dia3-act6-note').textContent = translations[lang]['dia3.act6.note'];
    document.getElementById('dia3-act7-title').textContent = translations[lang]['dia3.act7.title'];
    document.getElementById('dia3-act7-location').textContent = translations[lang]['dia3.act7.location'];
    document.getElementById('dia3-act7-note').textContent = translations[lang]['dia3.act7.note'];
    document.getElementById('dia3-act8-title').textContent = translations[lang]['dia3.act8.title'];
    document.getElementById('dia3-act8-location').textContent = translations[lang]['dia3.act8.location'];
    document.getElementById('dia3-act8-note').textContent = translations[lang]['dia3.act8.note'];
    
    // Dia 4 atividades
    document.getElementById('dia4-act1-title').textContent = translations[lang]['dia4.act1.title'];
    document.getElementById('dia4-act1-location').textContent = translations[lang]['dia4.act1.location'];
    document.getElementById('dia4-act2-title').textContent = translations[lang]['dia4.act2.title'];
    document.getElementById('dia4-act2-location').textContent = translations[lang]['dia4.act2.location'];
    document.getElementById('dia4-act2-note').textContent = translations[lang]['dia4.act2.note'];
    document.getElementById('dia4-act3-title').textContent = translations[lang]['dia4.act3.title'];
    document.getElementById('dia4-act3-location').textContent = translations[lang]['dia4.act3.location'];
    document.getElementById('dia4-act3-note').textContent = translations[lang]['dia4.act3.note'];
    document.getElementById('dia4-act4-title').textContent = translations[lang]['dia4.act4.title'];
    document.getElementById('dia4-act4-location').textContent = translations[lang]['dia4.act4.location'];
    document.getElementById('dia4-act4-note').textContent = translations[lang]['dia4.act4.note'];
    document.getElementById('dia4-act5-title').textContent = translations[lang]['dia4.act5.title'];
    document.getElementById('dia4-act5-location').textContent = translations[lang]['dia4.act5.location'];
    document.getElementById('dia4-act6-title').textContent = translations[lang]['dia4.act6.title'];
    document.getElementById('dia4-act6-location').textContent = translations[lang]['dia4.act6.location'];
    document.getElementById('dia4-act7-title').textContent = translations[lang]['dia4.act7.title'];
    document.getElementById('dia4-act7-location').textContent = translations[lang]['dia4.act7.location'];
    document.getElementById('dia4-act7-note').textContent = translations[lang]['dia4.act7.note'];
    document.getElementById('dia4-act8-title').textContent = translations[lang]['dia4.act8.title'];
    document.getElementById('dia4-act8-location').textContent = translations[lang]['dia4.act8.location'];
    document.getElementById('dia4-act8-note').textContent = translations[lang]['dia4.act8.note'];
    
    // Dia 5 atividades
    document.getElementById('dia5-act1-title').textContent = translations[lang]['dia5.act1.title'];
    document.getElementById('dia5-act1-location').textContent = translations[lang]['dia5.act1.location'];
    document.getElementById('dia5-act1-note').textContent = translations[lang]['dia5.act1.note'];
    document.getElementById('dia5-act2-title').textContent = translations[lang]['dia5.act2.title'];
    document.getElementById('dia5-act2-location').textContent = translations[lang]['dia5.act2.location'];
    document.getElementById('dia5-act2-note').textContent = translations[lang]['dia5.act2.note'];
    document.getElementById('dia5-act3-title').textContent = translations[lang]['dia5.act3.title'];
    document.getElementById('dia5-act3-location').textContent = translations[lang]['dia5.act3.location'];
    document.getElementById('dia5-act3-note').textContent = translations[lang]['dia5.act3.note'];
    document.getElementById('dia5-act4-title').textContent = translations[lang]['dia5.act4.title'];
    document.getElementById('dia5-act4-location').textContent = translations[lang]['dia5.act4.location'];
    document.getElementById('dia5-act4-note').textContent = translations[lang]['dia5.act4.note'];
    document.getElementById('dia5-act5-title').textContent = translations[lang]['dia5.act5.title'];
    document.getElementById('dia5-act5-location').textContent = translations[lang]['dia5.act5.location'];
    document.getElementById('dia5-act5-note').textContent = translations[lang]['dia5.act5.note'];
    document.getElementById('dia5-act6-title').textContent = translations[lang]['dia5.act6.title'];
    document.getElementById('dia5-act6-location').textContent = translations[lang]['dia5.act6.location'];
    document.getElementById('dia5-act6-note').textContent = translations[lang]['dia5.act6.note'];
    document.getElementById('dia5-act7-title').textContent = translations[lang]['dia5.act7.title'];
    document.getElementById('dia5-act7-location').textContent = translations[lang]['dia5.act7.location'];
    document.getElementById('dia5-act8-title').textContent = translations[lang]['dia5.act8.title'];
    document.getElementById('dia5-act8-location').textContent = translations[lang]['dia5.act8.location'];
    document.getElementById('dia5-act8-note').textContent = translations[lang]['dia5.act8.note'];
    
    // Dia 6 atividades
    document.getElementById('dia6-act1-title').textContent = translations[lang]['dia6.act1.title'];
    document.getElementById('dia6-act1-location').textContent = translations[lang]['dia6.act1.location'];
    document.getElementById('dia6-act2-title').textContent = translations[lang]['dia6.act2.title'];
    document.getElementById('dia6-act2-location').textContent = translations[lang]['dia6.act2.location'];
    document.getElementById('dia6-act2-note').textContent = translations[lang]['dia6.act2.note'];
    document.getElementById('dia6-act3-title').textContent = translations[lang]['dia6.act3.title'];
    document.getElementById('dia6-act3-location').textContent = translations[lang]['dia6.act3.location'];
    document.getElementById('dia6-act4-title').textContent = translations[lang]['dia6.act4.title'];
    document.getElementById('dia6-act4-location').textContent = translations[lang]['dia6.act4.location'];
    document.getElementById('dia6-act4-note').textContent = translations[lang]['dia6.act4.note'];
    document.getElementById('dia6-act5-title').textContent = translations[lang]['dia6.act5.title'];
    document.getElementById('dia6-act5-location').textContent = translations[lang]['dia6.act5.location'];
    document.getElementById('dia6-act5-note').textContent = translations[lang]['dia6.act5.note'];
    document.getElementById('dia6-act6-title').textContent = translations[lang]['dia6.act6.title'];
    document.getElementById('dia6-act6-location').textContent = translations[lang]['dia6.act6.location'];
    document.getElementById('dia6-act6-note').textContent = translations[lang]['dia6.act6.note'];
    document.getElementById('dia6-act7-title').textContent = translations[lang]['dia6.act7.title'];
    document.getElementById('dia6-act7-location').textContent = translations[lang]['dia6.act7.location'];
    document.getElementById('dia6-act7-note').textContent = translations[lang]['dia6.act7.note'];
    document.getElementById('dia6-act8-title').textContent = translations[lang]['dia6.act8.title'];
    document.getElementById('dia6-act8-location').textContent = translations[lang]['dia6.act8.location'];
    
    // Dia 7 atividades
    document.getElementById('dia7-act1-title').textContent = translations[lang]['dia7.act1.title'];
    document.getElementById('dia7-act1-location').textContent = translations[lang]['dia7.act1.location'];
    document.getElementById('dia7-act1-note').textContent = translations[lang]['dia7.act1.note'];
    document.getElementById('dia7-act2-title').textContent = translations[lang]['dia7.act2.title'];
    document.getElementById('dia7-act2-location').textContent = translations[lang]['dia7.act2.location'];
    document.getElementById('dia7-act2-note').textContent = translations[lang]['dia7.act2.note'];
    document.getElementById('dia7-act3-title').textContent = translations[lang]['dia7.act3.title'];
    document.getElementById('dia7-act3-location').textContent = translations[lang]['dia7.act3.location'];
    document.getElementById('dia7-act3-note').textContent = translations[lang]['dia7.act3.note'];
    document.getElementById('dia7-act4-title').textContent = translations[lang]['dia7.act4.title'];
    document.getElementById('dia7-act4-location').textContent = translations[lang]['dia7.act4.location'];
    document.getElementById('dia7-act5-title').textContent = translations[lang]['dia7.act5.title'];
    document.getElementById('dia7-act5-location').textContent = translations[lang]['dia7.act5.location'];
    document.getElementById('dia7-act6-title').textContent = translations[lang]['dia7.act6.title'];
    document.getElementById('dia7-act6-location').textContent = translations[lang]['dia7.act6.location'];
    document.getElementById('dia7-act7-title').textContent = translations[lang]['dia7.act7.title'];
    document.getElementById('dia7-act7-location').textContent = translations[lang]['dia7.act7.location'];
    document.getElementById('dia7-act7-note').textContent = translations[lang]['dia7.act7.note'];
    document.getElementById('dia7-act8-title').textContent = translations[lang]['dia7.act8.title'];
    document.getElementById('dia7-act8-location').textContent = translations[lang]['dia7.act8.location'];
    document.getElementById('dia7-act8-note').textContent = translations[lang]['dia7.act8.note'];
    document.getElementById('dia7-act9-title').textContent = translations[lang]['dia7.act9.title'];
    document.getElementById('dia7-act9-location').textContent = translations[lang]['dia7.act9.location'];
    document.getElementById('dia7-act9-note').textContent = translations[lang]['dia7.act9.note'];
    
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
    document.getElementById('checklist-1').innerHTML = translations[lang]['checklist.1'];
    document.getElementById('checklist-2').innerHTML = translations[lang]['checklist.2'];
    document.getElementById('checklist-3').innerHTML = translations[lang]['checklist.3'];
    document.getElementById('checklist-4').innerHTML = translations[lang]['checklist.4'];
    document.getElementById('checklist-5').innerHTML = translations[lang]['checklist.5'];
    document.getElementById('checklist-6').innerHTML = translations[lang]['checklist.6'];
    document.getElementById('checklist-7').innerHTML = translations[lang]['checklist.7'];
    document.getElementById('checklist-8').innerHTML = translations[lang]['checklist.8'];
    
    // Footer
    document.getElementById('footer-text').innerHTML = translations[lang]['footer.text'] + '<br>30 Março - 5 Abril 2025';
    
    // Cost labels
    document.querySelectorAll('.cost-label').forEach(el => {
        el.textContent = translations[lang]['cost.label'];
    });
}

function setLanguage(lang) {
    currentLang = lang;
    translatePage(lang);
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt-pt' ? 'pt-PT' : 'es-ES';
}

// Initial translation
document.addEventListener('DOMContentLoaded', function() {
    translatePage('pt-pt');
});