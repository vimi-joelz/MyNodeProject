

const forgetPassword = document.getElementById("forget-password");
forgetPassword.addEventListener("click",async (e)=>{
 e.preventDefault();
 document.getElementById("pass").value="";
 const confirmed = confirm("are you willing to reset password");
 if(!confirmed) return;
 const promptedEmail = prompt("input your email");
 if(!promptedEmail)return;
 const promptedPassword = prompt("input new password");
 if(!promptedPassword) return;
 try {
  const res = await fetch("/reset",{
   method: "POST",
   headers: {
    "Content-Type":"application/json"
   },
   body: JSON.stringify({
    email: promptedEmail,
    password: promptedPassword
   })
  });
  const response = await res.json();
  alert(response.message);
  document.getElementById("submit").value = "login";
 } catch (error) {
  alert(error.message);
 }
})



const element = document.querySelector(".aside1");
element.addEventListener("click",(e)=>{
 e.stopPropagation();
})

window.addEventListener("click",()=>{
 element.classList.remove("open");
});

document.getElementById("hamburger").addEventListener("click",(e)=>{
 e.stopPropagation();
 element.classList.toggle("open");
})


const submitBtnElement = document.getElementById("submit");
const phoneNumberElement = document.getElementById("number");
const emailInputElement = document.getElementById("text");
const passwordElement = document.getElementById("pass");
const form = document.querySelector("form");
const textValidation = document.querySelectorAll(".text-message");




phoneNumberElement.addEventListener("input",()=>{textValidation[0].classList.remove("e");
                                                textValidation[0].textContent="";});
emailInputElement.addEventListener("input",()=>{textValidation[1].classList.remove("e");
                                               textValidation[1].textContent="";});
passwordElement.addEventListener("input",()=>{textValidation[2].classList.remove("e");
                                             textValidation[2].textContent="";});



form.addEventListener("submit",async(e)=>{
 e.preventDefault();
 let isValid = true;
 const phoneNumberRegEx = /^(?:\+234|0)\d{10}$/;
 const phoneNumberInput = phoneNumberElement.value.trim();
 const emailInput = emailInputElement.value.trim();
 const passwordinput = passwordElement.value.trim();

 if(phoneNumberInput===""){
  textValidation[0].classList.add("e");
  textValidation[0].textContent = "field can't be empty";
  isValid=false;
 }
 
else if(!phoneNumberRegEx.test(phoneNumberInput)){
  textValidation[0].classList.add("e");
  textValidation[0].textContent = "input a valid phone number";
  isValid=false;
 }

 const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 if(emailInput===""){
  textValidation[1].classList.add("e");
  textValidation[1].textContent="email is required";
isValid=false;
 }
else if(!emailRegEx.test(emailInput)){
  textValidation[1].classList.add("e");
  textValidation[1].textContent = "input a valid email";
isValid=false;
}

 const passwordRegEx = /^(?:[a-zA-Z]{3,}\d{3,}|\d{2,}[a-zA-Z]{3,})$/;
if(passwordinput===""){
 textValidation[2].classList.add("e");
 textValidation[2].textContent="please input a password";
 isValid=false;
}
 else if(!passwordRegEx.test(passwordinput)){
  textValidation[2].classList.add("e");
  textValidation[2].textContent="password must be 6 characters long";
isValid=false;
 };

 if(!isValid)return;
if(submitBtnElement.value==="sign in"){
 submitBtnElement.value="process..";
 submitBtnElement.disabled = true;
 try {
  const response = await fetch("/signUp",{
   method:"POST",
   headers:{
    "Content-Type":"application/json",
    "fezbot-app":"fezbot-API"
   },
   body:JSON.stringify({
    phoneNumber:phoneNumberInput,
    email:emailInput,
    password:passwordinput,
    date: new Date()
   })
  });
  const data = await response.json();
  alert(data.message||JSON.stringify(data.message));
  data.token?localStorage.setItem("token",data.token):"";
 frontView();
 } catch (error) {
  console.log(error);
 }
finally{
  submitBtnElement.value="sign in";
 submitBtnElement.disabled = false;
 }
}
 else if(submitBtnElement.value === "login"){
  submitBtnElement.value = "process..";
  submitBtnElement.disabled = true;
  try {
   const response = await fetch("/login",{
    method: "POST",
    headers: {
     "Content-Type":"application/json",
    },
    body: JSON.stringify({
     phoneNumber:phoneNumberInput,
    email:emailInput,
    password:passwordinput,
    date: new Date()
    })
   });
   const res = await response.json();
   alert(res.message||JSON.stringify(res.message));
   if(res.token)localStorage.setItem("token",res.token);
   frontView();
  } catch (error) {
   alert(error.message);
  }
  finally{
  submitBtnElement.value="login";
 submitBtnElement.disabled = false;
 }
  }
 
});
 
function frontView(){
const frontend = document.getElementById("frontend");
 if(frontend){
  frontend.style.display="none";
 }
document.getElementById("internals").style.display="block";
document.querySelector("body").style.background = "hwb(0 15% 85%)";
}




 const search_bar = document.querySelector(".search");
const rhymeList = document.getElementById("API-rhymes");
const rhymeMeaning = document.getElementById("Rhyme-meaning");
const textGraph = document.querySelector(".text-paragraph");
const shuffleBtn = document.querySelector(".shuffle");

const STATE = {
 words:[],
 page:0,
 size:10
}


search_bar.addEventListener("keydown", async (e)=>{
 if(e.key==="Enter"){
  e.preventDefault();
  await search_value();
 }
})

search_bar.addEventListener("search",async (e)=>{
  e.preventDefault();
 await search_value();
})

async function search_value(){
  try {
   
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    return;
  }
  // ... rest of the function
   
  const data = await fetch("/rhymeList",{
   method: "POST",
   headers: {
    "Content-Type":"application/json",
    "authorization":`Bearer ${localStorage.getItem("token")}`
   },
   body: JSON.stringify({
    value: search_bar.value.trim()
   })
  });
   /*if (!data.ok) {
    const response = await data.json();
    if (response.message.includes("jwt expired")) {
     alert("session timeout");
     localStorage.removeItem("token");
     document.getElementById("internals").style.display = "none";
     document.getElementById("frontend").style.display = "block";
     document.getElementById("submit").value = "login";
    }
    return;
   }*/
   if (!data.ok) {
  const response = await data.json().catch(() => ({}));
  alert(response.message || `Request failed (${data.status})`);

  if (
    response.message?.includes("jwt expired") ||
    response.message?.includes("authorization") ||
    response.message?.includes("unknown identifier")
  ) {
    localStorage.removeItem("token");
    document.getElementById("internals").style.display = "none";
    document.getElementById("frontend").style.display = "block";
    document.getElementById("submit").value = "login";
  }
  return;
   }
  const res = await data.json();
  STATE.words = res.map(r=>r.word);
   runCal();
 } catch (error) {
  alert(error.message);
  }
 }
 
 

 


function runCal(){
 rhymeList.innerHTML = "";
 const page = STATE.page;
 const size = STATE.size;
 const start = page * size;
 const end = start + size;
 const pageWord = STATE.words.slice(start,end);
 pageWord.forEach((word, index)=>{
  const paragraphElement = document.createElement("p");
  paragraphElement.className = "p-element";
  paragraphElement.style.color = "white";
  paragraphElement.textContent = word;
  
  paragraphElement.addEventListener("click", async ()=>{
   try {
    const result = await fetch("/wordMeaning",{
     method: "POST",
     headers: {
      "Content-Type":"application/json",
      "authorization":`Bearer ${localStorage.getItem("token")}`
     },
     body: JSON.stringify({
      value:word
     })
    });
    if (!result.ok) {
     const response = await result.json();
     if(response.message.includes("jwt expired")){
      localStorage.removeItem("token");
      document.getElementById("internals").style.display = "none";
     document.getElementById("frontend").style.display = "block";
     document.getElementById("submit").value = "login";
     }
     return;
    }
    const response = await result.json();
    textGraph.style.color = "white";
    textGraph.textContent = response;
   } catch (error) {
    alert(error.message);
   }
  });
  
  setTimeout(()=>{
   rhymeList.append(paragraphElement);
  },100 * index);
 });
 if(STATE.words.length > 0){
  shuffleBtn.style.display = "block";
 }
}

shuffleBtn.addEventListener("click",()=>{
 STATE.page++;
 if(STATE.page * STATE.size >= STATE.words.length){
  STATE.page = 0;
 }
 runCal();
})



const logOut = document.getElementById("log-out");

const internalPassword = document.getElementById("internal-pass");
const span = document.getElementById("hide/show");

internalPassword.value = passwordElement.value;
 span.onclick = () => {
  if(internalPassword.type==="password"){
   internalPassword.type = "text";
   span.textContent = "hide";
  }
  else{
   internalPassword.type = "password";
   span.textContent = "show";
  }
 }

logOut.addEventListener("click",()=>{
 localStorage.removeItem("token");
 document.getElementById("internals").style.display = "none";
 document.getElementById("frontend").style.setProperty("display","block");
 document.body.style.background = "cyan";
 const element = document.getElementById("submit");
 element.value = "login";
 element.disabled = false;
})

// Check if user is already logged in when the page loads
window.addEventListener("DOMContentLoaded", () => {
  /*const token = localStorage.getItem("token");

  if (token) {
    // User has a token → go straight to the internal page
    document.getElementById("frontend").style.display = "none";
    document.getElementById("internals").style.display = "block";
    document.body.style.background = "hwb(0 15% 85%)";
  }*/
});

   
  