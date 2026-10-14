import "dotenv/config";
import {createServer,IncomingMessage, ServerResponse} from "http";
import {Schema} from "./type.ts";
import fs from "fs";
import path from "path";
import process from "process";
import {fileURLToPath} from "url";
import jwt from "jsonwebtoken";
import pg from "pg";


const pool = new pg.Pool({
 connectionString: process.env.DATABASE_URL || undefined,
 ssl:process.env.DATABASE_URL?{rejectUnauthorized: false}:false
});

const SECRECY: string = process.env.SECRETKEY;
const PORT: string|number = process.env.PORT || 8080;

const HttpStat = {
 ok: 200,serverErr: 500, unknown_route: 404,AuthFailed: 401
} as const;

interface StaticFileMap{
 [key: string]: string;
}

//===initializing a middleware function===//

function logged<L extends () => void>(req: IncomingMessage,res: ServerResponse,next: L){
 console.log(">>>>",req.method,req.url);
 next();
}

function cors<L extends ()=>void>(req: IncomingMessage, res: ServerResponse, next: L):void{
 res.setHeader("ACCESS-CONTROL-ALLOW-Origin","http://localhost:8080");
 res.setHeader("ACCESS-CONTROL-ALLOW-Headers","Content-Type, Authorization, fezbot-app");
 res.setHeader("ACCESS-CONTROL-ALLOW-Methods","POST, OPTIONS, GET");
 if(req.method==="OPTIONS"){
  res.writeHead(HttpStat.ok,{
   "Content-Type":"application/json"
  });
  res.end();
  return;
 }
 next();
}

function checkAuth(req: IncomingMessage, res: ServerResponse):void{
 if(req.method==="POST"&&req.url==="/signUp"){
  if(req.headers["fezbot-app"]!=="fezbot-API"){
   res.writeHead(HttpStat.serverErr,{
    "Content-Type":"application/json"
   });
   res.end();
   return;
  }
  let body: any = "";
  req.on("data",(chunk)=>{
   body+=chunk.toString();
  });
  req.on("end",async()=>{
   try {
    const parseChunk = JSON.parse(body);
    const sign = new Schema();
   const signUp =  await sign.signData(parseChunk);
    res.writeHead(HttpStat.ok,{"Content-Type":"application/json"});
    res.end(signUp);
   } catch (error) {
    res.writeHead(HttpStat.unknown_route,{"Content-Type":"application/json"})
    res.end(JSON.stringify({message:error.message}));
   }
  })
 }

  
  else if(req.method==="POST"&&req.url==="/rhymeList"){
  const header = req.headers.authorization;
   if(!header){
     res.writeHead(HttpStat.AuthFailed,{"Content-Type":"application/json"})
   res.end(JSON.stringify({message:"authorization found missing"}));
     return;
   }
    const splitHeader: string[] = header.split(" ");
    if(splitHeader[0]!=="Bearer"){
     res.writeHead(HttpStat.AuthFailed,{"Content-Type":"application/json"});
     res.end(JSON.stringify({message:"unrecognized authorization status"}));
     return;
    }
   
   let body: any = "";
   req.on("data",(chunk)=>{
    body+=chunk.toString();
   });
   req.on("end", async ()=>{
    try {
     const check = jwt.verify(splitHeader[1],SECRECY);
      const collectionData = await pool.query(`SELECT * FROM user_data WHERE email=$1`,[check.email]);
       if(collectionData.rows.length===0){
        res.writeHead(HttpStat.unknown_route,{"Content-Type":"application/json"});
        res.end(JSON.stringify({message:"content no longer exist"}));
        return;
       };
      const DATA = collectionData.rows[0];
      if(DATA.email!==check.email){
       res.writeHead(HttpStat.AuthFailed,{"Content-Type":"application/json"});
       res.end(JSON.stringify({message:"unknown identifier"}));
       return;
      }
     const json = JSON.parse(body);
     const parseData = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(json.value?.trim())}&max=50`);
     const response = await parseData.json();
     res.writeHead(HttpStat.ok,{"Content-Type":"application/json"});
     res.write(JSON.stringify(response));
     res.end();
    } catch (error) {
     res.writeHead(HttpStat.serverErr,{"Content-Type":"application/json"});
     res.end(JSON.stringify({message:error.message}));
    }
   })
  }

   
   else if(req.method==="POST"&&req.url==="/wordMeaning"){
const header = req.headers.authorization;
    if(!header){
     res.writeHead(HttpStat.AuthFailed,{"Content-Type":"application/json"})
   res.end(JSON.stringify({message:"authorization found missing"}));
     return;
    }
    const splitHeader: string[] = header.split(" ");
    if(splitHeader[0]!=="Bearer"){
     res.writeHead(HttpStat.AuthFailed,{"Content-Type":"application/json"});
     res.end(JSON.stringify({message:"unrecognized authorization status"}));
     return;
    }

    
    let body: any = "";
    req.on("data",(word)=>{
     body+=word.toString();
    });
    req.on("end",async()=>{
     try {
       const check = jwt.verify(splitHeader[1],SECRECY);
      const collectionData = await pool.query(`SELECT * FROM user_data WHERE email=$1`,[check.email]);
       if(collectionData.rows.length===0){
        res.writeHead(HttpStat.unknown_route,{"Content-Type":"application/json"});
        res.end(JSON.stringify({message:"content no longer exist"}));
        return;
       };
      const DATA = collectionData.rows[0];
      if(DATA.email!==check.email){
       res.writeHead(HttpStat.AuthFailed,{"Content-Type":"application/json"});
       res.end(JSON.stringify({message:"unknown identifier"}));
       return;
      }
      
      const data = JSON.parse(body);
     const fetchData = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(data.value)}&md=d&max=1`);
      const response = await fetchData.json();
      const expression = response[0]?.defs?.[0] || "sorry we couldn't process your request";
      const value = expression.replace(/^[a-z]+\t/,"");
      res.writeHead(HttpStat.ok,{"Content-Type":"application/json"})
     res.end(JSON.stringify(value));
     } catch (error) {
      res.writeHead(HttpStat.unknown_route,{"Content-Type":"application/json"})
     res.end(JSON.stringify({message:error.message}));
     }
    })
   }

    
    else if(req.method==="POST"&&req.url==="/login"){
     let details: any="";
     req.on("data",(chunk)=>{details+=chunk.toString()});
     req.on("end",async()=>{
      try {
       const parseDetails = JSON.parse(details);
      if(!parseDetails) return;
      const scheme = await new Schema().logData(parseDetails);
      res.writeHead(HttpStat.ok,{"Content-Type":"application/json"});
       res.end(scheme);
      } catch (error) {
       res.writeHead(HttpStat.AuthFailed,{"Content-Type":"application/json"});
       res.end(JSON.stringify({message: error.message}));
      }
     })
    }

     else if (req.method==="POST"&&req.url==="/reset") {
      let details: any = "";
      req.on("data",(c)=>{
       details+=c.toString();
      });
      req.on("end",async ()=>{
       try {
        const parse = JSON.parse(details);
        const data = await new Schema().updatePassword(parse);
        res.writeHead(HttpStat.ok,{"Content-Type":"application/json"});
        res.end(data);
       } catch (error) {
        res.writeHead(HttpStat.serverErr,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message:error.message}));
       }
      })
     }
     
 else{
  res.writeHead(HttpStat.serverErr,{"Content-Type":"application/json"})
 res.end(JSON.stringify({message:"error at home page"}));
 }

}

function validateFilePath(req: IncomingMessage, res: ServerResponse): string|null{
let file = "";
 const webExtension: StaticFileMap = {
  ".html":"text/html",
  ".js":"text/javascript",
  ".css":"text/css"
 }
 const __folder = fileURLToPath(import.meta.url);
 try {
  const dirPath = path.dirname(__folder);
 if(req.url==="/"&&req.method==="GET")file="index.html";
  else file = req.url?.slice(1);
 const fileDir = path.join(dirPath,file);
 
  const base = path.basename(fileDir);
 const ext = path.extname(base);
  const map = webExtension[ext]||"text/plain";
  
  if(!path.resolve(fileDir).startsWith(dirPath)){
  console.log("you wanna hack me abi 😅");
   res.writeHead(HttpStat.unknown_route,{"Content-Type":map})
   res.end();
   return;
 }
  
  

fs.readFile(fileDir,(err: NodeJS.ErrnoException | null, data)=>{
  if(err){
   res.writeHead(HttpStat.serverErr,{"Content-Type":map})
   res.end(err.message)
   return;
  }
  res.writeHead(HttpStat.ok,{"Content-Type":map});
  res.end(data);
 })

 } catch (error) {
  const filePath = path.basename(__folder);
  const extname = path.extname(filePath);
  res.writeHead(HttpStat.serverErr,{"Content-Type":webExtension[extname]});
 res.write(error.message);
  res.end();
 return;
 }
 
}



const server = createServer((req,res)=>{
 logged(req,res,()=>{
  cors(req,res,()=>{
   if(req.method==="POST"){
    checkAuth(req,res);
    return;
   }
   if(req.method==="GET"){
    validateFilePath(req,res);
    return;
   }

   res.writeHead(HttpStat.serverErr,{"Content-Type":"application/json"})
   res.end(JSON.stringify({message:"error observe from localhost"}));
  })
 })
}).listen(PORT,()=>{
 console.log("server running at", PORT);
})