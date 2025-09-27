/* =============== DATA (dummy MCQs + AI style notes) ================== */
const DATA = {
  acp: {
    physics: {
      "Electricity": [
        {q:"Ohm's Law is:", options:["V=IR","P=VI","Q=It","R=V/I"], answer:0},
        {q:"Unit of current is:", options:["Volt","Ampere","Ohm"], answer:1}
      ],
      "Magnetic Effects": [
        {q:"Magnetic field around straight conductor is:", options:["Circular","Rectangular","Straight"], answer:0}
      ]
    },
    chemistry: {
      "Chemical Reactions": [
        {q:"Oxidation is:", options:["Gain of electrons","Loss of electrons","Loss of oxygen"], answer:1}
      ],
      "Acids, Bases and Salts": [
        {q:"Litmus in base turns:", options:["Red","Blue","Green"], answer:1}
      ]
    },
    biology: {
      "Life Processes": [
        {q:"Photosynthesis occurs in:", options:["Mitochondria","Chloroplast","Nucleus"], answer:1}
      ],
      "Heredity & Evolution": [
        {q:"DNA located in:", options:["Nucleus","Cytoplasm","Cell wall"], answer:0}
      ]
    }
  },
  notes: {
    physics: {
      "Electricity":[
        "Current (I) = Q/t, SI unit Ampere.",
        "Ohm’s Law: V=IR. Resistance depends on material, length, area.",
        "Power: P=VI=I²R.",
        "Series vs Parallel circuits: series adds R, parallel lowers R."
      ],
      "Magnetic Effects":[
        "Moving charges produce magnetic fields.",
        "Right-hand thumb rule to find field direction.",
        "Fleming’s left-hand rule for motors."
      ]
    },
    chemistry: {
      "Chemical Reactions":[
        "Chemical reaction involves breaking old bonds and forming new bonds.",
        "Types: Combination, Decomposition, Displacement, Redox."
      ],
      "Acids, Bases and Salts":[
        "Acids turn blue litmus red, Bases turn red litmus blue.",
        "Neutralization produces salt + water."
      ]
    },
    biology: {
      "Life Processes":[
        "Nutrition, respiration, transportation, excretion are key processes.",
        "Photosynthesis in chloroplast uses sunlight to form glucose."
      ],
      "Heredity & Evolution":[
        "Traits pass from parents to offspring through genes.",
        "Variation and natural selection drive evolution."
      ]
    }
  },
  quiz:[
    {q:"Power formula", options:["P=IR","P=VI","P=V/I"], answer:1}
  ]
};

/* =============== LOGIN PAGE ============== */
function doLogin(e){
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const gender=document.getElementById('gender').value;
  const role=document.getElementById('role').value;
  const pwd=document.getElementById('password').value;

  if(!name||!email||!gender||!role){alert('Fill all fields');return;}

  if(role==="Admin" && pwd!=="JaydeepAdmin123"){alert('Wrong Admin password');return;}

  localStorage.setItem('sp_user',JSON.stringify({name,email,gender,role}));
  window.location.href='dashboard.html';
}

/* =============== DASHBOARD FUNCTIONS ============== */

let currentSubject="physics";
let currentChapter=null;

function showSection(id){
  ['acp','quiz','notes','contact'].forEach(sec=>{
    document.getElementById(sec).style.display='none';
  });
  document.getElementById(id).style.display='block';
  if(id==='acp') buildChapters('acp');
  if(id==='notes') buildChapters('notes');
  if(id==='quiz') renderQuiz();
}

function buildChapters(type){
  const container = document.getElementById(type==='acp'?'acp-chapters':'notes-chapters');
  container.innerHTML='';
  const chapters = Object.keys(DATA[type][currentSubject]);
  chapters.forEach(ch=>{
    const btn=document.createElement('button');
    btn.className='btn ghost';
    btn.textContent=ch;
    btn.onclick=()=>{currentChapter=ch; if(type==='acp') renderACP(); else renderNotes();}
    container.appendChild(btn);
  });
  // auto select first chapter
  if(chapters.length>0){
    currentChapter=chapters[0];
    if(type==='acp') renderACP(); else renderNotes();
  }
}

function switchACP(sub,el){
  currentSubject=sub;
  document.querySelectorAll('#acp .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  buildChapters('acp');
}

function switchNotes(sub,el){
  currentSubject=sub;
  document.querySelectorAll('#notes .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  buildChapters('notes');
}

function renderACP(){
  const list=document.getElementById('acp-list');list.innerHTML='';
  const arr=DATA.acp[currentSubject][currentChapter];
  arr.forEach((q,i)=>{
    const d=document.createElement('div');d.className='qa';
    d.innerHTML=`<div class='q'>${i+1}. ${q.q}</div>`+
      q.options.map((op,oi)=>`<label class='opt'><input type='radio' name='${currentChapter}-${i}' value='${oi}'>${op}</label>`).join('');
    list.appendChild(d);
  });
}

function renderNotes(){
  const list=document.getElementById('notes-content');list.innerHTML='';
  const arr=DATA.notes[currentSubject][currentChapter];
  const d=document.createElement('div');
  d.className='qa';
  d.innerHTML=`<h3>${currentChapter}</h3><ul>`+arr.map(p=>`<li>${p}</li>`).join('')+`</ul>`;
  list.appendChild(d);
}

function renderQuiz(){
  const list=document.getElementById('quiz-list');list.innerHTML='';
  DATA.quiz.forEach((q,i)=>{
    const d=document.createElement('div');d.className='qa';
    d.innerHTML=`<div class='q'>${i+1}. ${q.q}</div>`+
      q.options.map((op,oi)=>`<label class='opt'><input type='radio' name='quiz-${i}' value='${oi}'>${op}</label>`).join('');
    list.appendChild(d);
  });
}

function check(section){
  let score=0;
  DATA[section].forEach((q,i)=>{
    const sel=document.querySelector(`input[name='${section}-${i}']:checked`);
    if(sel && Number(sel.value)===q.answer)score++;
  });
  alert(`Score: ${score}/${DATA[section].length}`);
}

function checkACP(){
  const arr=DATA.acp[currentSubject][currentChapter];
  let score=0;
  arr.forEach((q,i)=>{
    const sel=document.querySelector(`input[name='${currentChapter}-${i}']:checked`);
    if(sel && Number(sel.value)===q.answer)score++;
  });
  alert(`${currentChapter} Score: ${score}/${arr.length}`);
}

/* =============== CONTACT MAIL ============== */
function sendMail(e){
  e.preventDefault();
  const s=encodeURIComponent(e.target.subject.value);
  const m=encodeURIComponent(e.target.message.value);
  const u=JSON.parse(localStorage.getItem('sp_user')||'{}');
  const body=`${m}%0D%0AFrom: ${u.name||''} (${u.email||''})`;
  window.location.href=`mailto:vermajaydeep512@gamil.com?subject=${s}&body=${body}`;
}

/* =============== LOGOUT ============== */
function logout(){
  localStorage.removeItem('sp_user');
  window.location.href='login.html';
}

/* =============== INIT DASHBOARD ============== */
if(window.location.pathname.includes('dashboard.html')){
  // default view
  showSection('acp');
}
