(function(){
'use strict';

/* ================= utilidades ================= */
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
const ZAP='5561981532529';
const zap=m=>'https://wa.me/'+ZAP+'?text='+encodeURIComponent(m);
const virg=n=>String(Math.round(n*10)/10).replace('.',',');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const memo={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const REDUZ=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const SETA='<svg aria-hidden="true"><use href="#i-seta"/></svg>';
let toastT;
function avisar(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2600)}
function copiar(texto){
  const ok=()=>avisar('Copiado');
  const alt=()=>{const ta=document.createElement('textarea');ta.value=texto;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let feito=false;try{feito=document.execCommand('copy')}catch(e){}ta.remove();feito?ok():avisar('Não deu para copiar. Selecione o texto e copie manualmente.')};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(texto).then(ok,alt)}else alt()}catch(e){alt()}
}
if(!REDUZ)document.documentElement.classList.add('anima');

/* ================= dados ================= */
const MOLDURAS=[
  {id:'filete',nome:'Filete Ouro',perfil:2,tom:'Dourado acetinado',linha:'Contemporânea',slice:[98,97,97,98],desc:'Perfil fino em folha de ouro acetinada, que emoldura sem competir com a obra.',indicacao:'Gravuras, fotografias e pinturas de tons quentes'},
  {id:'barroca',nome:'Barroca Ouro Velho',perfil:9,tom:'Ouro envelhecido',linha:'Clássica',slice:[221,236,236,218],prazo:'7 a 10 dias úteis',desc:'Entalhes em folhas de acanto, conchas nos cantos e fileira de pérolas, com douração envelhecida.',indicacao:'Retratos, espelhos de destaque e obras clássicas'},
  {id:'preta',nome:'Caixa Preta Fosca',perfil:3,tom:'Preto fosco',linha:'Contemporânea',slice:[127,117,114,132],desc:'Perfil reto com pintura preta fosca, que dá peso gráfico à composição.',indicacao:'Fotografias, gravuras e obras em preto e branco'},
  {id:'branca',nome:'Branca Laqueada',perfil:3.5,tom:'Laca branca',linha:'Contemporânea',slice:[86,86,86,86],desc:'Laca branca com degrau interno suave, leve e luminosa.',indicacao:'Ambientes claros, quadros infantis e composições leves'},
  {id:'freijo',nome:'Freijó Natural',perfil:4,tom:'Madeira clara',linha:'Madeira natural',slice:[239,238,238,238],desc:'Madeira clara de veios retos com acabamento a óleo fosco.',indicacao:'Fotografias de natureza e ambientes com linho e palha'},
  {id:'nogueira',nome:'Nogueira',perfil:5,tom:'Madeira escura',linha:'Madeira natural',slice:[226,225,226,226],desc:'Madeira escura com perfil escalonado e pequeno canal interno.',indicacao:'Salas com marcenaria e obras de cores intensas'},
  {id:'prata',nome:'Prata Escovada',perfil:1.5,tom:'Alumínio escovado',linha:'Minimalista',slice:[64,54,54,64],desc:'Alumínio escovado ultrafino, discreto e contemporâneo.',indicacao:'Pôsteres, diplomas e composições modernas'},
  {id:'americana',nome:'Caixa Americana Carvalho',perfil:2.5,tom:'Carvalho natural',linha:'Para telas',slice:[103,103,103,103],semPasse:true,desc:'A tela flutua dentro da moldura, com um respiro escuro em volta. Feita para pinturas em tela, sem vidro.',indicacao:'Pinturas em tela'}
];
const MOLD={};MOLDURAS.forEach(m=>MOLD[m.id]=m);
const PASSES={
  nenhum:{nome:'Sem'},
  branco:{nome:'Branco',cor:'#F8F6F1'},
  marfim:{nome:'Marfim',cor:'#EFE7D7'},
  preto:{nome:'Preto',cor:'#24211F',escuro:true},
  duplo:{nome:'Duplo com filete',cor:'#F4EEE3',filete:true}
};
const VIDROS={
  nenhum:{nome:'Sem vidro',info:'Para telas e obras com verniz, que precisam respirar.'},
  comum:{nome:'Comum',info:'Protege contra poeira e toque, mas reflete a luz do ambiente.'},
  ar:{nome:'Antirreflexo',info:'Leitura nítida mesmo com janela ou luminária ao lado.'},
  museu:{nome:'Museu',info:'Antirreflexo com filtro UV, para obras e fotografias de valor.'}
};
const OBRAS={abstrata:{src:'img/obra-abstrata.jpg',r:1128/1400},ipe:{src:'img/obra-ipe.jpg',r:1400/939},sua:{src:'',r:1}};
const R_CENA=1920/1434;
const CENAS={
  sala:{img:'img/cena-sala.jpg',largura:432,cx:.505,base:.69,folga:22,py:.7,nota:'Escala real: o sofá tem 2,5 m de largura.'},
  quarto:{img:'img/cena-quarto.jpg',largura:356,cx:.498,base:.566,folga:18,py:.55,nota:'Escala real: a cabeceira tem 2 m de largura.'},
  aparador:{img:'img/cena-aparador.jpg',largura:294,cx:.502,base:.666,folga:24,py:.7,nota:'Escala real: o aparador tem 1,8 m de largura.'},
  detalhe:{fit:true,nota:'Vista aproximada para conferir moldura, passe-partout e vidro.'}
};
const VIDROS_SERV=[
  ['Espelhos sob medida','Lapidados, bisotados, orgânicos ou com moldura, na medida da parede.'],
  ['Box para banheiro','Projeto, vidro temperado e instalação com acabamento de alto padrão.'],
  ['Vidros para mesas e móveis','Tampos, prateleiras e portas de armário com borda polida.'],
  ['Portas e divisórias de vidro','Ambientes integrados com segurança e leveza.'],
  ['Reposição de vidros','Troca de vidros quebrados ou riscados em quadros e móveis.'],
  ['Manutenção','Portas, molas hidráulicas, janelas e box.']
];
const PROJETOS=[
  {img:'img/real/proj-exposicao.jpg',titulo:'Exposição artística',tags:'molduras corporativo',cls:'',cat:'Molduras · Exposição',texto:'Obras de uma mostra emolduradas e montadas com alinhamento e espaçamento planejados para o percurso do visitante.',produto:'Molduras e montagem de exposição',acab:'Molduras em madeira, alinhamento',amb:'Galeria'},
  {img:'img/real/obj-colecao.jpg',titulo:'Coleção de lembranças',tags:'molduras residencial',cls:'obra--alta',cat:'Molduras · Colecionáveis',texto:'Ingressos, broches e miniaturas de viagem organizados em uma caixa preta profunda com vidro.',produto:'Caixa preta profunda',acab:'Fundo preto, vidro',amb:'Residencial'},
  {img:'img/real/proj-colecionador.jpg',titulo:'Camisa olímpica entre vidros',tags:'molduras residencial',cls:'',cat:'Molduras · Colecionador',texto:'Peça de coleção montada entre vidros em moldura branca, para preservar e destacar a camisa.',produto:'Moldura com vidro duplo',acab:'Moldura branca, vidro',amb:'Residencial'},
  {img:'img/real/proj-residencial.jpg',titulo:'Pintura na sala',tags:'molduras residencial',cls:'',cat:'Molduras · Residencial',texto:'Pintura de cores intensas em caixa preta, que dá contorno à obra sem disputar atenção.',produto:'Caixa preta',acab:'Moldura caixa, sem vidro',amb:'Residencial'},
  {img:'img/real/proj-corporativo.jpg',titulo:'Díptico no escritório',tags:'molduras corporativo',cls:'',cat:'Molduras · Corporativo',texto:'Duas fotografias de árvores em molduras de madeira clara, alinhadas como um único painel.',produto:'Molduras em madeira clara',acab:'Passe-partout branco, vidro',amb:'Ambiente corporativo'},
  {img:'img/real/obj-cocar.jpg',titulo:'Objeto afetivo',tags:'molduras residencial',cls:'obra--alta',cat:'Molduras · Objetos',texto:'Peças artesanais fixadas sobre fundo claro em caixa de madeira, com profundidade para o volume.',produto:'Caixa em madeira',acab:'Fundo off-white',amb:'Residencial'},
  {img:'img/real/proj-fotografia.jpg',titulo:'Obra autoral',tags:'molduras',cls:'',cat:'Molduras · Obra autoral',texto:'Obra recebendo moldura clara na loja, conferida peça por peça antes da entrega.',produto:'Moldura em madeira clara',acab:'Acabamento natural',amb:'Loja Norart'},
  {img:'img/real/obj-gravura-preta.jpg',titulo:'Gravura em relevo',tags:'molduras residencial',cls:'',cat:'Molduras · Gravura',texto:'Gravura com relevo em moldura preta e passe-partout branco, que valoriza sombras e recortes.',produto:'Moldura preta com passe-partout',acab:'Passe-partout branco',amb:'Residencial'},
  {img:'img/proj-quarto.jpg',titulo:'Fotografia do ipê no quarto',tags:'molduras residencial',cls:'obra--larga',cat:'Molduras · Residencial',texto:'Fotografia de paisagem do cerrado em moldura fina de madeira clara, sobre a cabeceira.',produto:'Moldura Freijó Natural',acab:'Madeira natural, vidro antirreflexo',amb:'Residencial'},
  {img:'img/proj-espelho-arco.jpg',titulo:'Espelho em arco',tags:'vidros residencial',cls:'obra--alta',cat:'Espelhos · Residencial',texto:'Espelho de chão em arco com moldura metálica fina, apoiado na parede para ampliar a sala.',produto:'Espelho com moldura',acab:'Moldura metálica preta',amb:'Residencial'},
  {img:'img/real/obj-gravura-ave.jpg',titulo:'Gravura minimalista',tags:'molduras residencial',cls:'',cat:'Molduras · Gravura',texto:'Gravura delicada com muito respiro, em moldura fina de madeira.',produto:'Moldura fina em madeira',acab:'Fundo branco amplo',amb:'Residencial'},
  {img:'img/cat-espelhos.jpg',titulo:'Espelho orgânico no lavabo',tags:'vidros residencial',cls:'obra--alta',cat:'Espelhos · Residencial',texto:'Espelho de formato livre com iluminação de LED por trás, desenhado para a bancada.',produto:'Espelho orgânico',acab:'LED embutido',amb:'Residencial'},
  {img:'img/proj-escritorio.jpg',titulo:'Trio botânico',tags:'molduras residencial corporativo',cls:'obra--larga',cat:'Molduras · Escritório',texto:'Três gravuras botânicas em caixa preta com passe-partout branco largo, alinhadas sobre a mesa.',produto:'Caixa Preta Fosca',acab:'Passe-partout branco 6 cm',amb:'Escritório'},
  {img:'img/proj-tampo.jpg',titulo:'Tampo de vidro',tags:'vidros residencial',cls:'',cat:'Vidros · Residencial',texto:'Vidro temperado com borda lapidada, cortado na medida do tampo para proteger a madeira.',produto:'Tampo de vidro temperado',acab:'Borda lapidada e polida',amb:'Sala de jantar'}
];

/* ================= moldura real (border-image) ================= */
function medidas(c){const M=MOLD[c.mold],P=PASSES[c.passe]||PASSES.nenhum;const p=(!M.semPasse&&P.cor)?(+c.passeW||0):0;return{W:c.w+2*p+2*M.perfil,H:c.h+2*p+2*M.perfil,p}}
function criarQuadro(){const q=document.createElement('div');q.className='quadro';q.innerHTML='<img class="quadro__obra" alt=""><span class="quadro__vidro"></span>';return q}
function aplicarQuadro(q,c,s,pos){
  const M=MOLD[c.mold],md=medidas(c),P=PASSES[c.passe]||PASSES.nenhum;
  if(q.dataset.m!==M.id){
    q.style.borderImageSource='url("img/molduras/'+M.id+'.jpg")';q.style.borderImageSlice=M.slice.join(' ');
    if(q.dataset.m&&!REDUZ){q.classList.remove('troca');void q.offsetWidth;q.classList.add('troca')}
    q.dataset.m=M.id;
  }
  q.style.borderWidth=Math.max(2,M.perfil*s)+'px';
  q.style.padding=(md.p*s)+'px';
  q.style.backgroundColor=md.p?P.cor:'#1d1a17';
  q.classList.toggle('com-passe',!!md.p&&!P.escuro&&!P.filete);
  q.classList.toggle('passe-preto',!!md.p&&!!P.escuro);
  q.classList.toggle('passe-duplo',!!md.p&&!!P.filete);
  q.style.setProperty('--fil',Math.max(4,.8*s)+'px');
  q.style.setProperty('--sy',Math.max(6,1.1*s)+'px');q.style.setProperty('--sb',Math.max(14,2.8*s)+'px');
  q.dataset.vidro=c.vidro||'nenhum';
  q.style.width=(md.W*s)+'px';q.style.height=(md.H*s)+'px';
  if(pos){q.style.left=pos.x+'px';q.style.top=pos.y+'px'}
  const img=q.querySelector('img');if(img.getAttribute('src')!==c.src)img.src=c.src;
  return md;
}
function layoutCena(key,Ws,Hs,Wc,Hc){
  const C=CENAS[key];
  if(C.fit){const s=Math.min(Ws*.62/Wc,Hs*.72/Hc);return{s,x:(Ws-Wc*s)/2,y:(Hs-Hc*s)/2}}
  const iw=Math.max(Ws,Hs*R_CENA),ih=iw/R_CENA,ox=(Ws-iw)/2,oy=(Hs-ih)*C.py,s=iw/C.largura;
  const bottom=oy+C.base*ih-C.folga*s;let top=bottom-Hc*s;if(top<16)top=16;
  return{s,x:ox+C.cx*iw-Wc*s/2,y:top};
}
function montarCena(el,key){
  const C=CENAS[key];el.dataset.cena=key;
  el.classList.toggle('cena--lisa',!!C.fit);
  el.innerHTML=C.fit?'':'<img class="cena__foto" src="'+C.img+'" alt="" style="object-position:50% '+(C.py*100)+'%">';
  const q=criarQuadro();el.appendChild(q);return q;
}
function encaixar(box,q,c,margem){
  const md=medidas(c),W=box.clientWidth,H=box.clientHeight;if(!W||!H)return;
  const s=Math.min(W*(margem||.7)/md.W,H*(margem||.7)/md.H);
  aplicarQuadro(q,c,s,{x:(W-md.W*s)/2,y:(H-md.H*s)/2});q.style.position='absolute';
}

/* ================= revelações e contadores ================= */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;const el=e.target;el.classList.add('visto');io.unobserve(el);
  $$('[data-conta]',el).concat(el.matches('[data-conta]')?[el]:[]).forEach(contar);
}),{rootMargin:'0px 0px -8% 0px',threshold:.1}):null;
function observar(root){if(!io){$$('.rv,.rv-img,.rv-linha',root).forEach(e=>e.classList.add('visto'));return}$$('.rv,.rv-img,.rv-linha',root).forEach(e=>{if(!e.classList.contains('visto'))io.observe(e)})}
function contar(el){
  if(el.dataset.contado)return;el.dataset.contado='1';const alvo=+el.dataset.conta;if(REDUZ){el.textContent=alvo;return}
  const t0=performance.now(),d=1600;const passo=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=Math.round(alvo*e);if(k<1)requestAnimationFrame(passo)};requestAnimationFrame(passo);
}

/* ================= cartões ================= */
function cardMoldura(M,d){
  return '<a class="produto rv" style="--d:'+(d||0)+'s" href="#produto-'+M.id+'"><div class="produto__img"><img src="img/molduras/'+M.id+'.jpg" alt="Moldura '+esc(M.nome)+'" loading="lazy"><span class="produto__selo">'+esc(M.linha)+'</span></div><div class="produto__corpo"><small>Moldura</small><b>'+esc(M.nome)+'</b><span>Perfil '+virg(M.perfil)+' cm · '+esc(M.tom)+'</span><span class="produto__acao" aria-hidden="true">'+SETA+'</span></div></a>';
}
function renderCartoes(){
  $('#selecaoHome').innerHTML=['filete','barroca','nogueira','preta'].map((id,i)=>cardMoldura(MOLD[id],i*.08)).join('');
  $('#gradeMolduras').innerHTML=MOLDURAS.map((M,i)=>cardMoldura(M,(i%4)*.08)).join('');
  $('#listaVidros').innerHTML=VIDROS_SERV.map(([n,t],i)=>'<li class="rv" style="--d:'+(i*.05)+'s"><small>0'+(i+1)+'</small><div><b>'+n+'</b><span>'+t+'</span></div><a class="link" href="'+esc(zap('Olá, Norart! Vim pelo site e gostaria de um orçamento de '+n.toLowerCase()+'.'))+'" target="_blank" rel="noopener">Orçar '+SETA+'</a></li>').join('');
  $('#gradeProj').innerHTML=PROJETOS.map((p,i)=>'<figure class="obra rv '+p.cls+'" tabindex="0" role="button" data-i="'+i+'" data-tags="'+p.tags+'" style="--d:'+((i%3)*.06)+'s"><img src="'+p.img+'" alt="'+esc(p.titulo)+'" loading="lazy"><figcaption><span>'+esc(p.cat)+'</span><b>'+esc(p.titulo)+'</b></figcaption></figure>').join('');
  observar(document);
}

/* ================= navegação entre páginas ================= */
const VISTAS=['inicio','produtos','produto','provador','projetos','sobre','contato'];
let vistaAtual='',filtroProdutos='todos';
function rota(){
  let h=decodeURIComponent((location.hash||'#inicio').slice(1)),vista=h,arg=null;
  if(h.indexOf('produto-')===0){vista='produto';arg=h.slice(8);if(!MOLD[arg]){vista='produtos';arg=null}}
  if(VISTAS.indexOf(vista)<0)vista='inicio';
  const mudou=vista!==vistaAtual||arg;
  $$('.vista').forEach(v=>{const on=v.dataset.vista===vista;v.hidden=!on;if(on&&mudou&&!REDUZ){v.classList.remove('entrando');void v.offsetWidth;v.classList.add('entrando')}});
  vistaAtual=vista;
  moverProvador(vista);
  if(mudou)window.scrollTo({top:0,behavior:'instant'});
  $$('.menu a').forEach(a=>a.classList.toggle('ativo',a.dataset.nav===(vista==='produto'?'produtos':vista)));
  const titulos={inicio:'Norart Vidros e Molduras',produtos:'Produtos · Norart',produto:'Moldura · Norart',provador:'Provador de molduras · Norart',projetos:'Projetos · Norart',sobre:'Sobre a Norart',contato:'Contato · Norart'};
  document.title=titulos[vista];
  if(vista==='produtos')aplicarFiltroProdutos();
  if(vista==='produto')renderProduto(arg);
  requestAnimationFrame(()=>{redesenhar();rolar()});
  atualizarZap(true);
}
function aplicarFiltroProdutos(){
  $$('[data-vista="produtos"] .filtro').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cat===filtroProdutos?'true':'false'));
  $$('[data-grupo]').forEach(s=>{s.hidden=!(filtroProdutos==='todos'||s.dataset.grupo===filtroProdutos)});
}

/* ================= topo e menu ================= */
let ultimoY=0,menuAberto=false;
function rolar(){
  const y=window.scrollY,topo=$('#topo');
  topo.classList.toggle('solido',y>20||vistaAtual!=='inicio'||menuAberto);
  if(!menuAberto&&y>ultimoY+6&&y>400)topo.classList.add('some');else if(y<ultimoY-6||y<200)topo.classList.remove('some');
  ultimoY=y;
}
function ligarTopo(){
  addEventListener('scroll',rolar,{passive:true});
  const btn=$('#menuBtn'),mm=$('#menuMobile');
  const menu=abrir=>{menuAberto=abrir;mm.hidden=!abrir;btn.setAttribute('aria-expanded',abrir?'true':'false');btn.setAttribute('aria-label',abrir?'Fechar menu':'Abrir menu');btn.classList.toggle('x',abrir);document.body.classList.toggle('trava',abrir);rolar()};
  btn.addEventListener('click',()=>menu(mm.hidden));
  mm.addEventListener('click',e=>{if(e.target.closest('a'))menu(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuAberto){menu(false);btn.focus()}});
  document.addEventListener('click',e=>{
    const f=e.target.closest('[data-filtro]');if(f)filtroProdutos=f.dataset.filtro;
    const ir=e.target.closest('[data-ir]');if(ir)location.hash=ir.dataset.ir;
    const orc=e.target.closest('[data-orcar]');
    if(orc){setTimeout(()=>{
      const d=$('#orcDesc');if(d&&!d.value){d.value='Gostaria de um orçamento de '+orc.dataset.orcar.toLowerCase()+'.';d.dispatchEvent(new Event('input',{bubbles:true}))}
      const s=$('input[name=servico][value="Emoldurar obra ou fotografia"]');if(s&&!s.checked){s.checked=true;s.dispatchEvent(new Event('change',{bubbles:true}))}
    },80)}
    const rl=e.target.closest('[data-rolar]');
    if(rl&&vistaAtual==='inicio'){const alvo=$('#'+rl.dataset.rolar);if(alvo){e.preventDefault();window.scrollTo({top:alvo.getBoundingClientRect().top+window.scrollY-20,behavior:REDUZ?'auto':'smooth'})}}
  });
  $$('[data-vista="produtos"] .filtro').forEach(b=>b.addEventListener('click',()=>{filtroProdutos=b.dataset.cat;aplicarFiltroProdutos();observar(document)}));
}

/* ================= hero ================= */
function ligarHero(){
  const ids=['barroca','filete','nogueira'];let i=0;const card=$('#destaque');
  const trocar=()=>{
    i=(i+1)%ids.length;const M=MOLD[ids[i]];card.classList.add('troca');
    setTimeout(()=>{$('#destaqueImg').src='img/molduras/'+M.id+'.jpg';$('#destaqueNome').textContent=M.nome;$('#destaqueInfo').textContent='Perfil '+virg(M.perfil)+' cm · '+M.linha;card.href='#produto-'+M.id;$$('.destaque__pontos i').forEach((p,k)=>p.classList.toggle('on',k===i));card.classList.remove('troca')},450);
  };
  if(!REDUZ)setInterval(()=>{if(vistaAtual==='inicio'&&!document.hidden&&window.scrollY<window.innerHeight)trocar()},4800);
  ids.forEach(id=>{const im=new Image();im.src='img/molduras/'+id+'.jpg'});
}

/* ================= antes e depois ================= */
let qAD=null;
function pintarAD(){
  const el=$('#adDepois');if(!el||!el.clientWidth)return;
  if(!qAD){qAD=criarQuadro();qAD.style.transition='none';el.appendChild(qAD)}
  const c={mold:'nogueira',src:OBRAS.ipe.src,w:90,h:60,passe:'branco',passeW:6,vidro:'ar'};const md=medidas(c);
  const L=layoutCena('sala',el.clientWidth,el.clientHeight,md.W,md.H);aplicarQuadro(qAD,c,L.s,L);
}

/* ================= provador ================= */
const TAMS=[[20,30],[30,40],[40,50],[50,70],[60,90],[70,100]];
const st=Object.assign({arte:'abstrata',moldura:'filete',passe:'marfim',passeW:7,vidro:'ar',tam:'50x70',w:50,h:70,orient:'auto',cena:'sala'},memo.get('norart-provador2',{}));
if(st.arte==='sua'||!OBRAS[st.arte])st.arte='abstrata';
if(!MOLD[st.moldura])st.moldura='filete';if(!PASSES[st.passe])st.passe='marfim';if(!VIDROS[st.vidro])st.vidro='ar';if(!CENAS[st.cena])st.cena='sala';
function dimsObra(){
  if(st.tam==='outro')return[clamp(Math.round(+st.w)||50,10,200),clamp(Math.round(+st.h)||70,10,200)];
  const [a,b]=st.tam.split('x').map(Number);let o=st.orient;
  if(o==='auto')o=OBRAS[st.arte].r>1.05?'h':'v';
  return o==='h'?[b,a]:[a,b];
}
function cfgAtual(){const [w,h]=dimsObra();return{mold:st.moldura,src:OBRAS[st.arte].src,w,h,passe:st.passe,passeW:+st.passeW,vidro:st.vidro}}
function descrever(c){
  const md=medidas(c),M=MOLD[c.mold];
  return{titulo:'Quadro '+c.w+' × '+c.h+' cm',linhas:['Moldura: '+M.nome+' ('+virg(M.perfil)+' cm)',md.p?'Passe-partout: '+PASSES[c.passe].nome.toLowerCase()+', '+md.p+' cm':'Sem passe-partout','Vidro: '+VIDROS[c.vidro].nome.toLowerCase(),'Medida final: '+virg(md.W)+' × '+virg(md.H)+' cm']};
}
function textoSimulacao(){
  const d=descrever(cfgAtual());
  return'Olá, Norart! Montei esta combinação no provador do site e gostaria de um orçamento:\n\n*'+d.titulo+'*\n'+d.linhas.map(l=>'   '+l).join('\n')+'\n\n'+(st.arte==='sua'?'Vou enviar a foto da obra aqui na conversa.':'Usei uma imagem de exemplo na simulação. Vou enviar a foto da minha obra aqui na conversa.');
}
function resumoFicha(){
  const c=cfgAtual(),md=medidas(c),M=MOLD[c.mold];
  return'Simulei no provador: moldura '+M.nome+(md.p?', passe-partout '+PASSES[c.passe].nome.toLowerCase()+' de '+md.p+' cm':', sem passe-partout')+', vidro '+VIDROS[c.vidro].nome.toLowerCase()+'. Medida final de '+virg(md.W)+' × '+virg(md.H)+' cm.';
}
function construirProvador(){
  $('#moldGrid').innerHTML=MOLDURAS.map(M=>'<label class="mold"><input type="radio" name="moldura" value="'+M.id+'"'+(M.id===st.moldura?' checked':'')+'><span class="m-img"><img src="img/molduras/'+M.id+'.jpg" alt="" loading="lazy"></span><small>'+M.nome+'</small></label>').join('');
  $('#passeOps').innerHTML=Object.entries(PASSES).map(([k,P])=>'<label class="op"><input type="radio" name="passe" value="'+k+'"'+(k===st.passe?' checked':'')+'><span>'+(P.cor?'<i class="bolinha" style="background:'+P.cor+(P.filete?';box-shadow:inset 0 0 0 3px '+P.cor+',inset 0 0 0 4px #B4935F':'')+'"></i>':'')+P.nome+'</span></label>').join('');
  $('#vidroOps').innerHTML=Object.entries(VIDROS).map(([k,V])=>'<label class="op"><input type="radio" name="vidro" value="'+k+'"'+(k===st.vidro?' checked':'')+'><span>'+V.nome+'</span></label>').join('');
  $('#tamOps').innerHTML=TAMS.map(([a,b])=>{const v=a+'x'+b;return'<label class="op"><input type="radio" name="tam" value="'+v+'"'+(v===st.tam?' checked':'')+'><span>'+a+' × '+b+'</span></label>'}).join('')+'<label class="op"><input type="radio" name="tam" value="outro"'+(st.tam==='outro'?' checked':'')+'><span>Outra medida</span></label>';
  $$('input[name=cena]').forEach(i=>i.checked=i.value===st.cena);
  $$('input[name=orient]').forEach(i=>i.checked=i.value===st.orient);
  $$('input[name=arte]').forEach(i=>i.checked=i.value===st.arte);
  $('#passeW').value=st.passeW;$('#passeWOut').textContent=st.passeW+' cm';
  $('#tamW').value=st.w;$('#tamH').value=st.h;$('#tamCustom').hidden=st.tam!=='outro';
}
function sincronizarProvador(){
  $$('input[name=moldura]').forEach(i=>i.checked=i.value===st.moldura);
  $$('input[name=vidro]').forEach(i=>i.checked=i.value===st.vidro);
}
let qProv=null,qLupa=null,rafP=0;
function atualizarProvador(){
  cancelAnimationFrame(rafP);
  rafP=requestAnimationFrame(()=>{
    const cena=$('#cenaProv');if(!cena||!cena.clientWidth)return;
    if(cena.dataset.cena!==st.cena)qProv=montarCena(cena,st.cena);
    const c=cfgAtual(),md=medidas(c),M=MOLD[c.mold];
    const L=layoutCena(st.cena,cena.clientWidth,cena.clientHeight,md.W,md.H);
    aplicarQuadro(qProv,c,L.s,L);
    const lupa=$('#lupa');if(!qLupa){qLupa=criarQuadro();lupa.appendChild(qLupa)}
    const S=lupa.clientWidth||110,alvo=M.perfil+Math.min(md.p,6)+6,s2=Math.max(3,S*.7/alvo);
    aplicarQuadro(qLupa,c,s2,{x:S*.2,y:S*.2});
    $('#medidaFinal').textContent=virg(md.W)+' × '+virg(md.H)+' cm';
    $('#palcoNota').textContent=CENAS[st.cena].nota;
    const linhas=[['Obra',c.w+' × '+c.h+' cm'],['Moldura',M.nome],['Passe-partout',md.p?PASSES[c.passe].nome+' · '+md.p+' cm':'Sem'],['Vidro',VIDROS[c.vidro].nome],['Medida final',virg(md.W)+' × '+virg(md.H)+' cm']];
    $('#resumoLista').innerHTML=linhas.map(([a,b])=>'<dt>'+esc(a)+'</dt><dd>'+esc(b)+'</dd>').join('');
    $('#resumoPrazo').textContent='Produção em '+(M.prazo||'5 a 7 dias úteis');
    $('#provZap').href=zap(textoSimulacao());
    $$('input[name=passe]').forEach(i=>i.disabled=!!M.semPasse);
    $('#passeW').disabled=!!M.semPasse||st.passe==='nenhum';
    $('#moldInfo').textContent=M.nome+' · perfil de '+virg(M.perfil)+' cm. '+M.desc;
    $('#vidroInfo').textContent=VIDROS[st.vidro].info;
    if(vistaAtual==='provador'||provNaTela)atualizarZap(false);
    memo.set('norart-provador2',Object.assign({},st,{arte:st.arte==='sua'?'abstrata':st.arte}));
  });
}
function ligarProvador(){
  const form=$('#provForm');
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('change',e=>{
    const t=e.target;
    if(t.name==='moldura'){st.moldura=t.value;if(MOLD[t.value].semPasse){st.vidro='nenhum';sincronizarProvador()}}
    else if(t.name==='passe')st.passe=t.value;
    else if(t.name==='vidro')st.vidro=t.value;
    else if(t.name==='tam'){st.tam=t.value;$('#tamCustom').hidden=t.value!=='outro'}
    else if(t.name==='orient')st.orient=t.value;
    else if(t.name==='arte')st.arte=t.value;
    else return;
    atualizarProvador();
  });
  $('#passeW').addEventListener('input',e=>{st.passeW=+e.target.value;$('#passeWOut').textContent=st.passeW+' cm';atualizarProvador()});
  ['tamW','tamH'].forEach(id=>$('#'+id).addEventListener('input',e=>{st[id==='tamW'?'w':'h']=e.target.value;if(st.tam==='outro')atualizarProvador()}));
  $$('input[name=cena]').forEach(i=>i.addEventListener('change',()=>{st.cena=i.value;atualizarProvador()}));
  const arq=$('#arquivo'),drop=$('#drop');
  arq.addEventListener('change',()=>{carregarFoto(arq.files[0]);arq.value=''});
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('sobre')}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('sobre')}));
  drop.addEventListener('drop',e=>carregarFoto(e.dataTransfer&&e.dataTransfer.files[0]));
  $('#provFicha').addEventListener('click',()=>{
    const c=cfgAtual();
    setTimeout(()=>{if(preencherFicha)preencherFicha({w:c.w,h:c.h,desc:resumoFicha(),foto:st.arte==='sua'?fotoSua:null})},80);
  });
}
let fotoSua=null;
function carregarFoto(f){
  if(!f)return;if(!/^image\//.test(f.type)){avisar('Envie um arquivo de imagem, como JPG ou PNG.');return}
  const url=URL.createObjectURL(f),img=new Image();
  img.onload=()=>{fotoSua=f;OBRAS.sua={src:url,r:img.naturalWidth/img.naturalHeight};$('#amostraSuaImg').src=url;const lab=$('#amostraSua');lab.hidden=false;lab.querySelector('input').checked=true;st.arte='sua';st.orient='auto';$$('input[name=orient]').forEach(i=>i.checked=i.value==='auto');atualizarProvador();avisar('Sua foto entrou na simulação')};
  img.onerror=()=>avisar('Não foi possível abrir esta imagem. Tente um JPG ou PNG.');img.src=url;
}

/* ================= teste do olhar e demos de vidro ================= */
const TESTE=[
  {letra:'A',nome:'Barroca ouro velho, sem passe-partout',c:{mold:'barroca',passe:'nenhum',passeW:0,vidro:'nenhum'},certa:false,rot:'Compete com a obra',txt:'Os entalhes e o ouro pesado disputam atenção com as formas da pintura. O olhar se perde na moldura.'},
  {letra:'B',nome:'Filete ouro com passe-partout marfim',c:{mold:'filete',passe:'marfim',passeW:7,vidro:'nenhum'},certa:true,rot:'Valoriza a peça',txt:'O filete conversa com os tons quentes e o passe-partout dá respiro. A pintura continua sendo a protagonista.'},
  {letra:'C',nome:'Nogueira com passe-partout preto',c:{mold:'nogueira',passe:'preto',passeW:6,vidro:'nenhum'},certa:false,rot:'Tira o destaque',txt:'A madeira escura e o passe-partout preto fecham o conjunto e apagam a luz das cores da obra.'}
];
function ligarTeste(){
  const box=$('#teste'),ops=$('#testeOps'),fim=$('#testeFim');
  ops.innerHTML=TESTE.map((t,i)=>'<button class="op-teste rv" style="--d:'+(i*.1)+'s" type="button" data-i="'+i+'"><span class="op-teste__vis"></span><span class="op-teste__txt"><span class="op-teste__letra">'+t.letra+'</span><span class="op-teste__nome">'+t.nome+'</span><span class="veredito"><b>'+t.rot+'</b><p>'+t.txt+'</p></span></span></button>').join('');
  $$('.op-teste__vis',ops).forEach((v,i)=>{const q=criarQuadro();q.style.transition='none';v.style.position='relative';v.appendChild(q)});
  ops.addEventListener('click',e=>{
    const b=e.target.closest('.op-teste');if(!b||box.classList.contains('respondido'))return;
    const i=+b.dataset.i;box.classList.add('respondido');
    $$('.op-teste',ops).forEach((x,k)=>{x.classList.add(TESTE[k].certa?'certa':'errada');x.setAttribute('aria-disabled','true')});
    b.classList.add('escolhida');const ok=TESTE[i].certa;
    fim.innerHTML='<strong>'+(ok?'Olho treinado.':'Quase.')+'</strong><span>'+(ok?'Você escolheu a moldura que valoriza a obra.':'A opção B é a que valoriza esta obra.')+'</span><a class="link" href="'+esc(zap('Olá, Norart! Fiz o teste no site e gostaria de ajuda para escolher a moldura da minha obra.'))+'" target="_blank" rel="noopener">Pedir uma segunda opinião '+SETA+'</a><button class="link" type="button" id="testeDeNovo">Refazer</button>';
    fim.hidden=false;
  });
  fim.addEventListener('click',e=>{if(e.target.id!=='testeDeNovo')return;box.classList.remove('respondido');fim.hidden=true;$$('.op-teste',ops).forEach(x=>{x.classList.remove('certa','errada','escolhida');x.removeAttribute('aria-disabled')})});
}
function pintarTeste(){
  $$('#testeOps .op-teste__vis').forEach((v,i)=>{const t=TESTE[i].c;encaixar(v,v.querySelector('.quadro'),{mold:t.mold,src:OBRAS.abstrata.src,w:40,h:50,passe:t.passe,passeW:t.passeW,vidro:t.vidro},.72)});
}
function pintarDemosVidro(){
  $$('[data-vidro-demo]').forEach(v=>{
    let q=v.querySelector('.quadro');if(!q){q=criarQuadro();q.style.transition='none';v.appendChild(q)}
    encaixar(v,q,{mold:'preta',src:OBRAS.ipe.src,w:36,h:24,passe:'branco',passeW:4,vidro:v.dataset.vidroDemo},.78);
  });
}

/* ================= detalhe de produto ================= */
let prodAtual=null,modoProd='quadro';
function renderProduto(id){
  const M=MOLD[id];if(!M)return;prodAtual=id;
  $('#prodMiga').textContent=M.nome;$('#prodLinha').textContent='Moldura · '+M.linha;$('#prodNome').textContent=M.nome;$('#prodDesc').textContent=M.desc;
  const ficha=[['Perfil',virg(M.perfil)+' cm de largura'],['Acabamento',M.tom],['Linha',M.linha],['Indicação',M.indicacao],['Vidro sugerido',M.semPasse?'Sem vidro (para telas)':'Antirreflexo ou museu'],['Produção',M.prazo||'5 a 7 dias úteis']];
  $('#prodFicha').innerHTML=ficha.map(([a,b])=>'<dt>'+a+'</dt><dd>'+esc(b)+'</dd>').join('');
  $('#prodZap').href=zap('Olá, Norart! Vi a moldura "'+M.nome+'" no site e gostaria de um orçamento.');
  $('#prodProvar').onclick=()=>{st.moldura=id;if(M.semPasse)st.vidro='nenhum';sincronizarProvador()};
  $('#prodMinis').innerHTML=[['quadro','Com obra'],['parede','Na parede'],['moldura','Moldura']].map(([k,n])=>'<button class="miniatura" type="button" data-modo="'+k+'" aria-pressed="'+(k===modoProd)+'">'+(k==='moldura'?'<img class="contem" src="img/molduras/'+id+'.jpg" alt="">':k==='parede'?'<img src="img/cena-sala.jpg" alt="">':'<img class="contem" src="'+OBRAS.abstrata.src+'" alt="">')+'<span>'+n+'</span></button>').join('');
  $('#prodOutras').innerHTML=MOLDURAS.filter(m=>m.id!==id).slice(0,4).map((m,i)=>cardMoldura(m,i*.06)).join('');
  observar($('[data-vista="produto"]'));
  pintarProduto();
}
function pintarProduto(){
  const palco=$('#prodPalco');if(!palco||!prodAtual||!palco.clientWidth)return;const M=MOLD[prodAtual];
  $$('#prodMinis .miniatura').forEach(b=>b.setAttribute('aria-pressed',b.dataset.modo===modoProd?'true':'false'));
  palco.innerHTML='';
  if(modoProd==='moldura'){palco.innerHTML='<img src="img/molduras/'+M.id+'.jpg" alt="Moldura '+esc(M.nome)+'">';return}
  const c={mold:M.id,src:OBRAS.abstrata.src,w:40,h:50,passe:M.semPasse?'nenhum':'branco',passeW:6,vidro:'nenhum'};
  if(modoProd==='parede'){const cena=document.createElement('div');cena.className='cena';palco.appendChild(cena);const q=montarCena(cena,'sala');q.style.transition='none';const md=medidas(c);const L=layoutCena('sala',palco.clientWidth,palco.clientHeight,md.W,md.H);aplicarQuadro(q,c,L.s,L);return}
  const q=criarQuadro();q.style.transition='none';palco.appendChild(q);encaixar(palco,q,c,.66);
}

/* ================= projetos ================= */
function ligarProjetos(){
  const lb=$('#lightbox');let atual=null;
  const obras=()=>$$('#gradeProj .obra');
  $$('[data-vista="projetos"] .filtro').forEach(b=>b.addEventListener('click',()=>{
    $$('[data-vista="projetos"] .filtro').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
    const f=b.dataset.f;obras().forEach(o=>{o.hidden=!(f==='todos'||o.dataset.tags.split(' ').includes(f))});
  }));
  const preencher=o=>{
    atual=o;const p=PROJETOS[+o.dataset.i],li=$('#lbImg');
    li.style.visibility='';li.src=p.img;li.alt=p.titulo;
    $('#lbTags').textContent=p.cat;$('#lbTitulo').textContent=p.titulo;$('#lbTexto').textContent=p.texto;
    $('#lbProd').textContent=p.produto;$('#lbAcab').textContent=p.acab;$('#lbAmb').textContent=p.amb;
    $('#lbZap').href=zap('Olá, Norart! Vi o projeto "'+p.titulo+'" no site e gostaria de algo parecido.');
  };
  const abrir=o=>{preencher(o);if(!lb.open){if(lb.showModal)lb.showModal();else lb.setAttribute('open','')}};
  const nav=d=>{const vis=obras().filter(o=>!o.hidden);let k=vis.indexOf(atual);k=(k+d+vis.length)%vis.length;preencher(vis[k])};
  $('#gradeProj').addEventListener('click',e=>{const o=e.target.closest('.obra');if(o)abrir(o)});
  $('#gradeProj').addEventListener('keydown',e=>{const o=e.target.closest('.obra');if(o&&(e.key==='Enter'||e.key===' ')){e.preventDefault();abrir(o)}});
  $('#lbFechar').addEventListener('click',()=>lb.close());
  $('#lbAnt').addEventListener('click',()=>nav(-1));$('#lbProx').addEventListener('click',()=>nav(1));
  lb.addEventListener('click',e=>{if(e.target===lb)lb.close()});
  lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')nav(-1);if(e.key==='ArrowRight')nav(1)});
  lb.addEventListener('close',()=>{if(atual)atual.focus({preventScroll:true})});
  $('#prodMinis').addEventListener('click',e=>{const b=e.target.closest('.miniatura');if(!b)return;modoProd=b.dataset.modo;pintarProduto()});
  $('#adRange').addEventListener('input',e=>$('#ad').style.setProperty('--pos',e.target.value+'%'));
}

/* ================= utilidades de formulário ================= */
function mascaraTel(v){const d=v.replace(/\D/g,'').slice(0,11);if(!d)return'';if(d.length<=2)return'('+d;if(d.length<=6)return'('+d.slice(0,2)+') '+d.slice(2);if(d.length<=10)return'('+d.slice(0,2)+') '+d.slice(2,6)+'-'+d.slice(6);return'('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7)}
function validar(campos){let ok=true,primeiro=null;campos.forEach(([el,er,teste,msg])=>{const ruim=!teste(el.value.trim());el.setAttribute('aria-invalid',ruim?'true':'false');el.setAttribute('aria-describedby',er.id);er.textContent=ruim?msg:'';if(ruim){ok=false;primeiro=primeiro||el}});if(primeiro)primeiro.focus();return ok}
const telOk=v=>v.replace(/\D/g,'').length>=10;

/* ================= ficha de orçamento (formulário em etapas) ================= */
const OBRA_VAZIA='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><defs><pattern id="l" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="#E4DCD0" stroke-width="2"/></pattern></defs><rect width="400" height="500" fill="#F3EEE7"/><rect width="400" height="500" fill="url(#l)"/><text x="200" y="258" text-anchor="middle" font-family="Jost,Arial,sans-serif" font-size="22" letter-spacing="8" fill="#A39788">SUA OBRA</text></svg>');
let pintarFicha=null,preencherFicha=null;
function ligarFicha(){
  const form=$('#orcForm'),ok=$('#orcOk'),trilho=$('#etapaTrilho'),etapas=$$('.etapa',form),total=etapas.length;
  const btnAv=$('#etapaAvancar'),btnVolta=$('#etapaVoltar'),barra=$('.etapas'),ficha=$('#ficha'),anexos=[];
  const nome=$('#orcNome'),tel=$('#orcTel'),desc=$('#orcDesc'),inW=$('#orcW'),inH=$('#orcH'),semMed=$('#orcSemMedida');
  let atual=1,feito=false,texto='';
  const num=String(1000+Math.floor(Math.random()*9000));
  $('#fichaNum').textContent='Nº '+num;$('#okNum').textContent=num;
  try{$('#fichaData').textContent=new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}catch(e){}
  const qVis=criarQuadro(),qFicha=criarQuadro();$('#visQuadro').appendChild(qVis);$('#fichaQuadro').appendChild(qFicha);
  const dados=()=>({servico:($('input[name=servico]:checked',form)||{}).value||'',w:clamp(+inW.value||0,0,400),h:clamp(+inH.value||0,0,400),sem:semMed.checked,desc:desc.value.trim(),nome:nome.value.trim(),tel:tel.value.trim(),retorno:($('input[name=retorno]:checked',form)||{}).value||'WhatsApp',periodo:($('input[name=periodo]:checked',form)||{}).value||''});
  const tremer=el=>{if(!el||REDUZ)return;el.classList.remove('treme');void el.offsetWidth;el.classList.add('treme')};

  function proporcao(box,q,cotas){
    const W=box.clientWidth,H=box.clientHeight;if(!W||!H)return;const d=dados();
    const w=d.sem||!d.w?40:Math.max(5,d.w),h=d.sem||!d.h?50:Math.max(5,d.h);
    const c={mold:'filete',src:(anexos[0]&&anexos[0].url)||OBRA_VAZIA,w,h,passe:'branco',passeW:Math.max(1.5,Math.min(w,h)*.08),vidro:'nenhum'};
    const md=medidas(c),fr=cotas?.7:.82,s=Math.min(W*fr/md.W,H*fr/md.H),x=(W-md.W*s)/2-(cotas?12:0),y=(H-md.H*s)/2-(cotas?12:0);
    aplicarQuadro(q,c,s,{x,y});q.style.position='absolute';
    if(cotas){
      const fw=md.W*s,fh=md.H*s,ch=$('#cotaH'),cv=$('#cotaV');
      Object.assign(ch.style,{left:x+'px',top:(y+fh+14)+'px',width:fw+'px'});Object.assign(cv.style,{left:(x+fw+14)+'px',top:y+'px',height:fh+'px'});
      $('#cotaW').textContent=d.sem?'? cm':(w+' cm');$('#cotaHtxt').textContent=d.sem?'? cm':(h+' cm');
    }
  }
  pintarFicha=()=>{proporcao($('#visQuadro'),qVis,true);proporcao($('#fichaQuadro'),qFicha,false);posicionarPilulas()};

  function setF(campo,valor){
    const dd=$('[data-f="'+campo+'"] dd');const v=valor||'—';if(dd.textContent===v)return;
    dd.textContent=v;dd.classList.toggle('vazio',!valor);
    if(valor&&!REDUZ){dd.classList.remove('flash');void dd.offsetWidth;dd.classList.add('flash')}
  }
  function atualizarFicha(){
    const d=dados();
    setF('servico',d.servico);
    setF('medidas',d.sem?'A medir na loja':(d.w&&d.h?d.w+' × '+d.h+' cm':''));
    setF('detalhes',d.desc?(d.desc.length>80?d.desc.slice(0,80)+'…':d.desc):'');
    setF('refs',anexos.length?(anexos.length===1?'1 imagem':anexos.length+' imagens'):'');
    setF('cliente',d.nome?d.nome+(d.tel?' · '+d.tel:''):'');
    setF('retorno',d.retorno+(d.periodo?' · '+d.periodo.toLowerCase():''));
    const preenchidos=[d.servico,d.desc,d.nome&&telOk(d.tel)].filter(Boolean).length+(anexos.length||d.w?1:0);
    $('#fichaProg').style.width=Math.min(100,preenchidos/4*100)+'%';
    pintarFicha();
  }
  function atualizarEtapas(){
    $$('.etapas__lista button').forEach(b=>{const k=+b.dataset.et;b.classList.toggle('feita',k<atual||feito);b.classList.toggle('atual',k===atual&&!feito);b.disabled=k>atual||feito;b.setAttribute('aria-current',k===atual?'step':'false')});
    $$('.etapas__moldura .c').forEach((c,i)=>{c.classList.toggle('on',i<atual-1||feito);c.classList.toggle('pulsa',i===atual-1&&!feito)});
    $('.etapas__barra i').style.width=(feito?100:((atual-1)/total)*100)+'%';
    barra.classList.toggle('completa',feito);
    $('#etapaTxt').textContent=feito?'Ficha concluída':'Etapa '+atual+' de '+total;
    btnVolta.hidden=atual===1;
    btnAv.innerHTML=(atual===total?'Preparar orçamento ':'Continuar ')+SETA;
    $('#etapaDica').textContent=atual===3?'Etapa opcional':atual===1?'Escolha uma opção':'Enter para continuar';
  }
  function irPara(n,dir){
    n=clamp(n,1,total);if(n===atual)return;
    const ant=etapas[atual-1],nova=etapas[n-1],h0=trilho.offsetHeight;
    ant.hidden=true;nova.hidden=false;
    if(!REDUZ){
      const h1=trilho.offsetHeight;trilho.style.height=h0+'px';void trilho.offsetHeight;trilho.style.height=h1+'px';setTimeout(()=>{trilho.style.height=''},620);
      nova.classList.remove('entra-d','entra-e');void nova.offsetWidth;nova.classList.add(dir<0?'entra-e':'entra-d');
    }
    atual=n;atualizarEtapas();
    const f=$('input:not(.sr):not([type=radio]):not([type=checkbox]),textarea',nova);if(f&&n>1)setTimeout(()=>f.focus({preventScroll:true}),60);
    const topo=form.getBoundingClientRect().top;if(topo<90)window.scrollTo({top:window.scrollY+topo-140,behavior:REDUZ?'auto':'smooth'});
    if(n===2)requestAnimationFrame(pintarFicha);
  }
  function validarEtapa(n){
    if(n===1){const okS=!!$('input[name=servico]:checked',form);$('#erroServico').textContent=okS?'':'Escolha uma opção para continuar.';if(!okS)tremer($('.servicos-op'));return okS}
    if(n===2){const okD=desc.value.trim().length>4;$('#erroDesc').textContent=okD?'':'Conte em poucas palavras o que você precisa.';desc.setAttribute('aria-invalid',okD?'false':'true');if(!okD){tremer(desc.closest('.flutua'));desc.focus()}return okD}
    if(n===4){const okC=validar([[nome,$('#orcNomeErro'),v=>v.length>1,'Informe seu nome.'],[tel,$('#orcTelErro'),telOk,'Informe um WhatsApp com DDD.']]);if(!okC)tremer($('.campos-2'));return okC}
    return true;
  }
  function concluir(){
    const d=dados(),med=d.sem?'A medir na loja':(d.w&&d.h?d.w+' × '+d.h+' cm':'Não informado');
    texto='Olá, Norart! Gostaria de um orçamento (ficha nº '+num+').\n\n*Serviço:* '+d.servico+'\n*Medidas:* '+med+'\n*Detalhes:* '+d.desc+'\n*Nome:* '+d.nome+'\n*WhatsApp:* '+d.tel+'\n*Retorno por:* '+d.retorno+(d.periodo?' ('+d.periodo.toLowerCase()+')':'')+(anexos.length?'\n\nVou enviar '+(anexos.length===1?'1 imagem':anexos.length+' imagens')+' de referência nesta conversa.':'');
    $('#orcResumo').textContent=texto;$('#orcZap').href=zap(texto);
    $('#orcOkTxt').textContent=anexos.length?'Toque em “Enviar pelo WhatsApp” para abrir a conversa com a mensagem pronta e anexe lá '+(anexos.length===1?'a imagem escolhida':'as '+anexos.length+' imagens escolhidas')+'.':'Toque em “Enviar pelo WhatsApp” para abrir a conversa com a mensagem pronta.';
    feito=true;atualizarEtapas();ficha.classList.add('pronta');
    form.hidden=true;ok.hidden=false;if(!REDUZ){ok.classList.remove('entra-d');void ok.offsetWidth;ok.classList.add('entra-d')}ok.focus({preventScroll:true});
  }

  form.addEventListener('submit',e=>{e.preventDefault();if(!validarEtapa(atual))return;if(atual<total){irPara(atual+1,1);return}concluir()});
  btnVolta.addEventListener('click',()=>irPara(atual-1,-1));
  $$('.etapas__lista button').forEach(b=>b.addEventListener('click',()=>{const k=+b.dataset.et;if(k<atual)irPara(k,-1)}));
  form.addEventListener('change',e=>{
    const t=e.target;
    if(t.name==='servico'){$('#erroServico').textContent='';if(atual===1)setTimeout(()=>{if(atual===1&&!feito)irPara(2,1)},480)}
    if(t.name==='retorno'||t.name==='periodo')posicionarPilulas();
    atualizarFicha();
  });
  form.addEventListener('input',e=>{
    const t=e.target;
    if(t===tel&&(e.inputType||'').indexOf('delete')!==0)tel.value=mascaraTel(tel.value);
    if(t===desc){$('#descCont').textContent=desc.value.length+'/600';if(desc.value.trim().length>4)$('#erroDesc').textContent=''}
    atualizarFicha();
  });
  semMed.addEventListener('change',()=>{$('.medidas').classList.toggle('sem',semMed.checked);inW.disabled=inH.disabled=semMed.checked;$$('[data-passo]').forEach(b=>b.disabled=semMed.checked)});
  $$('[data-passo]').forEach(b=>b.addEventListener('click',()=>{
    const inp=b.dataset.passo==='w'?inW:inH;inp.value=clamp((+inp.value||0)+(+b.dataset.d),5,400);
    const num=inp.closest('.num');num.classList.remove('bump');void num.offsetWidth;num.classList.add('bump');atualizarFicha();
  }));
  $$('.sug').forEach(b=>b.addEventListener('click',()=>{
    const frase=b.dataset.sug,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on?'true':'false');
    let v=desc.value;if(on){if(v.indexOf(frase)<0)v=(v.trim()?v.trim()+' ':'')+frase}else v=v.replace(frase,'').replace(/\s{2,}/g,' ').trim();
    desc.value=v.slice(0,600);desc.dispatchEvent(new Event('input',{bubbles:true}));
  }));
  function renderAnexos(novos){
    $('#anexos').innerHTML=anexos.map((a,i)=>'<li class="'+(novos&&i>=anexos.length-novos?'cai':'')+'" style="--r:'+a.r+'deg;--d:'+((i%4)*.06)+'s"><span class="polaroide"><img src="'+a.url+'" alt="'+esc(a.nome)+'"></span><button type="button" data-i="'+i+'" aria-label="Remover '+esc(a.nome)+'">×</button></li>').join('');
    $('#orcDrop').classList.toggle('tem',anexos.length>0);
  }
  const add=files=>{const lista=Array.from(files||[]).filter(f=>/^image\//.test(f.type)).slice(0,Math.max(0,8-anexos.length));lista.forEach(f=>anexos.push({nome:f.name,url:URL.createObjectURL(f),r:Math.round((Math.random()*8-4)*10)/10}));renderAnexos(lista.length);atualizarFicha();if(lista.length)avisar(lista.length===1?'Imagem adicionada':lista.length+' imagens adicionadas')};
  $('#orcArq').addEventListener('change',e=>{add(e.target.files);e.target.value=''});
  const dz=$('#orcDrop');
  ['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('sobre')}));
  ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('sobre')}));
  dz.addEventListener('drop',e=>add(e.dataTransfer&&e.dataTransfer.files));
  $('#anexos').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const i=+b.dataset.i;URL.revokeObjectURL(anexos[i].url);anexos.splice(i,1);renderAnexos(0);atualizarFicha()});
  function posicionarPilulas(){$$('.segmento').forEach(sg=>{const lab=$('input:checked',sg),p=$('.segmento__pilula',sg);if(!lab||!p)return;const l=lab.closest('label');p.style.width=l.offsetWidth+'px';p.style.transform='translateX('+l.offsetLeft+'px)'})}
  $('#orcEditar').addEventListener('click',()=>{feito=false;ficha.classList.remove('pronta');ok.hidden=true;form.hidden=false;atualizarEtapas();nome.focus()});
  $('#orcCopiar').addEventListener('click',()=>copiar(texto));
  $('#orcNovo').addEventListener('click',()=>{
    form.reset();anexos.splice(0).forEach(a=>URL.revokeObjectURL(a.url));renderAnexos(0);$$('.sug').forEach(b=>b.setAttribute('aria-pressed','false'));$('#descCont').textContent='0/600';$('.medidas').classList.remove('sem');inW.disabled=inH.disabled=false;
    feito=false;ficha.classList.remove('pronta');ok.hidden=true;form.hidden=false;etapas.forEach((f,i)=>f.hidden=i!==0);atual=1;atualizarEtapas();atualizarFicha();posicionarPilulas();
  });
  let descAuto='';
  preencherFicha=o=>{
    if(feito){feito=false;ficha.classList.remove('pronta');ok.hidden=true;form.hidden=false;atualizarEtapas()}
    if(o.w&&o.h){inW.value=o.w;inH.value=o.h;semMed.checked=false;$('.medidas').classList.remove('sem');inW.disabled=inH.disabled=false;$$('[data-passo]').forEach(b=>b.disabled=false)}
    if(o.desc&&(!desc.value.trim()||desc.value===descAuto)){desc.value=o.desc.slice(0,600);descAuto=desc.value;desc.dispatchEvent(new Event('input',{bubbles:true}))}
    if(o.foto&&anexos.length<8&&!anexos.some(a=>a.de===o.foto)){anexos.push({nome:o.foto.name||'Sua obra',url:URL.createObjectURL(o.foto),r:Math.round((Math.random()*8-4)*10)/10,de:o.foto});renderAnexos(1)}
    const s=$('input[name=servico][value="Emoldurar obra ou fotografia"]',form);
    if(s&&!s.checked){s.checked=true;s.dispatchEvent(new Event('change',{bubbles:true}))}else atualizarFicha();
    avisar('Sua combinação já está na ficha');
  };
  atualizarEtapas();atualizarFicha();
  requestAnimationFrame(posicionarPilulas);addEventListener('resize',posicionarPilulas);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(posicionarPilulas);
  const segObs=new MutationObserver(()=>requestAnimationFrame(posicionarPilulas));etapas.forEach(f=>segObs.observe(f,{attributes:true,attributeFilter:['hidden']}));
}
function statusLoja(){
  const el=$('#status');let agora;
  try{agora=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Sao_Paulo'}))}catch(e){agora=new Date()}
  const d=agora.getDay(),h=agora.getHours()+agora.getMinutes()/60,util=d>=1&&d<=5,sab=d===6,fecha=util?18:sab?13:0,aberto=(util||sab)&&h>=9&&h<fecha;let txt;
  if(aberto)txt='Aberto agora · fecha às '+fecha+'h';else if((util||sab)&&h<9)txt='Fechado agora · abre hoje às 9h';else if(d===6||d===0)txt='Fechado agora · abre segunda às 9h';else if(d===5)txt='Fechado agora · abre sábado às 9h';else txt='Fechado agora · abre amanhã às 9h';
  el.textContent=txt;el.classList.toggle('aberto',aberto);
}

/* ================= WhatsApp contextual ================= */
const MSG_GERAL='Olá, Norart! Vim pelo site e gostaria de um orçamento.';
const CTX={
  inicio:[MSG_GERAL,'Fale com a Norart'],
  produtos:['Olá, Norart! Vi os produtos no site e gostaria de um orçamento.','Orçar produtos'],
  produto:[()=>'Olá, Norart! Vi a moldura "'+(MOLD[prodAtual]||MOLDURAS[0]).nome+'" no site e gostaria de um orçamento.',()=>'Orçar '+(MOLD[prodAtual]||MOLDURAS[0]).nome],
  provador:[textoSimulacao,'Orçar esta simulação'],
  projetos:['Olá, Norart! Vi os projetos no site e gostaria de algo parecido.','Quero um projeto assim'],
  sobre:[MSG_GERAL,'Fale com a Norart'],
  contato:['Olá, Norart! Gostaria de visitar a loja. Qual o melhor horário?','Agendar uma visita']
};
let dicaT,provNaTela=false;
function moverProvador(vista){
  const slot=$('.slot-provador[data-slot="'+vista+'"]'),tool=$('#provTool');
  if(slot&&tool&&tool.parentNode!==slot)slot.appendChild(tool);
}
function vigiarProvadorHome(){
  if(!('IntersectionObserver' in window))return;
  new IntersectionObserver(([e])=>{const antes=provNaTela;provNaTela=e.isIntersecting&&vistaAtual==='inicio';if(antes!==provNaTela)atualizarZap(provNaTela)},{rootMargin:'-30% 0px -30% 0px'}).observe($('#secProvHome'));
}
function atualizarZap(mostrar){
  const chave=(vistaAtual==='inicio'&&provNaTela)?'provador':vistaAtual;
  const c=CTX[chave]||CTX.inicio,v=f=>typeof f==='function'?f():f,a=$('#zapFlutua');
  a.href=zap(v(c[0]));$('#zapDica').textContent=v(c[1]);
  if(mostrar&&(vistaAtual!=='inicio'||provNaTela)){a.classList.add('dica');clearTimeout(dicaT);dicaT=setTimeout(()=>a.classList.remove('dica'),2600)}
}

/* ================= fotos ausentes ================= */
function protegerFotos(){document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG')t.style.visibility='hidden'},true)}

/* ================= redesenho ================= */
function redesenhar(){
  if(vistaAtual==='inicio'||vistaAtual==='provador')atualizarProvador();
  if(vistaAtual==='provador'){pintarAD();pintarTeste()}
  if(vistaAtual==='produtos')pintarDemosVidro();
  if(vistaAtual==='produto')pintarProduto();
  if(vistaAtual==='contato'&&pintarFicha)pintarFicha();
}

/* ================= início ================= */
$('#ano').textContent=new Date().getFullYear();
protegerFotos();
renderCartoes();
ligarTopo();
ligarHero();
construirProvador();
ligarProvador();
ligarTeste();
ligarProjetos();
ligarFicha();
vigiarProvadorHome();
statusLoja();setInterval(statusLoja,60000);
$$('[data-zap="geral"]').forEach(a=>a.href=zap(MSG_GERAL));
$$('[data-copiar]').forEach(b=>b.addEventListener('click',()=>copiar(b.dataset.copiar)));
$$('[data-zap-msg]').forEach(a=>a.href=zap(a.dataset.zapMsg));
(function anosNorart(){const el=$('#anosNorart');if(!el)return;const n=Math.max(28,new Date().getFullYear()-1998);el.dataset.conta=n;el.textContent=n})();
(function ligarMitos(){
  const cards=$$('.mito'),vistos=new Set(),placar=$('#mitosPlacar');if(!cards.length)return;
  const atualizar=()=>{
    const n=vistos.size;$('#mitosBarra').style.width=(n/cards.length*100)+'%';
    if(n===cards.length&&!placar.classList.contains('completo')){placar.classList.add('completo');placar.querySelector('span').innerHTML='Você descobriu os <b>4</b>. <a class="link" href="#contato">Quer orientação para a sua obra? '+SETA+'</a>'}
    else if(n<cards.length)$('#mitosN').textContent=n;
  };
  cards.forEach((c,i)=>{
    c.addEventListener('click',()=>{const on=c.getAttribute('aria-pressed')!=='true';c.setAttribute('aria-pressed',on?'true':'false');if(on){vistos.add(i);atualizar()}});
    if(!REDUZ&&window.matchMedia('(hover:hover)').matches){
      c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');c.style.setProperty('--ry',(x*9).toFixed(2)+'deg')});
      c.addEventListener('mouseleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
    }
  });
})();
addEventListener('hashchange',rota);
rota();
observar(document);
const pronto=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.add('pronto')));
const heroImg=$('.hero__foto img');if(heroImg.complete)pronto();else{heroImg.addEventListener('load',pronto);heroImg.addEventListener('error',pronto);setTimeout(pronto,1800)}
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(redesenhar,140)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(redesenhar);
})();
