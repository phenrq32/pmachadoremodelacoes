/* Paulo Machado Remodelações — interações do site */
(function () {
  const WA = "351935624419";
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = $("header.top"), prog = $(".progress");

  /* ---------- Entrada: a porta ---------- */
  const hero = $(".hero.intro-on");
  let introP = 1;
  if (hero && reduz) hero.classList.remove("intro-on");
  if (hero && !reduz) {
    const zoom = $(".intro-zoom", hero), folha = $(".door-leaf", hero), txt = $$(".intro-txt", hero), cue = $(".intro-cue", hero),
      intro = $(".intro", hero), heroIn = $(".hero-in", hero), bg = $(".hero-bg img", hero), luz = $(".door-glow", hero), porta = $(".door", hero);
    let ox = 0, oy = 0, S = 8;
    const medir = () => {
      // medir sem transformação, relativo ao próprio .intro-zoom (vale em qualquer posição de rolagem)
      zoom.style.transform = "none";
      const r2 = porta.getBoundingClientRect(), z = zoom.getBoundingClientRect();
      ox = r2.left - z.left + r2.width / 2; oy = r2.top - z.top + r2.height / 2;
      S = Math.max(innerWidth / r2.width, innerHeight / r2.height) * 1.25;
      zoom.style.transformOrigin = `${ox}px ${oy}px`;
      upd();
    };
    const upd = () => {
      const tot = hero.offsetHeight - innerHeight, p = clamp(scrollY / tot);
      introP = p;
      const d = ease(clamp(p / .4)), z = ease(clamp((p - .34) / .44)), f = clamp((p - .74) / .14);
      folha.style.transform = `rotateY(${-d * 108}deg)`;
      luz.style.opacity = .35 + d * .65;
      zoom.style.transform = `scale(${1 + z * (S - 1)})`;
      txt.forEach(t => t.style.opacity = 1 - clamp(p / .22));
      cue.style.opacity = 1 - clamp(p / .08);
      intro.style.opacity = 1 - f;
      intro.style.visibility = f >= 1 ? "hidden" : "visible";
      const h = clamp((p - .8) / .16);
      heroIn.style.opacity = h; heroIn.style.transform = `translateY(${(1 - h) * 40}px)`;
      bg.style.transform = `scale(${1.25 - .25 * ease(clamp((p - .3) / .7))})`;
      header.classList.toggle("hide", p < .9); document.body.classList.toggle("intro-ativa", p < .9);
    };
    addEventListener("resize", medir); addEventListener("load", medir); medir();
    addEventListener("scroll", () => requestAnimationFrame(upd), { passive: true });
    $(".intro-skip", hero)?.addEventListener("click", () => scrollTo({ top: hero.offsetHeight - innerHeight + 2, behavior: "smooth" }));
    // voltar ao início: salto direto ao topo, sem "rebobinar" a porta numa rolagem suave
    $$('a[href="#inicio"]').forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      scrollTo({ top: 0, behavior: "instant" });
      upd();
    }));
    addEventListener("pageshow", medir);
  }

  /* ---------- Cabeçalho e progresso ---------- */
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    const limite = hero ? hero.offsetHeight - innerHeight * .2 : 40;
    header.classList.toggle("solid", y > limite || header.classList.contains("light"));
  };
  addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true }); onScroll();

  /* ---------- Menu ---------- */
  const burger = $(".burger"), menu = $(".menu");
  burger?.addEventListener("click", () => { const o = menu.classList.toggle("open"); burger.classList.toggle("open", o); header.classList.toggle("menu-open", o); burger.setAttribute("aria-expanded", o); });
  menu?.addEventListener("click", e => { if (e.target.closest("a")) { menu.classList.remove("open"); burger.classList.remove("open"); header.classList.remove("menu-open"); burger.setAttribute("aria-expanded", false); } });

  /* ---------- Revelar ao rolar ---------- */
  $$(".split").forEach(el => { el.innerHTML = el.innerHTML.split(/(<[^>]+>|\s+)/).map(w => !w.trim() || w.startsWith("<") ? w : `<span class="w"><span>${w}</span></span>`).join(""); $$(".w>span", el).forEach((s, i) => s.style.transitionDelay = i * .04 + "s"); });
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .14, rootMargin: "0px 0px -6% 0px" });
  $$(".rv,.split").forEach(el => io.observe(el));

  /* ---------- Serviços (separadores) ---------- */
  const tabs = $$(".svc-tabs button");
  const ativar = (id, foco) => {
    tabs.forEach(b => { const on = b.dataset.id === id; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; if (on && foco) b.focus(); });
    $$(".svc-panel").forEach(p => p.hidden = p.id !== "p-" + id);
  };
  tabs.forEach((b, i) => {
    b.addEventListener("click", () => ativar(b.dataset.id));
    b.addEventListener("keydown", e => { const k = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (k) { e.preventDefault(); ativar(tabs[(i + k + tabs.length) % tabs.length].dataset.id, true); } });
  });
  if (location.hash.startsWith("#s-")) { const id = location.hash.slice(3); if ($("#p-" + id)) ativar(id); }

  /* ---------- Galeria (lightbox) ---------- */
  const lb = $(".lb"), itens = $$(".gal a");
  let li = 0;
  const abrir = i => { li = (i + itens.length) % itens.length; const a = itens[li]; $("img", lb).src = a.href; $("img", lb).alt = $("img", a).alt; $("p", lb).textContent = a.dataset.cap || ""; lb.classList.add("open"); };
  itens.forEach((a, i) => a.addEventListener("click", e => { e.preventDefault(); abrir(i); }));
  lb?.addEventListener("click", e => { if (e.target.closest(".pv")) abrir(li - 1); else if (e.target.closest(".nx")) abrir(li + 1); else if (e.target === lb || e.target.closest(".x")) lb.classList.remove("open"); });
  addEventListener("keydown", e => { if (!lb?.classList.contains("open")) return; if (e.key === "Escape") lb.classList.remove("open"); if (e.key === "ArrowRight") abrir(li + 1); if (e.key === "ArrowLeft") abrir(li - 1); });

  /* ---------- Pedido de orçamento (assistente) ---------- */
  const wz = $(".wizard");
  if (wz) {
    let passo = 0; const passos = $$(".wz-step", wz), barras = $$(".wz-prog i", wz), err = $(".wz-err", wz);
    const mostra = n => { passo = n; passos.forEach((p, i) => p.classList.toggle("on", i === n)); barras.forEach((b, i) => b.classList.toggle("on", i <= n)); err.textContent = ""; };
    const valida = () => {
      if (passo === 0 && !$$("input[name=servico]:checked", wz).length) return "Escolha pelo menos um serviço.";
      if (passo === 2) { if (!wz.nome.value.trim()) return "Indique o seu nome."; if (wz.tel.value.replace(/\D/g, "").length < 9) return "Indique um número de telemóvel válido."; }
      return "";
    };
    wz.addEventListener("click", e => {
      if (e.target.closest(".next")) { const m = valida(); if (m) { err.textContent = m; return; } mostra(passo + 1); }
      if (e.target.closest(".back")) mostra(Math.max(0, passo - 1));
    });
    wz.addEventListener("submit", e => {
      e.preventDefault(); const m = valida(); if (m) { err.textContent = m; return; }
      const sv = $$("input[name=servico]:checked", wz).map(i => i.value).join(", ");
      const t = [`Olá! Gostaria de pedir um orçamento.`, ``, `Nome: ${wz.nome.value.trim()}`, `Telemóvel: ${wz.tel.value.trim()}`, `Serviços: ${sv}`, `Localidade: ${wz.local.value}`, `Área aproximada: ${wz.area.value || "-"}`, `Quando: ${wz.quando.value}`, wz.msg.value.trim() ? `\n${wz.msg.value.trim()}` : ""].join("\n");
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
    });
    // pré-selecionar a partir de links "Pedir orçamento" de cada serviço
    $$("[data-orc]").forEach(a => a.addEventListener("click", () => { const v = a.dataset.orc; $$("input[name=servico]", wz).forEach(i => i.checked = i.value === v); mostra(0); }));
  }
  const ano = $("#ano"); if (ano) ano.textContent = new Date().getFullYear();
})();
