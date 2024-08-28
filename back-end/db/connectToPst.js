import pkg from 'pg';
const { Pool } = pkg;  




const pool = new Pool({
  host: "localhost",
  user: "postgres", 
  password: "root",
  database: "chat", 
  port: 5432, 
});

pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


export default pool