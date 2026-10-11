function bigCard(j){
  const a=el('a','card big');a.href='job.html?id='+encodeURIComponent(j.id);
  const l=logoImg(j.logo_url);
  a.append(l||el('div','ini',(j.company||'?').trim().charAt(0).toUpperCase()));
  const b=el('div','bd');
  const d=new Date(j.created_at).toLocaleDateString(lang==='ar'?'ar-MA':'fr-FR');
  b.append(el('h3',null,j.title),el('div','muted',d+' | '+j.company));
  b.append(el('div','ds',(j.description||'').slice(0,220)));
  const fr=lang!=='ar';
  b.append(el('div','info',(fr?'Secteur : ':'القطاع: ')+L(SECTORS,j.sector)+' · '+(fr?'Ville : ':'المدينة: ')+L(CITIES,j.city)));
  if(j.function)b.append(el('div','info',(fr?'Fonction : ':'الوظيفة: ')+j.function));
  if(j.experience)b.append(el('div','info',(fr?'Expérience : ':'الخبرة: ')+j.experience));
  if(j.contract)b.append(el('div','info',(fr?'Contrat : ':'العقد: ')+j.contract));
  a.append(b);return a;
}
