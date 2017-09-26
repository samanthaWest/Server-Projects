<html>
    <script>
    // Chaining Promises
    // Help reliably detect when an asynchronous 
    // block of code completes.

    function outputA(){

        var randomTime = Math.floor(Math.random() * 3000)+ 1;

        return new Promise(function(resolve,reject){
            setTimeout(function(){
                console.log("A");
                resolve("outputA() complete");
            }, randomTime);
        });
    }

    function outputB(msg){
        var randomTime = Math.floor(Math.random() * 3000)+ 1;

        return new Promise(function(resolve,reject){
            setTimeout(function(){
                console.log("B");
                resolve("outputB() complete");}, randomTime);
            });
    }

    // output "C" after a random time between 0 & 3 seconds
function outputC(msg){
    // NOTE: msg holds the 'resolve' message from the 
    // previous function in the chain
    var randomTime = Math.floor(Math.random() * 3000) + 1;

    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("C");
            resolve("outputA() complete");
        },randomTime);
    });   
}

// invoke the functions in order

outputA()
.then(outputB)
.then(outputC)
.catch(function(rejectMsg){
    // catch any errors here
    console.log(rejectMsg);
});
    </script>
</html>