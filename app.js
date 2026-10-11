const sb=supabase.createClient(CONFIG.URL,CONFIG.KEY);
let lang=localStorage.getItem('lang')||'fr';
const T={
fr:{home:'Accueil',space:'Espace entreprise',search:'Rechercher',job:'Métier ou mot-clé',city:'Ville',sector:'Secteur',all:'Tous',latest:'Dernières offres',none:'Aucune offre trouvée.',back:'← Retour',apply:'Comment postuler',email:'Email',pass:'Mot de passe (8 caractères min.)',login:'Connexion',signup:'Créer un compte',logout:'Déconnexion',post:'Publier une offre',title:'Titre du poste',company:'Nom de l\'entreprise',desc:'Description (missions, profil, contrat…)',contact:'Contact (email, téléphone ou lien)',send:'Envoyer pour validation',mine:'Mes offres',pending:'En attente',approved:'Publiée',rejected:'Refusée',sent:'Offre envoyée ! Elle sera visible après validation.',checkmail:'Compte créé. Vérifiez votre email pour confirmer, puis connectez-vous.',toval:'Offres à valider',approve:'Approuver',reject:'Refuser',noadmin:'Accès réservé aux administrateurs.',error:'Erreur : '},
ar:{home:'الرئيسية',space:'فضاء الشركات',search:'بحث',job:'المهنة أو كلمة مفتاحية',city:'المدينة',sector:'القطاع',all:'الكل',latest:'أحدث العروض',none:'لا توجد عروض.',back:'الرجوع ←',apply:'كيفية التقديم',email:'البريد الإلكتروني',pass:'كلمة المرور (8 أحرف على الأقل)',login:'تسجيل الدخول',signup:'إنشاء حساب',logout:'تسجيل الخروج',post:'نشر عرض',title:'عنوان الوظيفة',company:'اسم الشركة',desc:'الوصف (المهام، الملف المطلوب، نوع العقد…)',contact:'التواصل (بريد، هاتف أو رابط)',send:'إرسال للمراجعة',mine:'عروضي',pending:'قيد المراجعة',approved:'منشور',rejected:'مرفوض',sent:'تم إرسال العرض! سيظهر بعد المراجعة.',checkmail:'تم إنشاء الحساب. تحقق من بريدك لتأكيده ثم سجل الدخول.',toval:'عروض بانتظار المراجعة',approve:'قبول',reject:'رفض',noadmin:'هذه الصفحة للمسؤولين فقط.',error:'خطأ: '}};
const CITIES=[['Casablanca','الدار البيضاء'],['Rabat','الرباط'],['Marrakech','مراكش'],['Tanger','طنجة'],['Fès','فاس'],['Agadir','أكادير'],['Meknès','مكناس'],['Oujda','وجدة'],['Kénitra','القنيطرة'],['Tétouan','تطوان'],['Salé','سلا'],['Laâyoune','العيون'],['Télétravail','عن بعد']];
const SECTORS=[['Informatique','المعلوميات'],['Commerce','التجارة'],['Call center','مراكز النداء'],['Industrie','الصناعة'],['BTP','البناء والأشغال العمومية'],['Santé','الصحة'],['Éducation','التعليم'],['Tourisme et hôtellerie','السياحة والفندقة'],['Banque et assurance','البنوك والتأمين'],['Transport et logistique','النقل واللوجستيك'],['Administration','الإدارة'],['Autre','أخرى']];
const t=k=>T[lang][k]||k;
const L=(list,v)=>{const x=list.find(a=>a[0]===v);return x?x[lang==='ar'?1:0]:v};
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function opts(sel,list,all){sel.replaceChildren();if(all){const o=el('option',null,t('all'));o.value='';sel.append(o)}list.forEach(a=>{const o=el('option',null,a[lang==='ar'?1:0]);o.value=a[0];sel.append(o)})}
function msg(box,text,ok){box.replaceChildren(el('div','msg '+(ok?'ok':'err'),text))}
function logoImg(url){if(!url)return null;const i=el('img','logo');i.src=url;i.alt='';i.loading='lazy';return i}
function jobCard(j){const a=el('a','card');a.href='job.html?id='+encodeURIComponent(j.id);const l=logoImg(j.logo_url);if(l)a.append(l);const w=el('div','ct');w.append(el('h3',null,j.title),el('div','muted',j.company));const d=el('div');d.append(el('span','tag',L(CITIES,j.city)),el('span','tag',L(SECTORS,j.sector)));w.append(d);a.append(w);return a}
function bigCard(j){
  const a=el('a','card big');a.href='job.html?id='+encodeURIComponent(j.id);
  const l=logoImg(j.logo_url);
  a.append(l||el('div','ini',(j.company||'?').trim().charAt(0).toUpperCase()));
  const d=new Date(j.created_at).toLocaleDateString(lang==='ar'?'ar-MA':'fr-FR');
  a.append(el('h3',null,j.title),el('div','muted',d+' | '+j.company));
  const tg=el('div');tg.append(el('span','tag',L(CITIES,j.city)),el('span','tag',L(SECTORS,j.sector)));
  a.append(tg,el('div','ds',(j.description||'').slice(0,220)));
  return a;
}
async function uploadLogo(file){
  if(!file)return null;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('PNG, JPG ou WEBP seulement');
  if(file.size>204800)throw new Error('Logo trop lourd (max 200 Ko)');
  const {data:{session}}=await sb.auth.getSession();
  const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
  const path=session.user.id+'/'+crypto.randomUUID()+'.'+ext;
  const {error}=await sb.storage.from('logos').upload(path,file,{contentType:file.type});
  if(error)throw error;
  return sb.storage.from('logos').getPublicUrl(path).data.publicUrl;
}
function init(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.getElementById('hd').innerHTML='<a href="index.html">💼 JOB Maroc</a><nav><a href="index.html">'+t('home')+'</a><a href="espace.html">'+t('space')+'</a><button id="lg">'+(lang==='ar'?'FR':'عربي')+'</button></nav>';
  document.getElementById('lg').onclick=()=>{localStorage.setItem('lang',lang==='ar'?'fr':'ar');location.reload()};
  document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
  document.querySelectorAll('[data-p]').forEach(e=>e.placeholder=t(e.dataset.p));
}
