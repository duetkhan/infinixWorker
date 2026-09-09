(function(){

    if(
        !localStorage.getItem("worker_balance")
    ){

        localStorage.setItem(
            "worker_balance",
            "0.00"
        );

    }


    if(
        !localStorage.getItem("worker_username")
    ){

        localStorage.setItem(
            "worker_username",
            "Guest User"
        );

    }

})();
