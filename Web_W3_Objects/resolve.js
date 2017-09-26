<html>

<script>
    function outputA(){
        var randomTime = Math.floor(Math.random() * 3000) + 1;

        return new Promise(function(resolve,reject){ // pacing code inside a promise function
            setTimeout(function(){
                console.log("A");
                resolve(); // call resolve when function completed successfully
            }, randomTime);
        });
    }

    outputA().then(function(){
        console.log("outputA resolved!");
    });

</script>
</html>