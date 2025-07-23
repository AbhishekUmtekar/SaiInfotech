const bills = [22, 295, 176, 440, 37, 105, 10, 1100, 86, 52];
let tips = [];
let totals = [];

function calcTip(bills) {
    return bills >= 50 && bills <= 300 ? bills * 0.15 : bills * 0.2;
}

for (let bills = )