<html>

<script>
    // Adding data, we are able to resolve promise
    // when task completed we then execute another func
    // using returned promise. Pass data from first func
    // too the then method. 

    function outputA(){
        var randomTime = Math.floor(Math.random() * 3000) + 1;

        return new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log("A");
                resolve("outputA resolved!");

            }, randomTime);

            
        });
        
    }

    outputA().then(function*(data){
        console.log(data);
    })
</script>
</html>