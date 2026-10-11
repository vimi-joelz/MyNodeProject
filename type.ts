import {z} from "zod";
import {randomBytes,scrypt,timingSafeEqual} from "crypto";
import pg from "pg";
import {promisify} from "util";
import {Buffer} from "buffer";
import jwt from "jsonwebtoken";
import {pipeline} from "stream/promises";
import process from "process";

const pool = new pg.Pool({
 connectionString: process.env.DATABASE_URL||undefined,
 ssl: process.env.DATABASE_URL?{rejectUnauthorized: false}:false
})


const SECRECY: string = process.env.SECRETKEY;

interface UserData{
 phoneNumber: string;
 email: string;
 password: string;
 date: string;
}

const insertData = `INSERT INTO user_data(phone_number,email, password,acc_date) VALUES($1,$2,$3,$4) RETURNING *`;

const randomNess = promisify(randomBytes);
const scrypting = promisify(scrypt);

class Schema{
 private user_object = z.object({
  phoneNumber: z.string(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string(),
  date: z.coerce.date()
 })
 
public async signData(data: UserData): Promise<string>{
 try {
  const result = this.user_object.safeParse(data);
 if(!result.success){
  const credentials: string = "check your credentials and try again";
 return JSON.stringify({message:credentials});
 }
 const info = result.data;
const salt = await randomNess(16) as Buffer;
 const encode = await scrypting(info.password,salt,32) as Buffer;
const passwordInHash = `${salt.toString("base64")}:${encode.toString("base64")}`;
const UserDetails: Required<UserData> = {
 phoneNumber:info.phoneNumber,
 email:info.email,
 password: passwordInHash,
 date: info.date
}

const token = jwt.sign({ email: UserDetails.email},SECRECY,{expiresIn:"2h"})
  
 await pool.query(insertData,[UserDetails.phoneNumber,UserDetails.email,UserDetails.password,UserDetails.date]);
 return JSON.stringify({message:"sign up successfully",token});
 } catch (error) {
  console.log(error.message);
  return JSON.stringify({message:error.message});
 }

}

  

 public async logData(data: UserData): Promise<string>{
  try {
   const res = await pool.query(`SELECT email,password FROM user_data WHERE email = $1`,[data.email]);
  const table  = res.rows;
  if(table.length<1){
   const notFound = "error user not found";
   return JSON.stringify({message:notFound});
  }

  const ROWS = table[0];
 const Email = ROWS.email;
  const [saltHash,baseHash] = ROWS.password.split(":");
  if(!saltHash||!baseHash) return JSON.stringify({message:"credentials not found"});
  const salt = Buffer.from(saltHash,"base64") as Buffer;
  const hashScrypt = Buffer.from(baseHash,"base64") as Buffer;
 
  const scryptPassword = await scrypting(data.password,salt,32);
  if(hashScrypt.length!==scryptPassword.length) return "incorrect password or email";
  const evaluate = timingSafeEqual(scryptPassword,hashScrypt);
  if(!evaluate)return JSON.stringify({message:"incorrect password or email"});
  const jwt_token = jwt.sign({email:ROWS.email},SECRECY,{expiresIn:"2h"})
  const message = JSON.stringify({message:"login successfully",token:jwt_token});
 return message;
  } catch (error) {
   console.log(error.message);
   return JSON.stringify({message:error.message});
  }
 };

 public async updatePassword (data: Pick<UserData,"email"|"password">): Promise<string>{
  try {
   const salt = await randomNess(16) as Buffer;
   const encrypt = await scrypting(data.password,salt,32) as Buffer;
   const hashPassword = `${salt.toString("base64")}:${encrypt.toString("base64")}`;
   const newDetails = {
    email: data.email,
    password: hashPassword
   }
   const getDbData = await pool.query('UPDATE user_data SET password = $1 WHERE email = $2',[newDetails.password,newDetails.email]);
   return JSON.stringify({message:"now input your new password !"});
  } catch (error) {
   console.log(error.message);
   return JSON.stringify({message:error.message})
  }
  
 }
}

export {Schema};


console.log("hello world");