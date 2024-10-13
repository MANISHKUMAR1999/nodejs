
const http = require('http')
const fs = require('fs')

const server = http.createServer((req,res)=>{
    let filePath = `${__dirname}/index.html`

    if(req.url == '/' || req.url == '/about'){
        console.log(req.url.split("/"))
        let path = req.url.split("/")[1].toUpperCase()
        path = path == '' ? 'App running on home page' : 'App running on about page'
        fs.readFile(filePath,'utf-8',(err,data)=>{
            if(err){
                throw new Error("Not found anyhting")
            }
            else{
                data = data.replace("[path]",path)
                res.end(data)
            }
    
        })
    }

    else{
        res.end(JSON.stringify({message:"Url not found"}))
    }


  
   // console.log(filePath)
    

})

server.listen(3000,()=>{
    console.log("server started")
})