
/*const settingDiv = document.querySelector('.for-settings')
const forCoordinate = document.querySelector('.for-coordinate')
const quer_y = document.querySelector('.for-userProfile')
const quer_yProps = document.querySelectorAll('.profile-props')
const quer_yInput = document.querySelectorAll('.user-details')
const arrowIcon = document.querySelector('#arrow');

const SIDE_BAR = document.querySelector('aside')

SIDE_BAR.addEventListener('click', (e) => {
  e.stopPropagation();
});

const navigation_icon = document.querySelector('.hamburger')
navigation_icon.addEventListener('click',(e)=>{
  e.stopPropagation()
  SIDE_BAR.classList.add('show-short');
  if (shortBarElement) {
    shortBarElement.classList.remove('show-short');
  }
})



window.addEventListener('click',()=>{
  SIDE_BAR.classList.remove('show-short');
  shortBarElement.classList.remove('show-short');
})


const buttons = document.querySelectorAll('.sidebar-item');
buttons.forEach((item)=>{
  item.addEventListener('click',()=>{
    const action = item.dataset.action;
    if(action==='close'){
      SIDE_BAR.classList.remove('show-short');
    }
    if (action==='settings') {
      settingDiv.classList.add('show')
    }
    if (action==='activate-btn') {
      forCoordinate.classList.add('open');
    }
    if (action==='profile') {
      quer_y.classList.add('run');
    }
      
    
    
  })
})

const shortBarElement = document.querySelector('.short-bar');

shortBarElement.addEventListener('click',(e)=>{
  e.stopPropagation();
})

const dotIcon = document.querySelector('.dot-icon');
dotIcon.addEventListener('click',(e)=>{
  e.stopPropagation();
  shortBarElement.classList.add('show-short');
  if (SIDE_BAR) {
    SIDE_BAR.classList.remove('show-short');
  }
})

const backIcon = document.querySelectorAll('.back-icon');
if (backIcon instanceof NodeList) {
  backIcon.forEach((one)=>{
    one.addEventListener('click',(e)=>{
      e.stopPropagation();
if(settingDiv){settingDiv.classList.remove('show');}
if(forCoordinate){forCoordinate.classList.remove('open');}
if (quer_y) {
  quer_y.classList.remove('run');
}
    })
  })
}

const elements =(name)=>document.querySelector(`#${name},.${name}`);
const myElement = ['theme','switch','ontapping','tap','check','check2','check4','notify'].map(elements);
const [theme,swiTch,ontapping, tap,check,check2,check4,notify] = myElement; 
myElement.forEach((element)=>{
  if(!element) return;
  element.addEventListener('click',(e)=>{
    e.stopPropagation();
    if (element===theme||element===swiTch) {
      document.body.style.setProperty('background','white');
      check.checked =true;
    }
    else if (element===ontapping||element===tap) {
      document.body.style.setProperty('background','black');
      check2.checked=true;
      quer_y.style.setProperty('background','black');
  quer_yProps.forEach(el=>{el.style.color='white'});
  quer_yInput.forEach(item=>{
    item.style.background = 'black';
    item.style.color = 'white';
  });
  arrowIcon.style.color = 'white';
    }
   if ((element===notify&& element===check4)&& check4) {
      check4.checked=true;
    }
  })
})
  

document.addEventListener('DOMContentLoaded',()=>{
  const panel = document.querySelector('.dot-icon');
const notifyCenter=document.querySelector('.number');

let count = Number(notifyCenter.textContent)||0;
function fname() {
  if (count>=11) {
    notifyCenter.textContent='11+'
  }
  else {
    notifyCenter.textContent=count;
  }
}
  panel.addEventListener('click',()=>{
    count++;
    fname();
  })
});

function percent(){
  const RRR = (R)=>document.querySelector(`#${R},.${R}`);
const riskPerTrade = ['rrr','rrr2'].map(RRR);
const [risk1,risk2]=riskPerTrade;
risk1.addEventListener('change',()=>{
  if (risk1.value!=='') {
    risk2.value='';
  }
})
risk2.addEventListener('change',()=>{
  if (risk2.value!=='') {
    risk1.value='';
  }
})
}
percent();

*/

// ====================== SELECT ELEMENTS ======================
const SIDE_BAR = document.querySelector('aside');
const shortBarElement = document.querySelector('.short-bar');
const settingDiv = document.querySelector('.for-settings');
const forCoordinate = document.querySelector('.for-coordinate');
const quer_y = document.querySelector('.for-userProfile');

const navigation_icon = document.querySelector('.hamburger');
const dotIcon = document.querySelector('.dot-icon');
const backIcon = document.querySelectorAll('.back-icon');
const buttons = document.querySelectorAll('.sidebar-item');

const quer_yProps = document.querySelectorAll('.profile-props');
const quer_yInput = document.querySelectorAll('.user-details');
const arrowIcon = document.querySelector('#arrow');

const check = document.querySelector('.check');
const check2 = document.querySelector('.check2');
const check4 = document.querySelector('.check4');

const theme = document.querySelector('#theme');
const ontapping = document.querySelector('#ontapping');
const notify = document.querySelector('#notify');
const swiTch = document.querySelector('.switch');
const tap = document.querySelector('.tap');
const notification = document.querySelector('.notification');

quer_yInput.forEach(element=>{
  element.addEventListener('focus',function(){
   setTimeout(()=>{
     element.scrollIntoView({
      behavior:"smooth",
      block:"center"
    })
   },1000);
  })
  })

quer_yInput.forEach(input=>{
  const inputValue = input.value.trim();
  const getInput = input.getAttribute("data-set");
  
  if(getInput==="name")input.placeholder = inputValue;
  if(getInput==="lastName")input.placeholder = inputValue;
  if(getInput==="email")input.placeholder=inputValue;
  if(getInput==="password")input.placeholder = inputValue;
  if(getInput==="number")input.placeholder = inputValue;
  if(getInput==="address")input.placeholder = inputValue;
})


// ====================== STOP CLICK FROM CLOSING MENUS ======================
SIDE_BAR.addEventListener('click', function(e) {
  e.stopPropagation();
});

shortBarElement.addEventListener('click', function(e) {
  e.stopPropagation();
});


// ====================== OPEN LEFT SIDEBAR (Hamburger) ======================
navigation_icon.addEventListener('click', function(e) {
  e.stopPropagation();
  SIDE_BAR.classList.add('show');
  shortBarElement.classList.remove('show-short');
});


// ====================== OPEN SHORT BAR (Three dots) ======================
dotIcon.addEventListener('click', function(e) {
  e.stopPropagation();
  shortBarElement.classList.add('show-short');
  SIDE_BAR.classList.remove('show');
});


// ====================== CLOSE BOTH MENUS WHEN CLICKING OUTSIDE ======================
window.addEventListener('click', function() {
  SIDE_BAR.classList.remove('show');
  shortBarElement.classList.remove('show-short');
});


// ====================== SIDEBAR BUTTONS ======================
buttons.forEach(function(item) {
  item.addEventListener('click', function() {
    const action = item.dataset.action;

    if (action === 'close') {
      SIDE_BAR.classList.remove('show');
    }

    if (action === 'settings') {
      settingDiv.classList.add('show');
    }

    if (action ==='activate-btn') {
      forCoordinate.classList.add('open');
    }

    if (action === 'profile') {
      quer_y.classList.add('run');
    }
  });
});


// ====================== BACK BUTTONS (Close panels) ======================
backIcon.forEach(function(one) {
  one.addEventListener('click', function(e) {
    e.stopPropagation();
    settingDiv.classList.remove('show');
    forCoordinate.classList.remove('open');
    quer_y.classList.remove('run');
  });
});


// ====================== THEME SWITCHING ======================
if (theme) {
  theme.addEventListener('click', function() {
    document.body.style.background = 'white';
    if (check) check.checked = true;
  });
}

if (swiTch) {
  swiTch.addEventListener('click', function() {
    document.body.style.background = 'white';
    if (check) check.checked = true;
  });
}

if (ontapping) {
  ontapping.addEventListener('click', function() {
    document.body.style.background = 'black';
    if (check2) check2.checked = true;

    if (arrowIcon) arrowIcon.style.color = 'white';
  });
}

if (tap) {
  tap.addEventListener('click', function() {
    document.body.style.background = 'black';
    if (check2) check2.checked = true;

    
    if (arrowIcon) arrowIcon.style.color = 'white';
  });
}


// ====================== NOTIFICATION COUNTER ======================
document.addEventListener('DOMContentLoaded', function() {
  const panel = document.querySelector('.dot-icon');
  const notifyCenter = document.querySelector('.number');

  let count = Number(notifyCenter.textContent) || 0;

  function updateCount() {
    if (count >= 11) {
      notifyCenter.textContent = '11+';
    } else {
      notifyCenter.textContent = count;
    }
  }

  panel.addEventListener('click', function() {
    count++;
    updateCount();
  });
});


// ====================== RRR SELECTS ======================
function percent() {
  const riskToRewardRatio = document.querySelector('#rrr');
  const riskToRewardRatio2 = document.querySelector('#rrr2');

  if (!riskToRewardRatio || !riskToRewardRatio2) return;

  riskToRewardRatio.addEventListener('change', function() {
    if (riskToRewardRatio.value !== '') {
      riskToRewardRatio2.value = '';
    }
  });

  riskToRewardRatio2.addEventListener('change', function() {
    if (riskToRewardRatio2.value !== '') {
      riskToRewardRatio.value = '';
    }
  });
}

percent();


console.log("hello world");

// Start a timer for 10 seconds (10000ms)
const timerOutput = setTimeout(() => {
  console.log("This will never print because we will stop it!");
}, 10000);

// PRINT THE VARIABLE TO THE SCREEN
console.log("WHAT IS INSIDE THE VARIABLE?:", timerOutput);


