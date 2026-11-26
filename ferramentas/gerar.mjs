// Gera index.html, páginas de serviço (servicos/*.html), sitemap.xml e robots.txt
// Uso: node ferramentas/gerar.mjs
import fs from "fs"; import path from "path"; import vm from "vm"; import { fileURLToPath } from "url";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const URL = "https://pmremodelacoes.pt";
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(RAIZ, "servicos.js"), "utf8"), ctx);
const SERV = ctx.window.PM_SERVICOS;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const HOJE = new Date().toISOString().slice(0, 10);
const ZONAS = ["Lisboa", "Oeiras", "Cascais", "Amadora", "Odivelas", "Loures", "Almada", "Seixal", "Barreiro", "Moita", "Montijo", "Alcochete", "Sesimbra", "Palmela", "Setúbal"];

/* Conteúdo SEO de cada serviço (página própria) */
const SEO = {
  microcimento: {
    title: "Microcimento em Lisboa e Margem Sul · Richimi Koncreto | Paulo Machado",
    h1: "Microcimento em Lisboa e Margem Sul",
    kw: "microcimento Lisboa, microcimento Almada, microcimento Setúbal, microcimento casa de banho, Mortex, pavimento contínuo",
    texto: [
      "O microcimento é um revestimento contínuo, sem juntas, com apenas 2 a 3 mm de espessura. Pode ser aplicado sobre o pavimento ou o azulejo existente, sem demolições, e cria superfícies elegantes em pavimentos, paredes, casas de banho, bases de duche, escadas e bancadas.",
      "Trabalhamos com o sistema Koncreto da Richimi, microcimento fabricado em Portugal desde 2008, disponível em 132 cores de catálogo, em textura fina (F) ou rústica (R), com vernizes Ultra Matte ou acetinado próprios para zonas húmidas.",
      "Antes da obra pode experimentar cores, texturas e luz no nosso showroom 3D. Na visita levamos o mostruário físico para escolher a cor final com a luz real da sua casa."
    ],
    faq: [["O microcimento pode ser aplicado sobre azulejo?", "Sim. Depois de verificar a aderência e de preencher as juntas, aplicamos primário e malha de fibra de vidro e o microcimento diretamente sobre o azulejo existente, sem demolições."], ["O microcimento é escorregadio na casa de banho?", "Com o verniz adequado e a textura certa, não. Em bases de duche usamos acabamentos com maior aderência."], ["Quanto tempo dura o microcimento?", "Bem aplicado e com a manutenção do verniz, dura muitos anos. Recomendamos renovar o verniz em zonas de muito uso ao fim de alguns anos."]]
  },
  remodelacao: {
    title: "Remodelações chave na mão em Lisboa e Margem Sul | Paulo Machado",
    h1: "Remodelações completas em Lisboa e Margem Sul",
    kw: "remodelações Lisboa, remodelação casa de banho, remodelação cozinha, remodelação apartamento Almada, obras Seixal, empresa de remodelações Setúbal",
    texto: [
      "Fazemos remodelações completas de casas de banho, cozinhas e apartamentos, chave na mão. Tratamos da demolição, canalização, eletricidade, pladur, revestimentos, pintura e montagem final, com uma só equipa e um só responsável.",
      "Cada remodelação começa com uma visita e um orçamento detalhado por escrito, com materiais, prazos e valores. Durante a obra protegemos a casa, mantemos tudo limpo e informamos sempre do ponto em que está o trabalho.",
      "No showroom 3D pode ver a obra a ser feita, passo a passo, e escolher acabamentos antes de começarmos."
    ],
    faq: [["Quanto custa remodelar uma casa de banho?", "Depende da dimensão, dos materiais e do estado das instalações. Fazemos visita e orçamento detalhado sem compromisso."], ["Preciso de licença para remodelar?", "Obras interiores sem alteração de estrutura, fachada ou cércea costumam estar isentas de licença, mas pode ser necessária comunicação ao condomínio. Ajudamos a verificar o seu caso."], ["Posso ficar a viver em casa durante a obra?", "Em muitos casos sim. Planeamos as fases para reduzir o incómodo e protegemos as zonas que não estão em obra."]]
  },
  "pintura-interior": {
    title: "Pintura de interiores em Lisboa e Margem Sul · Pintor profissional | Paulo Machado",
    h1: "Pintura de interiores em Lisboa e Margem Sul",
    kw: "pintor Lisboa, pintura de interiores Almada, pintar apartamento Seixal, pintura de paredes e tetos, pintor Setúbal",
    texto: [
      "Pintamos apartamentos, moradias e escritórios com uma preparação cuidada: reparação de fissuras e buracos, massa, lixagem e primário antes de qualquer demão. É essa preparação que faz a diferença num acabamento de alto padrão.",
      "Usamos tintas laváveis de qualidade, em mate ou acetinado, e protegemos pavimentos, móveis e caixilharia durante todo o trabalho. No fim, limpamos e deixamos a casa pronta a usar.",
      "Não sabe que cor escolher? Experimente as paredes e a parede de destaque no nosso showroom 3D, com luz natural ou LED."
    ],
    faq: [["Quanto tempo demora a pintar um T2?", "Em média entre 2 e 6 dias úteis, com paredes e tetos, dependendo do estado das paredes e das cores escolhidas."], ["Tenho de tirar os móveis?", "Não é necessário. Afastamos e protegemos os móveis e voltamos a colocá-los no lugar."], ["Mate ou acetinado?", "O mate disfarça imperfeições e é ideal para salas e quartos. O acetinado é mais lavável, indicado para cozinhas, corredores e quartos de criança."]]
  },
  "pintura-exterior": {
    title: "Pintura de fachadas e exteriores em Lisboa e Margem Sul | Paulo Machado",
    h1: "Pintura de fachadas e exteriores",
    kw: "pintura de fachadas Lisboa, pintura exterior Almada, recuperação de fachadas Setúbal, pintar moradia Seixal, tratamento de fissuras",
    texto: [
      "Recuperamos e pintamos fachadas de moradias e prédios, muros e anexos. Começamos com andaime certificado e proteções, lavagem a alta pressão, tratamento anti-fungos e reparação de fissuras e reboco.",
      "Aplicamos primário fixador e tintas elastoméricas ou de siloxano, impermeáveis à chuva e permeáveis ao vapor, resistentes aos UV e à maresia, ideais para o clima de Lisboa e da Margem Sul.",
      "No showroom 3D pode testar a cor da fachada e da barra com luz da manhã, do meio-dia, do pôr do sol e de noite."
    ],
    faq: [["Qual a melhor altura para pintar a fachada?", "Primavera e verão, com tempo seco e temperaturas amenas. Evitamos dias de chuva e calor extremo."], ["Quanto tempo dura uma pintura de fachada?", "Com boa preparação e tinta de qualidade, entre 8 e 12 anos ou mais, dependendo da exposição."], ["Tratam fissuras e humidades?", "Sim. Abrimos, selamos e reforçamos as fissuras e tratamos fungos e algas antes de pintar."]]
  },
  pladur: {
    title: "Pladur, gesso cartonado e tetos falsos em Lisboa e Margem Sul | Paulo Machado",
    h1: "Pladur, gesso cartonado e tetos falsos",
    kw: "pladur Lisboa, teto falso Almada, gesso cartonado Seixal, sanca LED, nichos em pladur, paredes divisórias Setúbal",
    texto: [
      "Executamos tetos falsos, sancas com iluminação LED, paredes divisórias, nichos, arcos e revestimentos em gesso cartonado (pladur), com estrutura metálica galvanizada e isolamento térmico e acústico em lã mineral.",
      "Em casas de banho e cozinhas usamos placas hidrófugas. O tratamento de juntas é feito em várias passagens, com fita e massa, até obter uma superfície contínua e perfeita para pintura.",
      "Veja no showroom 3D como fica uma sanca com luz indireta e um nicho iluminado, de dia e de noite."
    ],
    faq: [["O pladur é resistente?", "Sim, com a estrutura adequada. Para pendurar objetos pesados reforçamos a estrutura nos pontos necessários."], ["O pladur isola o som?", "Com lã mineral no interior e placas duplas, uma parede de pladur pode ter excelente isolamento acústico."], ["Quanto tempo demora um teto falso?", "Uma divisão fica pronta em 2 a 5 dias úteis, incluindo tratamento de juntas."]]
  },
  canalizacao: {
    title: "Canalizador em Lisboa e Margem Sul · Canalizações e esgotos | Paulo Machado",
    h1: "Canalizações em Lisboa e Margem Sul",
    kw: "canalizador Lisboa, canalizador Almada, substituir canalização, rede de águas e esgotos, multicamada, canalizador Setúbal",
    texto: [
      "Fazemos redes novas de água quente e fria em tubo multicamada, esgotos em PVC com a inclinação correta, substituição de canalizações antigas em ferro ou chumbo, e montagem de louças, bases de duche e torneiras.",
      "Antes de fechar as paredes, toda a rede é testada em pressão durante várias horas. Só avançamos para os acabamentos quando temos a certeza de que não há fugas.",
      "No showroom 3D pode ver a canalização por dentro das paredes, em modo raio-X."
    ],
    faq: [["Devo substituir a canalização antiga?", "Se a casa tem tubagem em ferro galvanizado ou chumbo, ou fugas frequentes, a substituição evita problemas maiores e melhora a pressão da água."], ["Quanto tempo fico sem água?", "Planeamos os cortes para serem curtos. Na maioria das obras, a água é cortada apenas durante algumas horas."], ["Fazem reparações de fugas?", "Sim, fazemos reparações pontuais e deteção de fugas."]]
  },
  pavimentos: {
    title: "Pavimentos flutuantes, vinílico e cerâmico em Lisboa e Margem Sul | Paulo Machado",
    h1: "Colocação de pavimentos",
    kw: "pavimento flutuante Lisboa, colocação de pavimento Almada, vinílico Seixal, parquet espinha, porcelânico grande formato, pavimentos Setúbal",
    texto: [
      "Colocamos pavimento flutuante, parquet, vinílico, porcelânico e cerâmico de grande formato, e também microcimento contínuo. Começamos sempre pela base: remoção do pavimento antigo, regularização com autonivelante e manta acústica ou cola adequada.",
      "Trabalhamos com alinhamento rigoroso, cortes limpos, juntas de dilatação controladas, rodapés e perfis de transição. O resultado é um pavimento plano, silencioso e duradouro.",
      "Compare pavimentos lado a lado no showroom 3D, com luz natural e artificial."
    ],
    faq: [["Posso colocar flutuante sobre o pavimento antigo?", "Muitas vezes sim, se a base estiver plana e estável. Avaliamos na visita."], ["Vinílico ou flutuante?", "O vinílico é resistente à água e ideal para cozinhas e casas de banho. O flutuante tem um toque mais natural e é ótimo para salas e quartos."], ["Quanto tempo demora?", "Em média 2 a 3 dias para 50 m² de flutuante ou vinílico e 4 a 6 dias para cerâmico."]]
  },
  eletricidade: {
    title: "Eletricista em Lisboa e Margem Sul · Instalações elétricas e LED | Paulo Machado",
    h1: "Eletricidade e iluminação",
    kw: "eletricista Lisboa, eletricista Almada, quadro elétrico, remodelação elétrica, iluminação LED, focos encastrados Seixal",
    texto: [
      "Fazemos instalações elétricas novas e remodelações: quadro elétrico com disjuntores e diferenciais por circuito, tubagem, cablagem com a secção correta, tomadas, interruptores, focos encastrados e fitas LED.",
      "Pensamos a iluminação como parte do projeto: luz geral, luz de trabalho e luz de ambiente, com a temperatura de cor e o índice de reprodução de cor certos para cada divisão.",
      "No showroom 3D pode ver os circuitos por dentro das paredes e simular a iluminação de dia e de noite."
    ],
    faq: [["Preciso de mudar o quadro elétrico?", "Quadros antigos sem diferenciais ou com fusíveis devem ser substituídos por segurança."], ["Que temperatura de luz devo escolher?", "Em salas e quartos, 2700 a 3000 K. Em cozinhas, casas de banho e escritórios, 3500 a 4000 K, sempre com IRC de 90 ou mais."], ["A instalação fica certificada?", "Entregamos a instalação testada e pronta a certificar, e acompanhamos o processo de certificação quando é necessário."]]
  }
};
const FAQ_GERAL = [
  ["O orçamento é gratuito?", "Sim. A visita ao local e o orçamento detalhado são gratuitos e sem compromisso."],
  ["Em que zonas trabalham?", "Em Lisboa (Lisboa, Oeiras, Cascais, Amadora, Odivelas e Loures) e em toda a Margem Sul (Almada, Seixal, Barreiro, Moita, Montijo, Alcochete, Sesimbra, Palmela e Setúbal). Não realizamos obras na zona Norte."],
  ["Quanto tempo demora uma obra?", "Cada serviço tem um tempo médio, que pode ver na secção de serviços. O prazo varia sempre consoante a dimensão da obra, o estado do espaço e os materiais escolhidos, e fica definido por escrito no orçamento."],
  ["Tratam da compra dos materiais?", "Sim. Podemos tratar de tudo ou trabalhar com materiais escolhidos por si. Ajudamos a escolher para garantir qualidade e o melhor preço."],
  ["Que microcimento usam?", "Trabalhamos com o microcimento Koncreto da Richimi, fabricado em Portugal, em 132 cores de catálogo, com textura fina ou rústica e vernizes Ultra Matte ou acetinado."],
  ["O que é o showroom 3D?", "É um simulador no nosso site onde pode escolher cores, acabamentos e luz, e ver cada etapa da obra em 3D antes de começarmos."]
];

const svgClock = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>';
const arrow = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const passosHTML = s => `<ol class="svc-steps">${s.passos.map(p => `<li><div><b>${esc(p.t)}</b><p>${esc(p.d)}</p></div><span class="dur">≈ ${esc(p.dur)}</span></li>`).join("")}</ol>`;
const tempoHTML = s => `<div class="svc-meta"><span class="clock">${svgClock}</span><div><b>Tempo médio: ${esc(s.tempo)}</b><span>${esc(s.ref)}</span><em>O prazo pode variar consoante a dimensão da obra, o estado do espaço e os materiais escolhidos. Confirmamos sempre o prazo no orçamento.</em></div></div>`;
const faqHTML = l => l.map(([q, a]) => `<details class="rv"><summary>${esc(q)}<i></i></summary><p>${esc(a)}</p></details>`).join("");
const faqLD = l => ({ "@type": "FAQPage", mainEntity: l.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
const NEGOCIO = {
  "@type": "HomeAndConstructionBusiness", "@id": URL + "/#empresa", name: "Paulo Machado Remodelações", slogan: "Alto padrão começa nos detalhes",
  url: URL + "/", logo: URL + "/img/logo.png", image: URL + "/img/hero-showroom.jpg", telephone: "+351935624419", email: "pmachado.remodelacoes@gmail.com",
  priceRange: "€€€", address: { "@type": "PostalAddress", addressLocality: "Almada", addressRegion: "Setúbal", addressCountry: "PT" },
  areaServed: ZONAS.map(z => ({ "@type": "City", name: z })),
  knowsAbout: ["Microcimento", "Remodelações", "Pintura", "Pladur", "Canalização", "Pavimentos", "Eletricidade"],
  hasOfferCatalog: { "@type": "OfferCatalog", name: "Serviços", itemListElement: SERV.map(s => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.nome, url: `${URL}/servicos/${s.id}.html` } })) }
};

/* ---------- index ---------- */
let idx = fs.readFileSync(path.join(RAIZ, "ferramentas/index.src.html"), "utf8");
const tabs = SERV.map((s, i) => `<li role="presentation"><button role="tab" id="t-${s.id}" data-id="${s.id}" aria-controls="p-${s.id}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><span class="num">${String(i + 1).padStart(2, "0")}</span><span class="nm">${esc(s.nome)}</span><span class="tm">${esc(s.tempo)}</span></button></li>`).join("");
const panels = SERV.map((s, i) => `<article class="svc-panel" id="p-${s.id}" role="tabpanel" aria-labelledby="t-${s.id}"${i ? " hidden" : ""}>
  <div class="svc-img"><img src="img/servico-${s.id}.jpg" alt="${esc(s.nome)}: simulação no showroom 3D" width="1200" height="900" loading="lazy"><a class="badge3d" href="showroom.html#${s.id}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M12 22V12M3 7l9 5 9-5"/></svg>Ver em 3D, passo a passo</a><small>Simulação 3D</small></div>
  <div class="svc-body">
    <h3>${esc(s.nome)}</h3><p class="curto">${esc(s.curto)}</p><p>${esc(s.desc)}</p>
    ${tempoHTML(s)}
    <div class="svc-steps-h"><h4>Passo a passo</h4></div>
    ${passosHTML(s)}
    <div class="svc-ctas"><a class="btn" href="#contacto" data-orc="${esc(s.nome)}">Pedir orçamento ${arrow}</a><a class="btn ghost" href="servicos/${s.id}.html" style="color:var(--ink)">Saber mais</a></div>
  </div>
</article>`).join("\n");
const opts = SERV.map(s => `<label><input type="checkbox" name="servico" value="${esc(s.nome)}">${esc(s.nome)}</label>`).join("");
const flinks = SERV.map(s => `<li><a href="servicos/${s.id}.html">${esc(s.nome)}</a></li>`).join("");
const marquee = SERV.map(s => `<span>${esc(s.nome)}</span>`).join("");
const schemaIdx = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [NEGOCIO, { "@type": "WebSite", "@id": URL + "/#site", url: URL + "/", name: "Paulo Machado Remodelações", inLanguage: "pt-PT" }, faqLD(FAQ_GERAL)] })}</script>`;
idx = idx.replace("<!--TABS-->", tabs).replace("<!--PANELS-->", panels).replace("<!--OPTS-->", opts).replace("<!--FLINKS-->", flinks)
  .replaceAll("<!--MARQUEE-->", marquee).replace("<!--FAQ-->", faqHTML(FAQ_GERAL)).replace("<!--SCHEMA-->", schemaIdx);
fs.writeFileSync(path.join(RAIZ, "index.html"), idx);

/* ---------- páginas de serviço ---------- */
const cab = (rel) => idx.split("<header")[1].split("</header>")[0]
  .replace(/href="#(servicos|processo|inspiracao|sobre|contacto|inicio)"/g, (m, a) => `href="${rel}index.html#${a}"`)
  .replace(/href="showroom\.html"/g, `href="${rel}showroom.html"`).replace(/src="img\//g, `src="${rel}img/`).replace('class="top hide"', 'class="top light"');
const rod = (rel) => idx.split("<footer>")[1].split("</footer>")[0]
  .replace(/href="#(\w+)"/g, (m, a) => `href="${rel}index.html#${a}"`).replace(/href="(showroom\.html|servicos\/)/g, `href="${rel}$1`).replace(/src="img\//g, `src="${rel}img/`);
fs.mkdirSync(path.join(RAIZ, "servicos"), { recursive: true });
for (const s of SERV) {
  const x = SEO[s.id], rel = "../", urlP = `${URL}/servicos/${s.id}.html`;
  const outros = SERV.filter(o => o.id !== s.id).slice(0, 3);
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: s.nome, serviceType: s.nome, description: s.desc, provider: { "@id": URL + "/#empresa" }, areaServed: ZONAS.map(z => ({ "@type": "City", name: z })), url: urlP, image: `${URL}/img/servico-${s.id}.jpg` },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Início", item: URL + "/" }, { "@type": "ListItem", position: 2, name: "Serviços", item: URL + "/#servicos" }, { "@type": "ListItem", position: 3, name: s.nome, item: urlP }] },
    faqLD(x.faq), NEGOCIO] };
  const html = `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(x.title)}</title>
<meta name="description" content="${esc(s.desc.slice(0, 150))}… Tempo médio: ${esc(s.tempo)}. Orçamento grátis.">
<meta name="keywords" content="${esc(x.kw)}">
<link rel="canonical" href="${urlP}">
<link rel="icon" type="image/png" href="../img/icone.png">
<meta name="theme-color" content="#121211">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_PT"><meta property="og:site_name" content="Paulo Machado Remodelações">
<meta property="og:title" content="${esc(x.h1)} · Paulo Machado Remodelações"><meta property="og:description" content="${esc(s.curto)}. ${esc(s.tempo)} em média.">
<meta property="og:url" content="${urlP}"><meta property="og:image" content="${URL}/img/servico-${s.id}.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../estilo.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#conteudo">Saltar para o conteúdo</a>
<div class="progress" aria-hidden="true"></div>
<header${cab(rel)}</header>
<main id="conteudo">
<section class="page-hero">
  <div class="bg"><img src="../img/servico-${s.id}.jpg" alt="" width="1200" height="900"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Caminho"><a href="../index.html">Início</a> / <a href="../index.html#servicos">Serviços</a> / ${esc(s.nome)}</nav>
    <span class="eyebrow">${esc(s.curto)} · Lisboa e Margem Sul</span>
    <h1 style="margin-top:18px">${esc(x.h1)}</h1>
    <p class="lead">${esc(s.desc)}</p>
    <div class="hero-ctas"><a class="btn gold" href="../index.html#contacto">Pedir orçamento grátis ${arrow}</a><a class="btn ghost" href="../showroom.html#${s.id}">Ver em 3D, passo a passo</a></div>
  </div>
</section>
<section>
  <div class="wrap svc-page">
    <div class="prose">
      <h2>${esc(s.nome)} com acabamento de alto padrão</h2>
      ${x.texto.map(t => `<p>${esc(t)}</p>`).join("\n      ")}
      <figure><img src="../img/servico-${s.id}.jpg" alt="${esc(s.nome)}: simulação no showroom 3D" width="1200" height="900" loading="lazy"><figcaption>Simulação no showroom 3D da Paulo Machado Remodelações.</figcaption></figure>
      <h2>Passo a passo</h2>
      ${passosHTML(s)}
      <h2>Perguntas frequentes</h2>
      <div class="faq">${faqHTML(x.faq)}</div>
    </div>
    <aside class="side">
      <div class="card">${tempoHTML(s).replace('class="svc-meta"', 'class="svc-meta" style="margin:0;background:none;padding:0"')}</div>
      <div class="card"><h3>O que inclui</h3><ul>${s.inclui.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>
      <div class="card"><h3>Zonas</h3><p style="font-size:14.5px;color:var(--ink2)">${ZONAS.join(", ")}.</p></div>
      <a class="btn gold" href="https://wa.me/351935624419?text=${encodeURIComponent(`Olá! Gostaria de um orçamento de ${s.nome}.`)}" target="_blank" rel="noopener">Pedir orçamento no WhatsApp</a>
    </aside>
  </div>
</section>
<section style="background:var(--bg2)">
  <div class="wrap">
    <div class="sec-head"><div><span class="eyebrow">Outros serviços</span><h2>Tudo numa só equipa.</h2></div></div>
    <div class="related">${outros.map(o => `<a href="${o.id}.html"><img src="../img/servico-${o.id}.jpg" alt="${esc(o.nome)}" loading="lazy"><div><b>${esc(o.nome)}</b><span>Tempo médio: ${esc(o.tempo)}</span></div></a>`).join("")}</div>
  </div>
</section>
</main>
<footer>${rod(rel)}</footer>
<a class="wa" href="https://wa.me/351935624419?text=${encodeURIComponent(`Olá! Gostaria de um orçamento de ${s.nome}.`)}" target="_blank" rel="noopener" aria-label="Falar pelo WhatsApp"><svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2m4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3"/></svg></a>
<nav class="mbar" aria-label="Contacto rápido"><a href="tel:+351935624419">Ligar</a><a href="https://wa.me/351935624419" target="_blank" rel="noopener">WhatsApp</a></nav>
<script src="../site.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(RAIZ, "servicos", s.id + ".html"), html);
}

/* ---------- sitemap e robots ---------- */
const urls = [["/", "1.0"], ["/showroom.html", "0.8"], ...SERV.map(s => [`/servicos/${s.id}.html`, "0.9"])];
fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, p]) => `<url><loc>${URL}${u}</loc><lastmod>${HOJE}</lastmod><priority>${p}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(RAIZ, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /ferramentas/\nSitemap: ${URL}/sitemap.xml\n`);
console.log("gerado:", 1 + SERV.length, "páginas");
