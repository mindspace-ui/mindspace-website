// MindSpace interactive features
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

// Mobile navigation
const header = $('.site-header');
$('#menuToggle').addEventListener('click', () => {
  const opened = header.classList.toggle('nav-open');
  $('#menuToggle').setAttribute('aria-expanded', String(opened));
});
$$('#mainNav a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('nav-open');
  $('#menuToggle').setAttribute('aria-expanded', 'false');
}));

// Flashcards: tap/click or keyboard activation
$$('.flash-card').forEach(card => card.addEventListener('click', () => {
  const flipped = card.classList.toggle('flipped');
  card.setAttribute('aria-pressed', String(flipped));
}));

// Multi-step, 10-question check-in quiz
const questions = [
 { q:'When you feel overwhelmed, what helps most?', options:[['quiet','Having a quiet moment'],['people','Talking with someone I trust'],['move','Taking a walk or moving around']] },
 { q:'What is one sign you may need a break?', options:[['tired','Feeling tired or having trouble focusing'],['push','Feeling like I must keep going no matter what'],['unsure','I am still learning to notice the signs']] },
 { q:'Which activity sounds most relaxing today?', options:[['music','Listening to music'],['nature','Spending time outdoors'],['creative','Drawing, writing, or another hobby']] },
 { q:'If a school task feels too big, what could help?', options:[['small','Break it into smaller steps'],['ask','Ask a teacher or classmate for help'],['pause','Pause, then make a simple plan']] },
 { q:'What is a helpful way to support a friend?', options:[['listen','Listen without judging'],['advice','Ask what kind of help they want'],['company','Spend time with them if they want company']] },
 { q:'What does self-care mean to you?', options:[['rest','Making time to rest'],['balance','Balancing school, relationships, and personal time'],['needs','Noticing what I need and asking for support']] },
 { q:'When you make a mistake, what is a kind reminder?', options:[['learn','Mistakes can help me learn'],['human','I am human, and nobody is perfect'],['again','I can try again when I am ready']] },
 { q:'Which habit could support your well-being?', options:[['sleep','Keeping a regular sleep routine when possible'],['journal','Writing down thoughts or feelings'],['connect','Checking in with someone I trust']] },
 { q:'What can you do when you notice a strong feeling?', options:[['name','Name the feeling without judging it'],['breathe','Take a comfortable pause and breathe normally'],['share','Talk with someone safe and supportive']] },
 { q:'What reminder would you like to take with you?', options:[['time','I can take things one step at a time'],['enough','I deserve patience and kindness'],['help','It is okay to ask for help']] }
];
let quizIndex = 0;
const quizAnswers = [];
function renderQuiz() {
 const item=questions[quizIndex];
 $('#quizStep').textContent=`Question ${quizIndex+1} of ${questions.length}`;
 $('#quizProgress').style.width=`${((quizIndex+1)/questions.length)*100}%`;
 $('#quizQuestion').textContent=item.q; $('#quizOptions').innerHTML='';
 item.options.forEach(([value,label])=>{ const btn=document.createElement('button'); btn.className='option'+(quizAnswers[quizIndex]===value?' selected':''); btn.textContent=label; btn.type='button'; btn.addEventListener('click',()=>{ quizAnswers[quizIndex]=value; $$('.option',$('#quizOptions')).forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); $('#quizNext').disabled=false; }); $('#quizOptions').appendChild(btn); });
 $('#quizBack').disabled=quizIndex===0; $('#quizNext').disabled=!quizAnswers[quizIndex];
 $('#quizNext').textContent=quizIndex===questions.length-1?'See my reminder':'Next question';
 $('#quizResult').hidden=true; $('#quizQuestion').hidden=false; $('#quizOptions').hidden=false;
}
$('#quizBack').addEventListener('click',()=>{if(quizIndex>0){quizIndex--;renderQuiz();}});
$('#quizNext').addEventListener('click',()=>{
 if($('#quizNext').textContent==='Start again'){quizIndex=0;quizAnswers.length=0;renderQuiz();return;}
 if(!quizAnswers[quizIndex])return;
 if(quizIndex<questions.length-1){quizIndex++;renderQuiz();return;}
 const reminders={
 time:'You can take things one step at a time. Small progress is still progress.', enough:'You deserve patience and kindness, including from yourself.', help:'Asking for help is a responsible way to care for yourself.', quiet:'A quiet moment may help you reset. Reach out to someone you trust if you need support.', people:'Connection can make hard moments feel less lonely. Choose someone you feel safe with.', move:'A change of scene or comfortable movement may help you pause.', tired:'Notice your needs and give yourself a chance to rest when you can.', push:'You do not have to do everything at once. Breaks are part of a healthy routine.', unsure:'It takes time to understand yourself. Keep noticing how you feel without judging yourself.', music:'Small comforting activities can make space for a reset.', nature:'A little time outside can offer a change of scene and a chance to pause.', creative:'Making something can be a gentle way to express yourself.', small:'Breaking a task into smaller steps can make it feel more manageable.', ask:'Asking questions is part of learning. You do not need to figure everything out alone.', pause:'A short pause and a simple plan can be a helpful start.', listen:'Listening without judgment can help a friend feel heard.', advice:'Asking what support someone wants shows care and respect.', company:'Being present can matter. Respect what your friend feels comfortable with.', rest:'Rest is a real part of self-care, not a reward you must earn.', balance:'It is okay to make room for school, relationships, and your own needs.', needs:'Noticing your needs is a useful skill. Support is available when you need it.', learn:'A mistake does not define you. You can learn and keep going.', human:'Everyone makes mistakes. Try speaking to yourself as kindly as you would to a friend.', again:'You are allowed to begin again at your own pace.', sleep:'A regular sleep routine, when possible, can support focus and mood.', journal:'Writing can help you reflect. You can keep it private and write only what feels comfortable.', connect:'You deserve support. A small check-in can be a good first step.', name:'Naming a feeling can help you understand what is happening without judging yourself.', breathe:'Let your breathing stay comfortable. You can stop any exercise that does not feel right.', share:'Talking with a trusted person can help you feel supported.'
 };
 $('#quizQuestion').hidden=true; $('#quizOptions').hidden=true; $('#quizResult').textContent=reminders[quizAnswers[9]]||'Be gentle with yourself. Take one small step at a time.'; $('#quizResult').hidden=false; $('#quizBack').disabled=true; $('#quizNext').textContent='Start again';
});
renderQuiz();

// Local demo poll
const pollVotes = { music: 0, nature: 0, people: 0, quiet: 0 };
const pollLabels = { music: 'Listening to music', nature: 'Spending time outdoors', people: 'Talking to someone', quiet: 'Quiet time or journaling' };
$('#pollForm').addEventListener('submit', event => {
  event.preventDefault();
  const chosen = new FormData(event.currentTarget).get('poll');
  if (!chosen) return;
  pollVotes[chosen]++;
  const total = Object.values(pollVotes).reduce((sum, n) => sum + n, 0);
  $('#pollResults').innerHTML = '<h3>Poll results (this session)</h3>' + Object.entries(pollVotes).map(([key, count]) => {
    const percent = total ? Math.round(count / total * 100) : 0;
    return `<div class="result-row"><div class="result-label"><span>${pollLabels[key]}</span><span>${percent}%</span></div><div class="result-bar"><span style="width:${percent}%"></span></div></div>`;
  }).join('');
});

// Mood check-in
const moodMessages = {
  happy: 'Let yourself enjoy this moment if you can. You can appreciate it without needing it to last forever.',
  calm: 'Notice what is helping you feel calm. You may want to return to it later.',
  tired: 'You may need a pause, a snack, water, or rest. Choose what is available and kind to you.',
  anxious: 'Try grounding in your surroundings and taking a comfortable breath. If this feeling sticks around, tell someone you trust.',
  sad: 'You do not need to rush this feeling away. A little connection or support may help.',
  mixed: 'More than one feeling can exist at once. You do not need to sort everything out immediately.'
};
$$('.mood-button').forEach(btn => btn.addEventListener('click', () => {
  $$('.mood-button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  $('#moodMessage').textContent = moodMessages[btn.dataset.mood];
}));
$('#clearMood').addEventListener('click', () => {
  $$('.mood-button').forEach(b => b.classList.remove('selected'));
  $('#moodMessage').textContent = 'Your mood is information, not a verdict. Choose an option to check in.';
});

// Guided breathing timer: comfortable 4-second in / 4-second out pattern
let breathingInterval = null;
let breathingTimeout = null;
let breathingStartedAt = 0;
function stopBreathing() {
  clearInterval(breathingInterval); clearTimeout(breathingTimeout);
  breathingInterval = null; breathingTimeout = null;
  $('#breathOrb').classList.remove('inhale', 'exhale');
  $('#breathWord').textContent = 'Ready?';
  $('#breathStatus').textContent = 'When you are ready, start a one-minute guided session. Breathe naturally and comfortably.';
  $('#breathStart').disabled = false; $('#breathStop').disabled = true;
}
$('#breathStart').addEventListener('click', () => {
  if (breathingInterval) return;
  $('#breathStart').disabled = true; $('#breathStop').disabled = false;
  breathingStartedAt = Date.now();
  const tick = () => {
    const elapsed = Math.floor((Date.now() - breathingStartedAt) / 1000);
    if (elapsed >= 60) { stopBreathing(); $('#breathStatus').textContent = 'Session complete. Take a moment to notice how you feel. You did well to pause.'; return; }
    const phase = elapsed % 8;
    const inhale = phase < 4;
    $('#breathOrb').classList.toggle('inhale', inhale);
    $('#breathOrb').classList.toggle('exhale', !inhale);
    $('#breathWord').textContent = inhale ? 'Breathe in' : 'Breathe out';
    $('#breathStatus').textContent = `${inhale ? 'Breathe in gently' : 'Breathe out gently'} — ${60 - elapsed} seconds left. Keep it comfortable.`;
  };
  tick(); breathingInterval = setInterval(tick, 1000);
});
$('#breathStop').addEventListener('click', stopBreathing);

// Rotating affirmations
const affirmations = [
  'I can take things one step at a time.',
  'I deserve patience, including from myself.',
  'My feelings are real, and I can meet them with care.',
  'Rest is a valid part of growth.',
  'I can ask for support when I need it.',
  'I do not need to be perfect to make progress.',
  'I am allowed to begin again.',
  'Small acts of care still count.'
];
let affirmationIndex = 0;
$('#newAffirmation').addEventListener('click', () => {
  affirmationIndex = (affirmationIndex + 1) % affirmations.length;
  $('#affirmationText').textContent = affirmations[affirmationIndex];
});
