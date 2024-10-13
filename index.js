const fs = require('fs')
const os = require('os')
//console.log(fs)
console.log(__dirname+"/abc.txt")
const data = fs.writeFileSync(__dirname + "/abc.txt","hello how are you")
console.log(data);

// non blocking code

fs.writeFile(`${__dirname}/abcd.txt`,"hellow abcd how are you",(err)=>{
    if(err) throw err
    console.log("file has been saved")
})

//  blocking code
 let resposne = fs.readFileSync(__dirname + "/abc.txt",{encoding:"utf-8"})
 console.log(resposne)

 let resposne2 = fs.readFile(`${__dirname}/abcd.txt`,"utf-8",(err,data)=>{
    if(err) throw err
    console.log(data)

 })

 // delete the file

 fs.unlink(`${__dirname}/delete.txt`,()=>{

 })

 // append file

 fs.appendFile("abc.txt", "hello by \n cy",(err)=>{
    if(err) throw err
    console.log("done")

 })
// copy file from one txt to other
 fs.copyFile("abc.txt","copy.txt",()=>{

 })

 // create the directory
 fs.mkdir("hello/abc.js",{recursive:true},(err,path)=>{
    if(err) throw err
    console.log(path)

 })

 // delete the directory

//  fs.rmdir("hello",{recursive:true},()=>{

//  })

console.log(__dirname.split('\\'))

console.log(os.cpus().length)
console.log(os.arch())