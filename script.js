const canvas=document.getElementById('stars');
if(canvas){
  const ctx=canvas.getContext('2d');
  let stars=[];
  function resizeStars(){
    const ratio=window.devicePixelRatio||1;
    canvas.width=innerWidth*ratio;
    canvas.height=innerHeight*ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    stars=Array.from({length:Math.min(120,Math.floor(innerWidth/7))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.25,a:Math.random(),v:(Math.random()*.012+.002)*(Math.random()<.5?1:-1)}));
  }
  function drawStars(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(const star of stars){
      star.a+=star.v;
      if(star.a>1||star.a<.15)star.v*=-1;
      ctx.globalAlpha=star.a;
      ctx.fillStyle='#fff';
      ctx.beginPath();
      ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(drawStars);
  }
  resizeStars();
  drawStars();
  addEventListener('resize',resizeStars);
}

const memoryViewer=document.getElementById('memoryViewer');
if(memoryViewer){
  const slides=[...memoryViewer.querySelectorAll('.memory-slide')];
  const dots=[...memoryViewer.querySelectorAll('.memory-dot')];
  let activeMemory=0;
  function showMemory(index){
    activeMemory=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      const active=i===activeMemory;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',String(!active));
      dots[i].setAttribute('aria-current',String(active));
    });
  }
  document.getElementById('previousMemory').addEventListener('click',()=>showMemory(activeMemory-1));
  document.getElementById('nextMemory').addEventListener('click',()=>showMemory(activeMemory+1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>showMemory(i)));
  memoryViewer.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight')showMemory(activeMemory+1);
    if(event.key==='ArrowLeft')showMemory(activeMemory-1);
  });
  let touchStartX=0;
  memoryViewer.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0].clientX},{passive:true});
  memoryViewer.addEventListener('touchend',event=>{
    const distance=event.changedTouches[0].clientX-touchStartX;
    if(Math.abs(distance)>45)showMemory(activeMemory+(distance<0?1:-1));
  },{passive:true});
}

const musicButton=document.getElementById('musicButton');
if(musicButton){
  const audio=new Audio('musik/nabila12.mp3');
  audio.loop=true;
  audio.volume=.18;
  audio.preload='auto';
  const savedPosition=sessionStorage.getItem('nabilaMusicPosition');
  if(savedPosition)audio.currentTime=Number(savedPosition)||0;
  const label=musicButton.querySelector('[data-music-label]');
  const hint=document.getElementById('musicHint');
  let musicPlaying=false;
  function showHint(text){
    hint.textContent=text;
    hint.classList.add('show');
    clearTimeout(showHint.timer);
    showHint.timer=setTimeout(()=>hint.classList.remove('show'),2600);
  }
  async function startMusic(showError=false){
    try{
      await audio.play();
      musicPlaying=true;
      label.textContent='Musik menyala';
    }catch(error){
      label.textContent='Sentuh untuk musik';
      if(showError)showHint(audio.error?'File musik tidak dapat dimuat':'Sentuh sekali lagi untuk memutar musik');
    }
  }
  function stopMusic(){
    audio.pause();
    musicPlaying=false;
    label.textContent='Putar musik';
  }
  audio.addEventListener('play',()=>{musicPlaying=true;label.textContent='Musik menyala'});
  audio.addEventListener('pause',()=>{musicPlaying=false;label.textContent='Putar musik'});
  audio.addEventListener('timeupdate',()=>{if(musicPlaying)sessionStorage.setItem('nabilaMusicPosition',String(audio.currentTime))});
  audio.addEventListener('error',()=>{label.textContent='Musik tidak tersedia';showHint('File musik tidak dapat dimuat')});
  musicButton.addEventListener('click',()=>musicPlaying?stopMusic():startMusic(true));
  document.addEventListener('pointerdown',event=>{
    if(!event.target.closest('#musicButton')&&!musicPlaying)startMusic(true);
  },{once:true,passive:true});
  document.addEventListener('keydown',event=>{
    if(!event.target.closest('#musicButton')&&!musicPlaying)startMusic(true);
  },{once:true});
  startMusic();
}
