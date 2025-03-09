const mysql = require('mysql2'); // Changed from 'mysql' to 'mysql2'
const config = require('./config_sql');

const db = mysql.createConnection({ // Changed createConnection
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

//register the complaint to the block 
function registercomplaint(values,callback)
{
  sql = ' update block set complaints= ? where block_no = ? and room_no= ?';
  console.log();
  db.query(sql,values,(err,results)=>
  {
      if (err)
      {
          console.log(err);
      }
    callback(err,results);
  })
}

//function to calculate total number of owners
function totalowner(callback)
{
    sql = 'SELECT COUNT(owner_id) FROM owner';
    db.query(sql,(err,results)=>
    {
        callback(err,results);
    })
}

//get all the data from the table using table name
function getdata(tablename,callback)
{
    sql = 'select * from '+tablename+';';
    db.query(sql,(err,results)=>
    {
        callback(err,results);
    })
}


//add an owner tuple to the table
function createowner(values,callback)
{
    sql = 'insert into owner values(?,?,?,?,?,?)';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}
//function to create an owner
function createownerproof(values,callback)
{
    sql = 'insert into identity values(?,?,null);';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}



//book a parking slot for the tenant
function bookslot(values,callback)
{
    sql = 'update room set parking_slot =  ? where room_no = ?';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}



//view all the complaints
function viewcomplaints(callback)
{
    sql = 'select * from oo;';
    db.query(sql,(err,results)=>
    {
        callback(err,results);
    })
}




//view only owner complaints
//dbms yuvarraj
function ownercomplaints(ownerid,callback)
{
    sql = 'select complaints,room_no from block where room_no in (select room_no from owner where owner_id in(select id from auth where user_id=?))';
    db.query(sql,ownerid,(err,results)=>
    {
        callback(err,results);
    })
}



//get the total no of tenants
function totaltenant(callback)
{
    sql = 'SELECT COUNT(tenant_id) FROM tenant';
    db.query(sql,(err,results)=>
    {
        callback(err,results);
    })
}
//get the total number of employees
function totalemployee(callback)
{
    sql = 'SELECT COUNT(emp_id) FROM employee';
    db.query(sql,(err,results)=>
    {
        callback(err,results);
    })
}
//function to retrieve all the complaints in the block
function totalcomplaint(callback)
{
    sql = 'SELECT COUNT(complaints) FROM block';
    db.query(sql,(err,results)=>
    {
        callback(err,results);
    })
}
//get the data of tenent
function gettenantdata(tid,callback)
{
    sql = 'select * from tenant where tenant_id in (select id from auth where user_id=?)';
    db.query(sql,tid,(err,results)=>
    {
        callback(err,results);
    })
}




//creating an tenant id
function createtenant(values,callback)
{
    sql = 'insert into tenant values(?,?,?,null,?,?)';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}
//creating an proof for tenant
function createtenantproof(values,callback)
{
    sql = 'insert into identity values(?,null,?)';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}
function createuserid(values,callback)
{
    sql = 'insert into auth values(?,?,?)';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}


//owner viewing tenant details
function ownertenantdetails(values,callback)
{
    sql = 'select * from tenant where room_no in (select room_no from owner where owner_id in(select id from auth where user_id=?))';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}

//tenant pays maintanence fee
function paymaintanence(id,callback)
{
    sql = 'update tenant set stat="paid" where tenant_id in (select id from auth where user_id=?)';
    db.query(sql,id,(err,results)=>
    {
        callback(err,results);
    })
}

//owner viewing room owned by him
function ownerroomdetails(values,callback)
{
    sql = 'select * from room where room_no in (select room_no from owner where owner_id in(select id from auth where user_id=?))';
    db.query(sql,values,(err,results)=>
    {
        callback(err,results);
    })
}
//view parking alloted for tenant
function viewparking(id,callback)
{
    sql = 'select parking_slot from room where room_no in (select room_no from tenant where tenant_id in (select id from auth where user_id=?))';
    db.query(sql,id,(err,results)=>
    {
        callback(err,results);
    })
}


//employee salary get 
function empsalary(id,callback)
{
    sql = 'select salary from employee where emp_id in (select id from auth where user_id=?)';
    db.query(sql,id,(err,results)=>
    {
        callback(err,results);
    })
}



//function to validate user with username and password
function authoriseuser(username,password,callback)
{
    let results;
    sql = 'SELECT password from auth where user_id = ?';
    const value = [username];
    console.log(value);
    db.query(sql,value,(err,result)=>
    {
        if(result.length===0)
        {
            results = "denied";
            callback(err,results);
            return;
        }
        else
        {
        const  resultArray = Object.values(JSON.parse(JSON.stringify(result))[0])[0];
        if(password === resultArray)
        {
            results = "granted";
        }
        else
        {
            results = "denied";
        }
        callback(err,results);
    }

    })
}


module.exports = { 
    registercomplaint,
    createowner,
    bookslot,
    getdata,
    totalowner,
    totaltenant,
    totalemployee,
    totalcomplaint,
    createownerproof,
    viewcomplaints,
    authoriseuser,
    gettenantdata,
    createtenant,
    createtenantproof,
    ownerroomdetails,
    ownercomplaints,
    viewparking,
    createuserid,
    paymaintanence,
    empsalary,
    ownerroomdetails,
    ownertenantdetails
}