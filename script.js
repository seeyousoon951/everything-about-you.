const screens = ['home','quiz','scanning','result'];
const questions = [
  {title:'ما لونك المفضل؟', hint:'اختر إجابة واحدة للمتابعة.', type:'choice', options:['أزرق','أخضر','أسود','أحمر']},
  {title:'ما نوع المكان الذي تفضله؟', hint:'سؤال عشوائي ضمن التجربة.', type:'choice', options:['مدينة كبيرة','مكان هادئ','قرب البحر','الجبال']},
  {title:'ما أول حرف من اسمك؟', hint:'يمكنك إدخال حرف فقط أو تخطي السؤال.', type:'text', placeholder:'اكتب حرفًا أو كلمة'},
  {title:'ما اسمك الأول؟', hint:'اختياري — سيظهر في نتيجة المقلب على جهازك فقط.', type:'text', placeholder:'اكتب اسمًا أو اتركه فارغًا'}
];
let index=0, answers={};
function show(id){screens.forEach(s=>document.getElementById(s).classList.toggle('hidden',s!==id));window.scrollTo({top:0,behavior:'smooth'});}
function renderQuestion(){
  const q=questions[index];
  document.getElementById('stepLabel').textContent=`السؤال ${index+1}/${questions.length}`;
  document.getElementById('quizProgress').style.width=((index+1)/questions.length*100)+'%';
  document.getElementById('questionTitle').textContent=q.title;
  document.getElementById('questionHint').textContent=q.hint;
  const box=document.getElementById('answers'), input=document.getElementById('textAnswer');
  box.innerHTML=''; input.value=answers[index]||'';
  box.classList.toggle('hidden',q.type!=='choice'); input.classList.toggle('hidden',q.type!=='text');
  if(q.type==='choice') q.options.forEach(option=>{
    const b=document.createElement('button'); b.className='answer'+(answers[index]===option?' selected':''); b.textContent=option;
    b.onclick=()=>{answers[index]=option;renderQuestion();}; box.appendChild(b);
  });
  input.placeholder=q.placeholder||'اكتب إجابتك هنا';
  document.getElementById('backBtn').style.visibility=index===0?'hidden':'visible';
  document.getElementById('nextBtn').textContent=index===questions.length-1?'ابدأ التحليل ←':'التالي ←';
}
document.getElementById('startBtn').onclick=()=>{index=0;renderQuestion();show('quiz');};
document.getElementById('backBtn').onclick=()=>{if(index>0){if(questions[index].type==='text')answers[index]=document.getElementById('textAnswer').value.trim();index--;renderQuestion();}};
document.getElementById('nextBtn').onclick=()=>{
  const q=questions[index]; if(q.type==='text') answers[index]=document.getElementById('textAnswer').value.trim();
  if(index<questions.length-1){index++;renderQuestion();}else startScan();
};
function startScan(){
  show('scanning');let p=0;
  const bar=document.getElementById('scanProgress'), pct=document.getElementById('percent');
  ['scan1','scan2','scan3'].forEach(id=>document.getElementById(id).classList.remove('done'));
  const timer=setInterval(()=>{p+=4+Math.random()*10;if(p>=100)p=100;bar.style.width=p+'%';pct.textContent=Math.floor(p)+'%';
    if(p>25)document.getElementById('scan1').classList.add('done');
    if(p>55)document.getElementById('scan2').classList.add('done');
    if(p>82)document.getElementById('scan3').classList.add('done');
    if(p>=100){clearInterval(timer);setTimeout(showResult,650);}
  },170);
}
function showResult(){
  const name=(answers[3]||'عميل مجهول').slice(0,60);
  const color=answers[0]||'غير محدد';
  document.getElementById('resultName').textContent=name+' (إجابة أدخلتها)';
  document.getElementById('resultColor').textContent=color;
  document.getElementById('resultCity').textContent='غير معروف — لا يتم تحديد الموقع';
  show('result');
}
document.getElementById('againBtn').onclick=()=>{answers={};index=0;renderQuestion();show('home');};
