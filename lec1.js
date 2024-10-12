//console.log(9-3)
//console.log(process) // gives information about the current process
//console.log(process.argv)

// let sum1 = process.argv[2]
// let sum2 = process.argv[3]
// console.log(Number(sum1) + Number(sum2));

// process.stdout.write("helllo process") // same as console.log but the main diff the console.log comes to next line but this is start with the smae line
// process.stdout.write("helllo process1")

//process.exit(0) // 0 means successfull exit and 1 means exist with some error.

// console.log(__dirname); // gives the directory name of the particular script file
// console.log(__filename) // gives the path of the particular script file

const addFun = require('./calFun')


let result = addFun.add(4,5)
let result2 = addFun.multiply(9,5)
console.log(result)
console.log(result2)
//console.log(addFun)