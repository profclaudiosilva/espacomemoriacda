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

  const TOTAL_IMAGENS = 97;
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
    const textoOriginal = el.textContent.trim();
    if (!textoOriginal) return;

    // Guarda texto original para leitores de tela / SEO
    el.setAttribute('aria-label', textoOriginal);
    el.textContent = ''; // limpa para montar spans

    const palavras = textoOriginal.split(/\s+/); // quebra em palavras (qualquer espaçamento)

    const letrasParaAnimar = []; // array com todos spans .letra para aplicar delay depois

    palavras.forEach((palavra, pIndex) => {
      // criar span que representa a palavra inteira (impede quebra no meio)
      const spanPalavra = criarElemento('span', { class: 'palavra' });

      // criar spans por letra dentro da palavra
      for (let i = 0; i < palavra.length; i++) {
        const ch = palavra[i];
        const spanLetra = criarElemento('span', { class: 'letra', text: ch });
        spanPalavra.appendChild(spanLetra);
        letrasParaAnimar.push(spanLetra);
      }

      // anexa a palavra ao elemento principal
      el.appendChild(spanPalavra);

      // se não for a última palavra, insere um espaço normal (permite quebra entre palavras)
      if (pIndex < palavras.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });

    // aplica a animação com delays (mesma lógica que você usava)
    letrasParaAnimar.forEach((sp, idx) => {
      const delay = idx * 0.06 + Math.random() * 0.03;
      sp.style.animation = `entrarLetra 0.85s ${delay}s both cubic-bezier(.2,.8,.2,1)`;
    });
  });
})();



/* ---------- 4) Popular galeria da página ACERVO ---------- */
(function popularAcervo() {
  const galeria = document.getElementById('galeriaAcervo');
  if (!galeria) return;

  const TOTAL_IMAGENS_ACERVO = 97;
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
// EXPANSÃO DE IMAGEM DO ACERVO
(function ativarExpandirImagem() {
  const modal = document.getElementById('modalImagem');
  const imagemExpandida = document.getElementById('imagemExpandida');
  const fechar = document.getElementById('fecharModal');

  // Todas as imagens do acervo
  const imagens = document.querySelectorAll('.card-acervo img');

  imagens.forEach(img => {
    img.addEventListener('click', () => {
      imagemExpandida.src = img.src;
      modal.style.display = "flex";
    });
  });

  // Fechar pelo X
  fechar.addEventListener('click', () => {
    modal.style.display = "none";
    imagemExpandida.src = "";
  });

  // Fechar clicando fora da imagem
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      imagemExpandida.src = "";
    }
  });
})();


/* envio de email------------------- */

  const form = document.getElementById("formContato");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // impede o envio padrão

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        window.location.href = "sobre.html"; // redireciona
      } else {
        alert("Ocorreu um erro ao enviar o formulário. Tente novamente.");
      }

    } catch (error) {
      alert("Falha na comunicação. Verifique sua conexão.");
    }
  });



/* ---------- FIM DO SCRIPT ---------- */
