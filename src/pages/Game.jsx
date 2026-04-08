import { useEffect, useRef, useState } from 'react';
import './Game.css';

const COLS=8,ROWS=4,EW=36,EH=30,BS=10,ES=5,PS=5;

function createEnemies(){
  const e=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
    e.push({col:c,row:r,alive:true,diving:false,diveX:0,diveY:0,diveVX:0,diveVY:0,diveAngle:0,returnHome:false,
      type:r===0?'boss':r<=1?'butterfly':'bee'});
  return e;
}

export default function Game(){
  const canvasRef=useRef(null);
  const [gameState,setGameState]=useState('idle');
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(3);
  const levelRef=useRef(1);
  const scoreRef=useRef(0);
  const startGame=()=>{levelRef.current=1;scoreRef.current=0;setScore(0);setLives(3);setGameState('playing');};
  useEffect(()=>{
    if(gameState!=='playing') return;
    const canvas=canvasRef.current;
    const ctx=canvas.getContext('2d');
    const W=canvas.width,H=canvas.height;
    const state={
      px:W/2,py:H-60,bullets:[],ebullets:[],enemies:createEnemies(),explosions:[],
      stars:Array.from({length:80},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.5,sp:Math.random()*1.5+.5})),
      score:scoreRef.current,lives:3,level:levelRef.current,fx:W/2,fy:80,fdx:1,
      shootT:0,diveT:0,inv:0,fireT:0,touchX:null,running:true
    };
    const onTS=e=>{e.preventDefault();const t=e.touches[0];const rc=canvas.getBoundingClientRect();state.touchX=(t.clientX-rc.left)*(W/rc.width);};
    const onTM=e=>{e.preventDefault();const t=e.touches[0];const rc=canvas.getBoundingClientRect();state.touchX=(t.clientX-rc.left)*(W/rc.width);};
    const onTE=e=>{e.preventDefault();state.touchX=null;};
    const keys={};
    const onKD=e=>{keys[e.key]=true;};
    const onKU=e=>{keys[e.key]=false;};
    canvas.addEventListener('touchstart',onTS,{passive:false});
    canvas.addEventListener('touchmove',onTM,{passive:false});
    canvas.addEventListener('touchend',onTE,{passive:false});
    window.addEventListener('keydown',onKD);
    window.addEventListener('keyup',onKU);
    function getPos(en){const tw=COLS*(EW+10),sx=state.fx-tw/2;return{x:sx+en.col*(EW+10)+EW/2,y:state.fy+en.row*(EH+12)+EH/2};}
    function drawEnemy(x,y,type,angle){
      const colors={boss:'#ff4444',butterfly:'#44aaff',bee:'#ffdd44'};
      const col=colors[type],r=EW/2;
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);
      ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(0,0,r*.5,r*.7,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=col+'99';
      ctx.beginPath();ctx.ellipse(-r*.7,-r*.2,r*.5,r*.3,-0.3,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(r*.7,-r*.2,r*.5,r*.3,0.3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-r*.15,-r*.2,r*.12,0,Math.PI*2);ctx.arc(r*.15,-r*.2,r*.12,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    function drawPlayer(x,y,blink){
      if(blink)return;
      ctx.save();ctx.translate(x,y);
      const fh=8+Math.sin(Date.now()/80)*4;
      ctx.fillStyle='#ff6600';ctx.beginPath();ctx.moveTo(-5,14);ctx.lineTo(5,14);ctx.lineTo(0,14+fh);ctx.fill();
      ctx.fillStyle='#00ccff';ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(12,8);ctx.lineTo(8,14);ctx.lineTo(-8,14);ctx.lineTo(-12,8);ctx.closePath();ctx.fill();
      ctx.fillStyle='#aaeeff';ctx.beginPath();ctx.ellipse(0,-4,5,8,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#0088cc';
      ctx.beginPath();ctx.moveTo(-12,8);ctx.lineTo(-22,14);ctx.lineTo(-14,14);ctx.lineTo(-8,6);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(12,8);ctx.lineTo(22,14);ctx.lineTo(14,14);ctx.lineTo(8,6);ctx.closePath();ctx.fill();
      ctx.restore();
    }
    function spawnDiver(){
      const alive=state.enemies.filter(e=>e.alive&&!e.diving);if(!alive.length)return;
      const en=alive[Math.floor(Math.random()*alive.length)];const p=getPos(en);
      en.diving=true;en.diveX=p.x;en.diveY=p.y;
      const dx=state.px-p.x,dy=H-p.y,dist=Math.sqrt(dx*dx+dy*dy),sp=3+state.level*.5;
      en.diveVX=(dx/dist)*sp;en.diveVY=(dy/dist)*sp;en.diveAngle=0;en.returnHome=false;
    }
    let animId;
    function loop(){
      if(!state.running)return;
      state.stars.forEach(s=>{s.y+=s.sp;if(s.y>H){s.y=0;s.x=Math.random()*W;}});
      if(state.touchX!==null){const dx=state.touchX-state.px;if(Math.abs(dx)>2)state.px+=Math.sign(dx)*Math.min(Math.abs(dx)*.15,PS*2);}
      if(keys['ArrowLeft']||keys['a'])state.px-=PS;
      if(keys['ArrowRight']||keys['d'])state.px+=PS;
      state.px=Math.max(20,Math.min(W-20,state.px));
      state.fireT++;if(state.fireT>=15){state.bullets.push({x:state.px,y:state.py-20,vy:-BS});state.fireT=0;}
      if(!state.enemies.some(e=>e.alive)){state.running=false;scoreRef.current=state.score;levelRef.current++;setScore(state.score);setGameState('clear');return;}
      state.fx+=state.fdx*(1+state.level*.3);
      const tw=COLS*(EW+10);if(state.fx-tw/2<20||state.fx+tw/2>W-20)state.fdx*=-1;
      state.diveT++;if(state.diveT>Math.max(80-state.level*10,30)){spawnDiver();state.diveT=0;}
      state.shootT++;if(state.shootT>Math.max(90-state.level*8,35)){
        const alive=state.enemies.filter(e=>e.alive);
        if(alive.length){const s=alive[Math.floor(Math.random()*alive.length)];const p=s.diving?{x:s.diveX,y:s.diveY}:getPos(s);state.ebullets.push({x:p.x,y:p.y,vy:ES+state.level*.5});}
        state.shootT=0;
      }
      state.enemies.forEach(en=>{
        if(!en.alive||!en.diving)return;
        if(!en.returnHome){
          en.diveX+=en.diveVX;en.diveY+=en.diveVY;en.diveAngle+=.1;
          if(en.diveY>H+40){en.returnHome=true;return;}
          if(state.inv<=0){const dx=en.diveX-state.px,dy=en.diveY-state.py;
            if(Math.sqrt(dx*dx+dy*dy)<22){state.lives--;state.inv=120;state.explosions.push({x:state.px,y:state.py,r:5,a:1});
              if(state.lives<=0){state.running=false;scoreRef.current=state.score;setScore(state.score);setGameState('gameover');}}}
        }else{
          const h=getPos(en);const dx=h.x-en.diveX,dy=h.y-en.diveY;const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<5){en.diving=false;en.returnHome=false;}
          else{const sp=4+state.level*.5;en.diveX+=(dx/dist)*sp;en.diveY+=(dy/dist)*sp;}
        }
      });
      state.bullets=state.bullets.filter(b=>b.y>0);state.bullets.forEach(b=>{b.y+=b.vy;});
      state.ebullets=state.ebullets.filter(b=>b.y<H+10);state.ebullets.forEach(b=>{b.y+=b.vy;});
      state.bullets.forEach(b=>{state.enemies.forEach(en=>{
        if(!en.alive)return;const p=en.diving?{x:en.diveX,y:en.diveY}:getPos(en);
        if(Math.abs(b.x-p.x)<EW/2&&Math.abs(b.y-p.y)<EH/2){en.alive=false;b.y=-999;state.score+=en.type==='boss'?400:en.type==='butterfly'?160:80;state.explosions.push({x:p.x,y:p.y,r:5,a:1});}
      });});
      if(state.inv<=0){state.ebullets.forEach(b=>{
        if(Math.abs(b.x-state.px)<14&&Math.abs(b.y-state.py)<18){b.y=H+999;state.lives--;state.inv=120;state.explosions.push({x:state.px,y:state.py,r:5,a:1});
          if(state.lives<=0){state.running=false;scoreRef.current=state.score;setScore(state.score);setGameState('gameover');}}
      });}
      if(state.inv>0)state.inv--;
      state.explosions=state.explosions.filter(e=>e.a>0);state.explosions.forEach(e=>{e.r+=2;e.a-=.05;});
      ctx.fillStyle='#000010';ctx.fillRect(0,0,W,H);
      state.stars.forEach(s=>{ctx.fillStyle=`rgba(255,255,255,${.3+s.r*.2})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
      state.enemies.forEach(en=>{if(!en.alive)return;const p=en.diving?{x:en.diveX,y:en.diveY}:getPos(en);drawEnemy(p.x,p.y,en.type,en.diving&&!en.returnHome?en.diveAngle:0);});
      drawPlayer(state.px,state.py,state.inv>0&&Math.floor(state.inv/8)%2===1);
      state.bullets.forEach(b=>{const g=ctx.createLinearGradient(b.x,b.y,b.x,b.y-16);g.addColorStop(0,'#00ffff');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(b.x-2,b.y-16,4,16);});
      state.ebullets.forEach(b=>{ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(b.x,b.y,3,0,Math.PI*2);ctx.fill();});
      state.explosions.forEach(e=>{ctx.strokeStyle=`rgba(255,150,0,${e.a})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.stroke();});
      ctx.fillStyle='#fff';ctx.font='bold 16px monospace';
      ctx.textAlign='left';ctx.fillText(`SCORE: ${state.score}`,10,24);
      ctx.textAlign='right';ctx.fillText(`LV ${state.level}`,W-10,24);
      for(let i=0;i<state.lives;i++){ctx.fillStyle='#00ccff';ctx.beginPath();ctx.moveTo(10+i*22,H-8);ctx.lineTo(20+i*22,H-8);ctx.lineTo(15+i*22,H-18);ctx.closePath();ctx.fill();}
      setScore(state.score);setLives(state.lives);
      animId=requestAnimationFrame(loop);
    }
    animId=requestAnimationFrame(loop);
    return()=>{state.running=false;cancelAnimationFrame(animId);canvas.removeEventListener('touchstart',onTS);canvas.removeEventListener('touchmove',onTM);canvas.removeEventListener('touchend',onTE);window.removeEventListener('keydown',onKD);window.removeEventListener('keyup',onKU);};
  },[gameState]);
  useEffect(()=>{if(gameState==='clear'){const t=setTimeout(()=>setGameState('playing'),2000);return()=>clearTimeout(t);}},[gameState]);
  return(
    <div className="game-wrapper"><div className="game-container">
      <canvas ref={canvasRef} width={360} height={640} className="game-canvas" />
      {gameState==='idle'&&(<div className="game-overlay"><h1 className="game-title">GALAGA</h1><p className="game-subtitle">우주 방어전</p><div className="game-instructions"><p>📱 터치로 이동 | 자동 발사</p><p>⌨️ ← → 이동</p></div><button className="game-btn" onClick={startGame}>START</button></div>)}
      {gameState==='gameover'&&(<div className="game-overlay"><h2 className="game-title" style={{color:'#ff4444'}}>GAME OVER</h2><p className="score-display">SCORE: {score}</p><button className="game-btn" onClick={startGame}>RETRY</button></div>)}
      {gameState==='clear'&&(<div className="game-overlay"><h2 className="game-title" style={{color:'#ffdd44'}}>STAGE CLEAR!</h2><p className="score-display">SCORE: {score}</p><p style={{color:'#aaa',marginTop:8}}>다음 스테이지...</p></div>)}
    </div></div>
  );
}
