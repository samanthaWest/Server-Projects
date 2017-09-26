<html>

<script>
    // Reject and Catch
    // Should not assume asynchronus call success

    function outputA(){
        var randomTime = Math.floor(Math.random() * 3000) + 1;

        return new Promise(function(resolve,reject){
            setTimeout(function(){
                console.log("-");
                reject("outputA rejected!");
            }, randomTime);
        });
    }

    outputA()
    .then(function(data){
        console.log(data);
    })

    .catch(function(reason){
        console.log(reason);
    });
</script>
</html>