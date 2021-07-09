/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3596358118361153, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.42142857142857143, 500, 1500, "HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "HTTP Get transfer history"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Basic Data"], "isController": false}, {"data": [0.4857142857142857, 500, 1500, "HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [0.32857142857142857, 500, 1500, "HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [0.4714285714285714, 500, 1500, "HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Secure data"], "isController": false}, {"data": [0.3357142857142857, 500, 1500, "HTTP Get Customer Movements"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get subscribed loans"], "isController": false}, {"data": [0.4357142857142857, 500, 1500, "HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Delete Token"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya credit"], "isController": false}, {"data": [0.4714285714285714, 500, 1500, "HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "HTTP Get Contacts"], "isController": false}, {"data": [0.45, 500, 1500, "HTTP Get activated products"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Process QR code"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya debit"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Public Key"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get bills"], "isController": false}, {"data": [0.4857142857142857, 500, 1500, "HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [0.20714285714285716, 500, 1500, "HTTP Get Customer Balance"], "isController": false}, {"data": [0.45714285714285713, 500, 1500, "HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.20161290322580644, 500, 1500, "HTTP Get payments history"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Token"], "isController": false}, {"data": [0.4857142857142857, 500, 1500, "HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [1.0, 500, 1500, "Interchange SimmetricKey"], "isController": false}, {"data": [0.175, 500, 1500, "HTTP Get Pockets"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get Own Loans"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1977, 0, 0.0, 1507.296408700049, 76, 9589, 973.0, 2886.2, 4375.499999999998, 6914.88, 6.445828306869681, 15.200732929721887, 3.330934300723811], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 70, 0, 0.0, 1155.9714285714283, 751, 3255, 1020.0, 1620.1, 2190.25, 3255.0, 0.25574232864350616, 0.44555108818360833, 0.27871917848257116], "isController": false}, {"data": ["HTTP Get transfer history", 62, 0, 0.0, 1542.1451612903227, 676, 4248, 1320.5, 2572.7000000000003, 3328.199999999999, 4248.0, 0.23659336088501182, 0.41426942975275993, 0.0], "isController": false}, {"data": ["HTTP Get Basic Data", 70, 0, 0.0, 815.7714285714287, 660, 1223, 791.5, 971.8, 1023.6500000000002, 1223.0, 0.2568081679672166, 0.44790955858344617, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 70, 0, 0.0, 936.3142857142857, 720, 2116, 900.5, 1153.5, 1276.1000000000004, 2116.0, 0.2584380007236264, 0.45024745438569286, 0.2816570398511397], "isController": false}, {"data": ["HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 70, 0, 0.0, 1340.3571428571433, 611, 4216, 1221.5, 2010.8, 2518.6000000000013, 4216.0, 0.2557217747091165, 0.4957106667945275, 0.2544731332310446], "isController": false}, {"data": ["HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 70, 0, 0.0, 1021.2142857142861, 706, 2354, 922.5, 1420.1, 1684.350000000001, 2354.0, 0.2579741657299748, 0.44943936685769037, 0.2811515321822771], "isController": false}, {"data": ["HTTP Get Secure data", 70, 0, 0.0, 795.1142857142856, 607, 1317, 787.0, 950.6999999999999, 1039.9500000000003, 1317.0, 0.25716573964540523, 0.5118200951145857, 0.0], "isController": false}, {"data": ["HTTP Get Customer Movements", 70, 0, 0.0, 1537.6857142857143, 843, 3355, 1306.5, 2385.8999999999996, 2907.7000000000003, 3355.0, 0.25529276609712065, 1.3395390939842085, 0.0], "isController": false}, {"data": ["HTTP Get subscribed loans", 66, 0, 0.0, 5855.727272727273, 3001, 9589, 5357.0, 8324.3, 9049.55, 9589.0, 0.23920323576740748, 0.4113641583851607, 0.0], "isController": false}, {"data": ["HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 70, 0, 0.0, 996.0571428571429, 633, 2540, 840.0, 1725.2999999999997, 2029.5500000000013, 2540.0, 0.25601732140048794, 0.5220353194181824, 0.2547672368233371], "isController": false}, {"data": ["HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 70, 0, 0.0, 1431.5571428571427, 787, 5403, 1127.0, 2405.7999999999997, 2829.1500000000005, 5403.0, 0.2567083389870289, 0.44723405932896443, 0.2797719788178948], "isController": false}, {"data": ["HTTP Delete Token", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 14.604448198198199, 0.0], "isController": false}, {"data": ["HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 70, 0, 0.0, 754.0571428571428, 602, 1080, 747.0, 852.1999999999999, 985.9000000000001, 1080.0, 0.25876090492385034, 0.5288931386773622, 0.2574974239427769], "isController": false}, {"data": ["HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 70, 0, 0.0, 878.857142857143, 628, 2488, 750.5, 1116.7, 2125.7500000000005, 2488.0, 0.2573198301689121, 0.5377582388295623, 0.25606338568566545], "isController": false}, {"data": ["HTTP Transfiya credit", 70, 0, 0.0, 2470.871428571429, 1630, 3826, 2374.5, 3388.8999999999996, 3630.25, 3826.0, 0.2551587634277299, 0.44827208535789664, 0.0], "isController": false}, {"data": ["HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 70, 0, 0.0, 962.0571428571427, 625, 5121, 820.0, 1344.2, 1529.6000000000001, 5121.0, 0.2580017396688732, 0.5280973108847249, 0.2567419655493963], "isController": false}, {"data": ["HTTP Get Contacts", 62, 0, 0.0, 1460.8064516129032, 693, 5028, 959.5, 2906.9000000000005, 3412.0, 5028.0, 0.2366972336965236, 0.7623315202452489, 0.0], "isController": false}, {"data": ["HTTP Get activated products", 70, 0, 0.0, 970.2714285714285, 502, 2083, 894.0, 1588.8, 1909.9500000000005, 2083.0, 0.25512621458301443, 0.6283479620882445, 0.0], "isController": false}, {"data": ["HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 70, 0, 0.0, 758.0714285714287, 623, 1087, 743.5, 890.3, 933.0, 1087.0, 0.2587800369685767, 0.532722966728281, 0.2575164625693161], "isController": false}, {"data": ["HTTP Process QR code", 60, 0, 0.0, 150.31666666666663, 96, 299, 137.5, 199.39999999999998, 236.7, 299.0, 0.2680031088360625, 0.7914466807814972, 0.0], "isController": false}, {"data": ["HTTP Transfiya debit", 70, 0, 0.0, 2297.1714285714297, 1589, 3604, 2162.5, 2972.4, 3074.4, 3604.0, 0.2557582134923419, 0.44932522077414355, 0.0], "isController": false}, {"data": ["HTTP Request Public Key", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 2.4290551222596966, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 70, 0, 0.0, 826.9571428571427, 695, 1112, 801.5, 971.5, 1007.2, 1112.0, 0.25870065746924237, 0.4507050516846956, 0.28194329466374457], "isController": false}, {"data": ["HTTP Get bills", 61, 0, 0.0, 2805.2622950819673, 1597, 6343, 2165.0, 4959.6, 5174.7, 6343.0, 0.23155968735646146, 1.10985834525929, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 70, 0, 0.0, 941.8285714285719, 719, 1990, 874.5, 1173.6, 1368.2500000000002, 1990.0, 0.25841414928216244, 0.45020590070251737, 0.2816310455067317], "isController": false}, {"data": ["HTTP Get Customer Balance", 70, 0, 0.0, 1898.6999999999998, 1003, 3409, 1614.5, 2911.1, 3220.2000000000003, 3409.0, 0.2538752239542154, 1.3710253793621203, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 70, 0, 0.0, 1021.4857142857142, 737, 2337, 915.0, 1395.5, 1644.6000000000004, 2337.0, 0.25685434157224213, 0.4474884232078905, 0.2799310988228732], "isController": false}, {"data": ["HTTP Get payments history", 62, 0, 0.0, 1893.1935483870964, 614, 4920, 1716.0, 3593.300000000001, 4348.449999999997, 4920.0, 0.235817659699903, 0.38550660384534924, 0.0], "isController": false}, {"data": ["HTTP Request Token", 1, 0, 0.0, 987.0, 987, 987, 987.0, 987.0, 987.0, 987.0, 1.0131712259371835, 2.0421732522796354, 0.0], "isController": false}, {"data": ["HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 70, 0, 0.0, 839.3571428571429, 616, 2359, 780.0, 1026.7, 1320.5, 2359.0, 0.2584255974246043, 0.5335075321832164, 0.25716375368717953], "isController": false}, {"data": ["Interchange SimmetricKey", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 14.738384046052632, 0.0], "isController": false}, {"data": ["HTTP Get Pockets", 60, 0, 0.0, 1654.3166666666668, 1326, 4069, 1584.0, 1952.1999999999998, 2133.1, 4069.0, 0.2656218872435089, 0.5888297695730128, 0.0], "isController": false}, {"data": ["HTTP Get Own Loans", 70, 0, 0.0, 4046.2714285714287, 1871, 6854, 4098.0, 5808.7, 6289.950000000002, 6854.0, 0.25287372930951024, 0.9099996997124465, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1977, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
