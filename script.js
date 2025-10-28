/**
 * script.js
 * - arquivo principal de comportamento do site
 * - contém: montagem da tira de filme (loop contínuo), duplicação do trilho,
 *   populador da galeria de acervo, animação letra-a-letra para títulos,
 *   controle do menu hamburguer e comportamento responsivo (item central com zoom).
 *
 * Todas variáveis, funções e ids/classes em português.
 */

/* ---------- utilitários ---------- */

function criarElemento(tag, atribs = {}) {
  const el = document.createElement(tag);
  Object.keys(atribs).forEach(ch => {
    if (ch === 'class') el.className = atribs[ch];
    else if (ch === 'text') el.textContent = atribs[ch];
    else el.setAttribute(ch, atribs[ch]);
  });
  return el;
}

/* ---------- 1) Montagem da tira de filme e duplicação ---------- */
(function montarTiraFilme() {
  const trilho = document.getElementById('trilho');
  if (!trilho) return;

  const TOTAL_IMAGENS = 135;
  const CAMINHO = 'imagens/';

  const fragmento = document.createDocumentFragment();

  for (let i = 1; i <= TOTAL_IMAGENS; i++) {
    const quadro = criarElemento('div', { class: 'quadro' });
    const img = criarElemento('img', { src: `${CAMINHO}foto${i}.jpg`, alt: `Registro ${i}` });
    quadro.appendChild(img);
    fragmento.appendChild(quadro);
  }

  trilho.appendChild(fragmento);

  // duplicação para loop contínuo
  trilho.innerHTML += trilho.innerHTML;
})();

/* ---------- 2) Controle do menu hamburguer (mobile) ---------- */
(function controlarMenu() {
  const botoes = document.querySelectorAll('.botao-hamburguer');
  const nav = document.querySelector('.navegacao');
  if (!nav || botoes.length === 0) return;

  botoes.forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('ativo');
      const aberto = nav.classList.contains('ativo');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('ativo')) return;
    const alvo = e.target;
    if (!nav.contains(alvo) && ![...botoes].some(b => b.contains(alvo))) {
      nav.classList.remove('ativo');
      botoes.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });
})();

/* ---------- 3) Animação letra-a-letra para todos títulos com classe .animar-titulo ---------- */
(function animarTitulos() {
  const elementos = document.querySelectorAll('.animar-titulo');
  if (!elementos.length) return;

  elementos.forEach((el) => {
    const texto = el.textContent.trim();
    el.textContent = '';

    const letras = [];
    for (let i = 0; i < texto.length; i++) {
      const ch = texto[i];
      if (ch === ' ') {
        const esp = criarElemento('span', { class: 'letra', text: '\u00A0' });
        el.appendChild(esp);
        letras.push(esp);
      } else {
        const span = criarElemento('span', { class: 'letra', text: ch });
        el.appendChild(span);
        letras.push(span);
      }
    }

    letras.forEach((sp, idx) => {
      const delay = idx * 0.06 + Math.random() * 0.03;
      sp.style.animation = `entrarLetra 0.85s ${delay}s both cubic-bezier(.2,.8,.2,1)`;
    });
  });
})();

/* ---------- 4) Popular galeria da página ACERVO ---------- */
(function popularAcervo() {
  const galeria = document.getElementById('galeriaAcervo');
  if (!galeria) return;

  const TOTAL_IMAGENS_ACERVO = 135;
  const CAMINHO = 'imagens/';

  for (let i = 1; i <= TOTAL_IMAGENS_ACERVO; i++) {
    const card = criarElemento('div', { class: 'card-acervo' });
    const img = criarElemento('img', { src: `${CAMINHO}foto${i}.jpg`, alt: `Acervo ${i}` });
    card.appendChild(img);
    galeria.appendChild(card);
  }
})();

/* ---------- 5) Comportamento do formulário (contato) ---------- */
(function comportamentoFormulario() {
  const form = document.getElementById('formContato');
  if (!form) return;

  const botaoMailto = document.getElementById('botaoMailto');
  if (botaoMailto) {
    botaoMailto.addEventListener('click', () => {
      const nome = document.getElementById('nome').value || '';
      const email = document.getElementById('email').value || '';
      const telefone = document.getElementById('telefone').value || '';
      const mensagem = document.getElementById('mensagem').value || '';
      const assunto = encodeURIComponent(`Contato - Espaço Memória: ${nome}`);
      const corpo = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\n\nMensagem:\n${mensagem}`);
      window.location.href = `mailto:professorclaudiosilva@ifpa.edu.br?subject=${assunto}&body=${corpo}`;
    });
  }

  form.addEventListener('submit', (e) => {
    // envio segue para action configurado
  });
})();

/* ---------- FIM DO SCRIPT ---------- */
