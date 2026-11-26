/* Paulo Machado Remodelações — dados dos serviços (usados pelo site e pelo Showroom 3D).
   Tempos médios: referência para obras de dimensão média. Variam consoante a dimensão e o estado da obra. */
(function () {
  const FIN = { piso: "fin", paredes: "fin", teto: "fin", feature: "fin", canal: 0, eletr: 0, roco: 0, xray: 0, moveis: 1, luzes: 1, obra: 0, prot: 0, isol: 0, entulho: 0, velho: 0, teste: 0, fach: "fin", andaime: 0, rede: 0 };
  const S = o => Object.assign({}, FIN, o);

  window.PM_FIN = FIN;
  window.PM_SERVICOS = [
    {
      id: "microcimento", nome: "Microcimento e Mortex", curto: "Superfícies contínuas, sem juntas",
      cena: "wc", cfg: ["micro", "luz"],
      desc: "Revestimento contínuo de alta resistência para pavimentos, paredes, casas de banho, bancadas e bases de duche. Aplicamos microcimento Richimi Koncreto, fabricado em Portugal, em 132 cores de catálogo, com textura fina ou rústica e verniz Ultra Matte ou acetinado.",
      tempo: "5 a 8 dias úteis", ref: "Casa de banho ou pavimento até 40 m². Uso pleno cerca de 7 dias após o verniz.",
      inclui: ["Preparação e reparação do suporte", "Primário e malha de fibra de vidro", "4 camadas Koncreto (2 base + 2 acabamento)", "Selante e 2 demãos de verniz"],
      img: "img/servico-microcimento.jpg",
      passos: [
        { t: "Proteção e preparação do suporte", dur: "1 dia", d: "Protegemos a casa, retiramos o que estiver solto, reparamos fissuras e regularizamos. Verificamos humidade e aderência do suporte.", s: S({ piso: "betao", paredes: "reboco", moveis: 0, obra: 1, luzes: 0 }), cam: "geral" },
        { t: "Primário de aderência", dur: "½ dia", d: "O primário garante a ligação entre o suporte e o microcimento e controla a absorção.", s: S({ piso: "micro0", paredes: "micro0", moveis: 0, obra: 1, luzes: 0 }), cam: "piso" },
        { t: "Malha de fibra de vidro", dur: "½ dia", d: "Fica embebida na primeira camada, reforça o sistema e evita o aparecimento de fissuras.", s: S({ piso: "micro1", paredes: "micro1", moveis: 0, obra: 1, luzes: 0 }), cam: "piso" },
        { t: "Duas camadas de base Koncreto R", dur: "2 dias", d: "Aplicadas à talocha, com lixagem entre camadas. Criam a base resistente e já levam a cor escolhida.", s: S({ piso: "micro2", paredes: "micro2", moveis: 0, obra: 1, luzes: 0 }), cam: "rasante" },
        { t: "Duas camadas de acabamento Koncreto F", dur: "2 dias", d: "Camadas finas que definem o efeito final e as nuances naturais da talocha.", s: S({ piso: "micro3", paredes: "micro3", moveis: 0, obra: 1, luzes: 0 }), cam: "rasante" },
        { t: "Selante e verniz", dur: "1 a 2 dias", d: "Selante acrílico e duas demãos de Top Coat (Ultra Matte ou Acetinado) para proteger contra água, manchas e desgaste.", s: S({ moveis: 0, luzes: 0 }), cam: "rasante" },
        { t: "Montagem e entrega", dur: "1 dia", d: "Montamos louças e acessórios, limpamos tudo e entregamos. Tráfego ligeiro após 24 a 48 h e uso pleno após cerca de 7 dias.", s: S({}), cam: "geral" }
      ]
    },
    {
      id: "remodelacao", nome: "Remodelações completas", curto: "Do projeto à entrega das chaves",
      cena: "wc", cfg: ["micro", "torneira", "luz"],
      desc: "Remodelação integral de casas de banho, cozinhas e apartamentos. Coordenamos todas as especialidades (demolição, canalização, eletricidade, pladur, revestimentos e pintura) para que tenha um só interlocutor e um só prazo.",
      tempo: "2 a 12 semanas", ref: "Casa de banho 2 a 3 semanas · cozinha 3 a 5 semanas · apartamento T2 8 a 12 semanas.",
      inclui: ["Projeto e orçamento detalhado", "Demolição e remoção de entulho", "Canalização e eletricidade novas", "Pladur, revestimentos e pintura", "Montagem, limpeza e entrega"],
      img: "img/servico-remodelacao.jpg",
      passos: [
        { t: "Visita, medição e projeto", dur: "1 a 3 dias", d: "Avaliamos o espaço, ouvimos o que pretende e definimos tudo por escrito: soluções, materiais, prazos e valores.", s: S({ piso: "antigo", paredes: "antigo", teto: "laje", moveis: 0, velho: 1, luzes: 0 }), cam: "geral" },
        { t: "Demolição e remoção", dur: "2 a 4 dias", d: "Retiramos revestimentos, louças e instalações antigas. O entulho é removido e encaminhado para destino autorizado.", s: S({ piso: "betao", paredes: "tijolo", teto: "laje", moveis: 0, obra: 1, entulho: 1, luzes: 0 }), cam: "geral" },
        { t: "Canalização e eletricidade", dur: "3 a 5 dias", d: "Abrimos roços e instalamos a nova rede de água, esgotos, tubagem elétrica e caixas, já nas posições do projeto.", s: S({ piso: "betao", paredes: "tijolo", teto: "laje", roco: 1, canal: 1, eletr: 1, moveis: 0, obra: 1, luzes: 0 }), cam: "parede" },
        { t: "Pladur e tetos falsos", dur: "2 a 4 dias", d: "Estrutura metálica e placas hidrófugas para tetos rebaixados, sancas de luz e nichos.", s: S({ piso: "betao", paredes: "reboco", teto: "placas", moveis: 0, obra: 1, luzes: 0 }), cam: "teto" },
        { t: "Regularização e impermeabilização", dur: "2 a 3 dias", d: "Regularizamos paredes e pavimento e impermeabilizamos a zona de duche com tela e bandas nos cantos.", s: S({ piso: "autonivel", paredes: "reboco", teto: "juntas", moveis: 0, obra: 1, luzes: 0 }), cam: "geral" },
        { t: "Revestimentos", dur: "5 a 8 dias", d: "Aplicação do revestimento escolhido, neste caso microcimento contínuo em pavimento, paredes e bancada.", s: S({ teto: "juntas", moveis: 0, obra: 1, luzes: 0 }), cam: "rasante" },
        { t: "Pintura de tetos", dur: "1 a 2 dias", d: "Primário e duas demãos de tinta própria para zonas húmidas, anti-fungos.", s: S({ moveis: 0, obra: 1, luzes: 0 }), cam: "teto" },
        { t: "Montagem e entrega", dur: "2 a 3 dias", d: "Louças, torneiras, móveis, espelho e iluminação. Limpeza final e entrega com tudo a funcionar.", s: S({}), cam: "geral" }
      ]
    },
    {
      id: "pintura-interior", nome: "Pintura interior", curto: "Paredes e tetos perfeitos",
      cena: "sala", cfg: ["tinta", "luz"],
      desc: "Pintura de paredes e tetos com preparação cuidada: reparação de fissuras, massa, lixagem e primário. Tintas laváveis de qualidade, em mate ou acetinado, com proteção total da casa durante a obra.",
      tempo: "2 a 6 dias úteis", ref: "Apartamento T2, paredes e tetos. Uma divisão em 1 a 2 dias.",
      inclui: ["Proteção de pavimentos e móveis", "Reparação de fissuras e buracos", "Primário", "Duas demãos de tinta", "Limpeza final"],
      img: "img/servico-pintura-interior.jpg",
      passos: [
        { t: "Proteção da casa", dur: "½ dia", d: "Cobrimos pavimentos e móveis e fitamos rodapés, tomadas, caixilharia e tetos.", s: S({ paredes: "antigo", prot: 1, moveis: 0, obra: 1 }), cam: "geral" },
        { t: "Reparação e preparação", dur: "1 dia", d: "Abrimos e tapamos fissuras e buracos, aplicamos massa e lixamos até ficar perfeitamente liso.", s: S({ paredes: "reparada", prot: 1, moveis: 0, obra: 1 }), cam: "parede" },
        { t: "Primário", dur: "½ dia", d: "Uniformiza a absorção da parede e garante aderência e cor homogénea.", s: S({ paredes: "primario", prot: 1, moveis: 0, obra: 1 }), cam: "geral" },
        { t: "Primeira demão", dur: "1 dia", d: "Aplicação a rolo e trincha, com recortes limpos junto a tetos e rodapés.", s: S({ paredes: "demao1", prot: 1, moveis: 0, obra: 1 }), cam: "parede" },
        { t: "Segunda demão e retoques", dur: "1 dia", d: "A segunda demão dá a cor definitiva e a resistência à lavagem. Revemos todos os pormenores.", s: S({ prot: 1, moveis: 0, obra: 1 }), cam: "parede" },
        { t: "Limpeza e entrega", dur: "½ dia", d: "Retiramos proteções e fitas, limpamos e arrumamos. A casa fica pronta a usar.", s: S({}), cam: "geral" }
      ]
    },
    {
      id: "pintura-exterior", nome: "Pintura exterior e fachadas", curto: "Proteção e cor para anos",
      cena: "fachada", cfg: ["fachada", "luz"],
      desc: "Recuperação e pintura de fachadas, muros e moradias: lavagem, tratamento anti-fungos, reparação de fissuras e tintas elastoméricas ou de siloxano, resistentes à água e aos UV.",
      tempo: "1 a 3 semanas", ref: "Moradia de 2 pisos. Depende do estado da fachada e das condições do tempo.",
      inclui: ["Andaime e proteções", "Lavagem a alta pressão", "Tratamento anti-fungos e fissuras", "Primário fixador", "Duas demãos de tinta de fachada"],
      img: "img/servico-pintura-exterior.jpg",
      passos: [
        { t: "Andaime e proteções", dur: "1 dia", d: "Montamos andaime certificado e protegemos janelas, portas, pavimentos e jardim.", s: S({ fach: "antigo", andaime: 1, rede: 1 }), cam: "andaime" },
        { t: "Lavagem a alta pressão", dur: "1 dia", d: "Remove sujidade, fungos, algas e tinta solta. A fachada seca antes de avançar.", s: S({ fach: "lavagem", andaime: 1 }), cam: "geral" },
        { t: "Reparação e tratamento", dur: "2 a 4 dias", d: "Abertura e selagem de fissuras, reparação de reboco e tratamento anti-fungos.", s: S({ fach: "reparacao", andaime: 1 }), cam: "detalhe" },
        { t: "Primário fixador", dur: "1 dia", d: "Consolida o suporte e garante a aderência e a durabilidade da tinta.", s: S({ fach: "primario", andaime: 1 }), cam: "geral" },
        { t: "Duas demãos de tinta", dur: "2 a 4 dias", d: "Tinta elastomérica ou de siloxano, respirável e impermeável, na cor escolhida.", s: S({ andaime: 1 }), cam: "geral" },
        { t: "Desmontagem e limpeza", dur: "1 dia", d: "Retiramos o andaime e as proteções e deixamos tudo limpo.", s: S({}), cam: "geral" }
      ]
    },
    {
      id: "pladur", nome: "Gesso, pladur e cartonado", curto: "Tetos falsos, sancas e nichos",
      cena: "sala", cfg: ["pladur", "tinta", "luz"],
      desc: "Tetos falsos, sancas com iluminação LED, paredes divisórias, nichos, arcos e revestimentos em gesso cartonado, com isolamento térmico e acústico em lã mineral.",
      tempo: "2 a 5 dias úteis", ref: "Teto falso ou parede divisória de uma divisão, já com juntas tratadas.",
      inclui: ["Estrutura metálica galvanizada", "Isolamento em lã mineral", "Placas standard ou hidrófugas", "Tratamento de juntas", "Preparação para pintura e iluminação"],
      img: "img/servico-pladur.jpg",
      passos: [
        { t: "Marcação e medição", dur: "½ dia", d: "Marcamos níveis, alinhamentos e a posição de focos, sancas e nichos.", s: S({ teto: "laje", feature: "off", moveis: 0, obra: 1, luzes: 0 }), cam: "teto" },
        { t: "Estrutura metálica", dur: "1 dia", d: "Perfis galvanizados fixos à laje e às paredes, nivelados ao milímetro.", s: S({ teto: "perfis", feature: "perfis", moveis: 0, obra: 1, luzes: 0 }), cam: "teto" },
        { t: "Isolamento e cabos", dur: "½ dia", d: "Lã mineral para conforto térmico e acústico. Deixamos os cabos dos focos e da fita LED prontos.", s: S({ teto: "perfis", feature: "perfis", isol: 1, eletr: 1, moveis: 0, obra: 1, luzes: 0 }), cam: "teto" },
        { t: "Aplacamento", dur: "1 dia", d: "Placas de gesso cartonado aparafusadas à estrutura. Em zonas húmidas usamos placas hidrófugas.", s: S({ teto: "placas", feature: "placas", moveis: 0, obra: 1, luzes: 0 }), cam: "teto" },
        { t: "Tratamento de juntas", dur: "1 a 2 dias", d: "Fita e massa em várias passagens, com lixagem até obter uma superfície contínua, sem marcas.", s: S({ teto: "juntas", feature: "juntas", moveis: 0, obra: 1, luzes: 0 }), cam: "nicho" },
        { t: "Pintura e iluminação", dur: "1 dia", d: "Primário, pintura e montagem dos focos e da fita LED. O resultado é um teto limpo e iluminação indireta.", s: S({}), cam: "geral" }
      ]
    },
    {
      id: "canalizacao", nome: "Canalizações", curto: "Água e esgotos novos, sem fugas",
      cena: "wc", cfg: ["xray", "torneira", "luz"],
      desc: "Redes novas de água quente e fria em multicamada, esgotos em PVC com a inclinação correta, substituição de tubagens antigas, louças, torneiras e reparação de fugas. Tudo testado em pressão antes de fechar.",
      tempo: "2 a 5 dias úteis", ref: "Casa de banho ou cozinha completa. Reparações e substituições pontuais em 1 dia.",
      inclui: ["Projeto de pontos de água e esgoto", "Tubagem multicamada e PVC", "Teste de pressão", "Montagem de louças e torneiras"],
      img: "img/servico-canalizacao.jpg",
      passos: [
        { t: "Levantamento e projeto", dur: "½ dia", d: "Definimos a posição de louças, torneiras, pontos de água e esgotos.", s: S({ piso: "betao", paredes: "tijolo", moveis: 0, obra: 1, luzes: 0 }), cam: "parede" },
        { t: "Abertura de roços", dur: "1 dia", d: "Abrimos os caminhos na parede e no pavimento para a nova tubagem, com o mínimo de pó.", s: S({ piso: "betao", paredes: "tijolo", roco: 1, moveis: 0, obra: 1, luzes: 0 }), cam: "parede" },
        { t: "Rede de água e esgotos", dur: "1 a 2 dias", d: "Multicamada para água quente (vermelho) e fria (azul). PVC para esgotos, com a inclinação correta até à prumada.", s: S({ piso: "betao", paredes: "tijolo", roco: 1, canal: 1, moveis: 0, obra: 1, luzes: 0 }), cam: "parede" },
        { t: "Teste de pressão", dur: "½ dia", d: "Colocamos a rede em pressão durante várias horas. Só fechamos depois de confirmar que não há fugas.", s: S({ piso: "betao", paredes: "tijolo", roco: 1, canal: 1, teste: 1, moveis: 0, obra: 1, luzes: 0 }), cam: "parede" },
        { t: "Fecho e impermeabilização", dur: "1 dia", d: "Fechamos os roços e impermeabilizamos a zona de duche. A tubagem fica protegida dentro da parede.", s: S({ piso: "autonivel", paredes: "reboco", canal: 1, xray: 1, moveis: 0, luzes: 0 }), cam: "parede" },
        { t: "Louças e torneiras", dur: "1 dia", d: "Montagem de sanita suspensa, lavatório, base de duche, chuveiro e torneiras, com verificação final.", s: S({}), cam: "geral" }
      ]
    },
    {
      id: "pavimentos", nome: "Pavimentos", curto: "Madeira, cerâmica e vinílico",
      cena: "sala", cfg: ["pav", "luz"],
      desc: "Colocação de pavimento flutuante, parquet, vinílico, porcelânico e cerâmico de grande formato, com regularização prévia, manta acústica e rodapés.",
      tempo: "2 a 6 dias úteis", ref: "Cerca de 50 m². Flutuante ou vinílico 2 a 3 dias, cerâmico 4 a 6 dias.",
      inclui: ["Remoção do pavimento antigo", "Regularização com autonivelante", "Manta acústica ou cola", "Colocação e rodapés"],
      img: "img/servico-pavimentos.jpg",
      passos: [
        { t: "Remoção do pavimento antigo", dur: "1 dia", d: "Retiramos o pavimento existente e os rodapés e preparamos a base.", s: S({ piso: "antigo", moveis: 0, obra: 1 }), cam: "piso" },
        { t: "Regularização", dur: "1 a 2 dias", d: "Corrigimos desníveis com argamassa autonivelante para uma base perfeitamente plana.", s: S({ piso: "autonivel", moveis: 0, obra: 1 }), cam: "piso" },
        { t: "Base e isolamento", dur: "½ dia", d: "Manta acústica para flutuante e vinílico, ou primário e cola para cerâmico e porcelânico.", s: S({ piso: "base", moveis: 0, obra: 1 }), cam: "piso" },
        { t: "Colocação", dur: "1 a 3 dias", d: "Assentamento com alinhamento rigoroso, cortes limpos e juntas de dilatação controladas.", s: S({ piso: "parcial", moveis: 0, obra: 1 }), cam: "piso" },
        { t: "Rodapés e acabamentos", dur: "½ dia", d: "Rodapés, perfis de transição e limpeza final. Pronto a usar.", s: S({}), cam: "geral" }
      ]
    },
    {
      id: "eletricidade", nome: "Eletricidade", curto: "Instalações seguras e iluminação",
      cena: "sala", cfg: ["ilum", "xray", "luz"],
      desc: "Instalações elétricas novas e remodelações: quadro elétrico, circuitos, tomadas, interruptores, focos encastrados e fitas LED. Instalação testada e pronta a certificar.",
      tempo: "4 a 10 dias úteis", ref: "Remodelação elétrica de um apartamento T2.",
      inclui: ["Projeto de circuitos e pontos de luz", "Tubagem, caixas e cablagem", "Quadro elétrico com diferenciais", "Aparelhagem, focos e LED", "Ensaios"],
      img: "img/servico-eletricidade.jpg",
      passos: [
        { t: "Projeto e marcação", dur: "½ dia", d: "Definimos circuitos, tomadas, interruptores e pontos de luz de acordo com o uso de cada divisão.", s: S({ paredes: "tijolo", teto: "laje", moveis: 0, obra: 1, luzes: 0 }), cam: "geral" },
        { t: "Roços e tubagem", dur: "1 a 2 dias", d: "Abrimos roços e colocamos tubo isolante e caixas de aparelhagem.", s: S({ paredes: "tijolo", teto: "laje", roco: 1, eletr: 1, moveis: 0, obra: 1, luzes: 0 }), cam: "parede" },
        { t: "Enfiamento de cabos", dur: "1 dia", d: "Cabos com a secção certa para cada circuito: iluminação, tomadas, cozinha e máquinas.", s: S({ paredes: "tijolo", teto: "laje", roco: 1, eletr: 1, teste: 1, moveis: 0, obra: 1, luzes: 0 }), cam: "parede" },
        { t: "Quadro elétrico", dur: "1 dia", d: "Quadro novo com disjuntores e diferenciais por circuito, identificado e organizado.", s: S({ paredes: "reboco", eletr: 1, xray: 1, moveis: 0, luzes: 0 }), cam: "quadro" },
        { t: "Aparelhagem e iluminação", dur: "1 dia", d: "Tomadas, interruptores, focos encastrados, fita LED e candeeiros.", s: S({ moveis: 0 }), cam: "teto" },
        { t: "Ensaios e entrega", dur: "½ dia", d: "Testamos isolamento, terras e diferenciais e entregamos a instalação pronta a certificar.", s: S({ eletr: 1, xray: 1 }), cam: "geral" }
      ]
    }
  ];
})();
