<html>
<head></head>
<body> 
</body>

<script>
// Creating Objects (Object Literal)
var Architect = {
    name: "Joe",
    age: 34,
    occupation: "Architect",
    setAge: function(newAge){
        this.age = newAge; },
    setName: function(newName){
        this.name = newName; }
};

// Object.create()
// method which creates a new obj with the specified protoype obj properties
// Object.create(proto[, propertiesObject])
// Creates classifcal inheritance, single inheritence is all javascript supports
// Will inherite data from base object
var architect1 = Object.create(Architect);
var architect2 = Object.create(Architect);

// Creating Objects (Function Closures)
// A closure is created whenever a func returns another func
// Combo of a func & the lexical env from within func declared
//Function nested within another func will use scope of 
// the containting func which means it has acces too the 
// local variables of the function in which it was defined.

function counter(){
    var localCounter =0; // private variable outside this func scope


// executed within scope so it can access localCounter
return function() { // anon function
    localCounter++;
    return localCounter;
};
}

// call counter func and get reference to the new func
var count = counter(); // global scope

// Recreating architect obj with this encapsulation idea ..

function architect(setName,setAge){
    var name = setName;
    var age = setAge;
    var occupation = "architect";
    return {
        setName: function(newName){ name = newName},
        setAge: function(newAge) { age = newAge},
        getName: function() { return name },
        getAge: function() {return age }
    }
}

// Initialize local variables through setters, can be considered a constructor
// If we try to access them directly we will get an error, must access through getters
var architect3 = architect("Sam",23);
var architect4 = architect("Carol", 18);

// Creating Ojects (Function Constructor)
// specify instances of each new obj will be created following a specific pattern
// Use methods when creating obj prototypes therefore objects will be independent and un changed of each other

function teacher(setName,setAge){
    this.name = setName;
    this.age = setAge;
    this.occupation = "teacher";
}

// describe methods for origonal prototype to access later
teacher.prototype.setname = function(newName) {this.name = newName };
teacher.prototype.setAge = function(newAge) { this.age = newAge };
teacher.prototype.getName = function() { return this.name };
teacher.prototype.getAge = function() { return this.age };

var teacher1 = new teacher("Joe", 34);
var teacher2 = new teacher("Mary", 55);

// This keyword
// This always points to current object invokng the method
// If we want to use object this in a nested function

teacher.prototype.outputName = function() {
    var that = this;
    setTimeout(function() {
        console.log(that.name); // use anon func to grab name of this for param 1
    }, 1000);
};

// Prototypal Inheritance
// new obj will inherit all methods and instance vars

teacher.prototype.newMethod = function() {
    return "Hello: " + this.name;
};

// Var vs Let vs Const
// ES6 intoduced let and const keywords
// Var - declares variable, scope depends where declared
// Let - block scope, limited to the block statement or expression used 
// Const - declares immutable block scope limited to scop it is used and cannot be redclared or assigned

// Error / Exception Handling
// isNaN() function

let x = "twenty";
let y = parseInt(x);

if(isNan(y)){
    console.log("x cannot be convered to a number");
} else {
    console.log("Success!");
}

// Similarly can use isFinite func to check for division by zero

let s = 30, t = 0;
let z = s / t;

if(isFinite(z)){
    console.log("success ")
}

// Although these funcs are useful they are not sophisticated 
// enough to ensure program won't break
// Instead throw an error to prevent program crash

const PI = 3.14519

try{
    PI = 99;
} catch(ex) {
    console.log("uh oh no work");
}

// also use error.message & error.stack to gain
// further insight on errors

const err = new Error('The message');
console.error(err.message);

// Throw our own errors

function divide(x,y){
    if(y ==0){
        throw new Error("Division by zero");
    }
    return x/y;
}

let a =3, b = 0, c;

try {
    c = divide(a,b);
} catch(ex) {
    console.log("uh oh erorr" + ex.message);
    c = NaN;
}

// Asynchronus javascript code has been used so far, it
// does not stop the main thread from working while executing
// other code blocks. 



</script>
</html>