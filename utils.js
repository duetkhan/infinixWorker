// Balance & Click Tracking
let balance = parseInt(localStorage.getItem('balance')||0);
let workClickCount = parseInt(localStorage.getItem('workClickCount')||0);

function updateBalanceDisplay(){
    const el = document.getElementById('balance');
    if(el) el.innerText = balance;
}

function addBalance(amount){
    balance += amount;
    localStorage.setItem('balance', balance);
    updateBalanceDisplay();
}

function incrementWorkClick(){
    workClickCount++;
    localStorage.setItem('workClickCount', workClickCount);
    if(workClickCount >= 20){
        alert("Popunder + 20 TK reward!");
        showPopundeeAd();
        addBalance(20);
        workClickCount = 0;
        localStorage.setItem('workClickCount', workClickCount);
    }
}
