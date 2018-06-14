function calculatePercentile() {
    // Retrieve variables
    var input = parseFloat(document.getElementById("calculator-length").value);
    var mean = parseFloat(document.getElementById("distribution-mean").value);
    var stdev = parseFloat(document.getElementById("distribution-stdev").value);
    var percentilePrint = document.getElementById("percentile");
    var longestPenis = 34;
    var percentile = 0;
    var z = 0;

    // Fuck users
    if (isNaN(input) || isNaN(mean) || isNaN(stdev)) {
        alert("Enter numbers only");
        return;
    }

    // Calculate
    z = (mean - input) / stdev;
    percentile = (1 - Math.round(zProb(z) * 10000) / 10000) * 100;

    // Print
    if (percentile == 100 && input < longestPenis) {
        document.getElementById("disclaimer").removeAttribute("hidden");
        percentilePrint.innerText = '~' + percentile;
    } else {
        document.getElementById("disclaimer").setAttribute("hidden", "hidden");
        percentilePrint.innerText = percentile;
    }
}

function zProb(z) {
    var flag;
    var p;

    if (z < -7) { return 0.0; }
    if (z > 7) { return 1.0; }


    if (z < 0.0) { flag = true; } else { flag = false; }

    z = Math.abs(z);
    var b = 0.0;
    var s = Math.sqrt(2) / 3 * z;
    var HH = .5;

    for (var i = 0; i < 12; i++) {
        var a = Math.exp(-HH * HH / 9) * Math.sin(HH * s) / HH;
        b = b + a;
        HH = HH + 1.0;
    }
    p = .5 - b / Math.PI;
    //p=b/Math.PI;
    if (!flag) { p = 1.0 - p; }
    return p;
}