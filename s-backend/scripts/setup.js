const fs=require('node:fs');
const path=require('node:path');
const {randomBytes}=require('node:crypto');
const destination=path.join(__dirname,'../.env');
if(fs.existsSync(destination)){
 console.log('.env already exists; unchanged. Ensure JWT_SECRET has at least 32 characters.');
}else{
 fs.writeFileSync(destination,`PORT=5000\nMONGO_URI=mongodb://127.0.0.1:27017/studentportal\nJWT_SECRET=${randomBytes(48).toString('hex')}\nCLIENT_ORIGIN=http://localhost:5173\n`,{mode:0o600});
 console.log('.env created with a random JWT secret. Start MongoDB, seed accounts if needed, then npm start.');
}
