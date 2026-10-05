(function () {
  'use strict';

  function feedback(btn, msg) {
    var original = btn.textContent;
    btn.textContent = msg;
    btn.classList.add('ok');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('ok');
    }, 1600);
  }

  function copiarFallback(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto).then(
        function () { return true; },
        function () { return copiarFallback(texto); }
      );
    }
    return Promise.resolve(copiarFallback(texto));
  }

  document.addEventListener('click', function (ev) {
    var btnCopiar = ev.target.closest('[data-copiar]');
    if (btnCopiar) {
      ev.preventDefault();
      copiar(btnCopiar.getAttribute('data-copiar')).then(function (ok) {
        feedback(btnCopiar, ok ? '✓ Copiado' : 'Não foi possível copiar');
      });
      return;
    }

    // No celular, usa o menu nativo de compartilhar; senão segue o link do wa.me.
    var btnShare = ev.target.closest('[data-compartilhar]');
    if (btnShare && navigator.share && /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)) {
      ev.preventDefault();
      navigator.share({ text: btnShare.getAttribute('data-compartilhar') }).catch(function () {});
    }
  });

  // Busca na home
  var input = document.getElementById('busca');
  var lista = document.getElementById('busca-resultados');
  if (!input || !lista) return;

  var indice = null;
  var carregando = null;

  function normalizar(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function carregar() {
    if (indice) return Promise.resolve(indice);
    if (!carregando) {
      carregando = fetch(input.getAttribute('data-indice'))
        .then(function (r) { return r.json(); })
        .then(function (dados) {
          indice = dados.map(function (d) {
            d._busca = normalizar(d.tema + ' ' + d.texto);
            return d;
          });
          return indice;
        });
    }
    return carregando;
  }

  function el(tag, texto) {
    var e = document.createElement(tag);
    if (texto) e.textContent = texto;
    return e;
  }

  function render(resultados, termo) {
    lista.innerHTML = '';
    if (!termo) { lista.hidden = true; return; }
    if (!resultados.length) {
      var vazio = el('li', 'Nada encontrado. Tente outra palavra.');
      vazio.className = 'busca-vazio';
      lista.appendChild(vazio);
    }
    resultados.slice(0, 12).forEach(function (r) {
      var li = el('li');
      var a = el('a', r.frase);
      a.href = r.url;
      a.appendChild(el('small', r.icone + ' ' + r.tema));
      li.appendChild(a);
      lista.appendChild(li);
    });
    lista.hidden = false;
  }

  input.addEventListener('focus', carregar, { once: true });
  input.addEventListener('input', function () {
    var termo = normalizar(input.value.trim());
    carregar().then(function (dados) {
      var palavras = termo.split(/\s+/).filter(Boolean);
      var res = dados.filter(function (d) {
        return palavras.every(function (p) { return d._busca.indexOf(p) !== -1; });
      });
      render(res, termo);
    });
  });
})();
