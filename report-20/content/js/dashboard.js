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

    var data = {"OkPercent": 93.44746162927981, "KoPercent": 6.552538370720189};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.29191263282172375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39285714285714285, 500, 1500, "HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "HTTP Get transfer history"], "isController": false}, {"data": [0.3435114503816794, 500, 1500, "HTTP Get Basic Data"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [0.3063063063063063, 500, 1500, "HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.3384615384615385, 500, 1500, "HTTP Get Secure data"], "isController": false}, {"data": [0.2903225806451613, 500, 1500, "HTTP Get Customer Movements"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get subscribed loans"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.38738738738738737, 500, 1500, "HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Delete Token"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.35267857142857145, 500, 1500, "HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya credit"], "isController": false}, {"data": [0.4009009009009009, 500, 1500, "HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.3, 500, 1500, "HTTP Get Contacts"], "isController": false}, {"data": [0.36904761904761907, 500, 1500, "HTTP Get activated products"], "isController": false}, {"data": [0.3794642857142857, 500, 1500, "HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [0.8738738738738738, 500, 1500, "HTTP Process QR code"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya debit"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Public Key"], "isController": false}, {"data": [0.375, 500, 1500, "HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.004347826086956522, 500, 1500, "HTTP Get bills"], "isController": false}, {"data": [0.36160714285714285, 500, 1500, "HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [0.156, 500, 1500, "HTTP Get Customer Balance"], "isController": false}, {"data": [0.3794642857142857, 500, 1500, "HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.3445378151260504, 500, 1500, "HTTP Get payments history"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request Token"], "isController": false}, {"data": [0.3918918918918919, 500, 1500, "HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [1.0, 500, 1500, "Interchange SimmetricKey"], "isController": false}, {"data": [0.04017857142857143, 500, 1500, "HTTP Get Pockets"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get Own Loans"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3388, 222, 6.552538370720189, 1720.1608618654056, 22, 23485, 1191.5, 3402.1, 4408.349999999995, 8256.150000000021, 10.886084897324427, 24.492677502345582, 5.235616699079117], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 112, 1, 0.8928571428571429, 1431.0892857142856, 35, 7434, 1129.0, 2326.3, 3200.9, 7303.740000000004, 0.3978261641743331, 0.6885957147106881, 0.4335683586118709], "isController": false}, {"data": ["HTTP Get transfer history", 117, 12, 10.256410256410257, 1233.8461538461531, 27, 5521, 989.0, 2523.6000000000004, 3012.999999999998, 5503.36, 0.4565978387702298, 0.7398563387585222, 0.0], "isController": false}, {"data": ["HTTP Get Basic Data", 131, 13, 9.923664122137405, 1125.8015267175574, 23, 4808, 872.0, 2137.3999999999996, 2471.399999999999, 4763.200000000001, 0.43589803313490544, 0.7054780123132876, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 112, 3, 2.6785714285714284, 1274.0624999999998, 24, 4756, 1096.0, 2209.6000000000004, 2768.45, 4721.290000000001, 0.41079058849419575, 0.7017588977883329, 0.4476975554292212], "isController": false}, {"data": ["HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 111, 7, 6.306306306306307, 1350.387387387388, 23, 4915, 1012.0, 2686.7999999999997, 3802.799999999999, 4855.119999999998, 0.4136604853616362, 0.7637601214056258, 0.41164065877295625], "isController": false}, {"data": ["HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 111, 4, 3.6036036036036037, 1302.1801801801794, 23, 4923, 1158.0, 2104.0, 2398.2, 4869.839999999998, 0.4103254139296237, 0.6961640811852859, 0.44719058783736326], "isController": false}, {"data": ["HTTP Get Secure data", 130, 8, 6.153846153846154, 1166.6307692307691, 22, 4396, 1035.0, 1988.6000000000004, 2170.15, 4103.669999999998, 0.43404371821881815, 0.8234440576076177, 0.0], "isController": false}, {"data": ["HTTP Get Customer Movements", 124, 7, 5.645161290322581, 1586.193548387097, 22, 7524, 1288.5, 2614.5, 3974.5, 7427.75, 0.4347155417817728, 2.1639368400387036, 0.0], "isController": false}, {"data": ["HTTP Get subscribed loans", 121, 15, 12.396694214876034, 4177.6776859504125, 23, 15303, 3750.0, 7821.4, 8602.799999999997, 15189.26, 0.45523120854480265, 0.7127720629592287, 0.0], "isController": false}, {"data": ["HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 112, 0, 0.0, 1392.8214285714287, 619, 8082, 1125.0, 2194.2000000000003, 3277.4499999999966, 7669.510000000015, 0.3984701592101752, 0.812505559014498, 0.3965245041359068], "isController": false}, {"data": ["HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 111, 3, 2.7027027027027026, 1266.216216216216, 28, 4779, 1055.0, 2078.6, 2798.399999999995, 4747.199999999999, 0.4123374331809047, 0.7042755572591819, 0.4493833744432516], "isController": false}, {"data": ["HTTP Delete Token", 1, 1, 100.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 27.0, 37.03703703703704, 17.686631944444446, 0.0], "isController": false}, {"data": ["HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 112, 3, 2.6785714285714284, 1176.3392857142865, 27, 6207, 931.0, 2156.600000000001, 2542.4999999999995, 5841.440000000013, 0.4097056338182736, 0.8202257633510994, 0.4077051180281453], "isController": false}, {"data": ["HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 112, 3, 2.6785714285714284, 1261.2232142857144, 28, 4598, 1032.5, 2212.6000000000004, 2688.399999999995, 4471.120000000004, 0.403530895334174, 0.8231449006935687, 0.4015605296343001], "isController": false}, {"data": ["HTTP Transfiya credit", 126, 10, 7.936507936507937, 2922.1269841269805, 27, 8739, 2785.5, 4718.6, 6145.69999999999, 8601.840000000002, 0.4277435846949271, 0.7080458547063676, 0.0], "isController": false}, {"data": ["HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 111, 4, 3.6036036036036037, 1149.0450450450455, 27, 4221, 937.0, 1871.5999999999995, 3192.199999999997, 4200.719999999999, 0.4113701219286217, 0.8187591492791758, 0.40936147875514217], "isController": false}, {"data": ["HTTP Get Contacts", 115, 11, 9.565217391304348, 1338.3304347826086, 24, 4583, 1085.0, 2385.8000000000006, 2909.599999999994, 4558.52, 0.45475755490703174, 1.3453154225587427, 0.0], "isController": false}, {"data": ["HTTP Get activated products", 126, 11, 8.73015873015873, 1080.8333333333335, 22, 5450, 865.0, 1912.1999999999996, 3082.1, 5365.760000000001, 0.4302690889222784, 0.9851295982874608, 0.0], "isController": false}, {"data": ["HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 112, 3, 2.6785714285714284, 1198.6160714285716, 28, 3518, 1024.0, 2042.2000000000003, 2499.8999999999983, 3507.2100000000005, 0.4073408642900267, 0.8212986024480459, 0.40535189522611054], "isController": false}, {"data": ["HTTP Process QR code", 111, 14, 12.612612612612613, 125.35135135135137, 22, 448, 122.0, 180.0, 226.79999999999984, 435.1599999999995, 0.45444868414588213, 1.2001485018546418, 0.0], "isController": false}, {"data": ["HTTP Transfiya debit", 128, 10, 7.8125, 2612.210937500001, 23, 10141, 2455.5, 3798.200000000003, 5242.849999999999, 9301.739999999982, 0.42674205776353824, 0.7070650189866876, 0.0], "isController": false}, {"data": ["HTTP Request Public Key", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 2.5050951086956523, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 112, 3, 2.6785714285714284, 1330.044642857143, 23, 5582, 1130.5, 2056.1000000000004, 2899.049999999998, 5428.2100000000055, 0.40886059313990336, 0.6984618616572725, 0.4455941620548165], "isController": false}, {"data": ["HTTP Get bills", 115, 11, 9.565217391304348, 3198.1565217391294, 23, 13996, 2807.0, 5129.4000000000015, 10501.599999999999, 13886.080000000002, 0.4547485635876894, 1.9918844372684241, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 112, 3, 2.6785714285714284, 1237.919642857143, 24, 4972, 1009.0, 1882.5000000000002, 2211.3499999999985, 4900.760000000002, 0.40601629140369255, 0.6936029040587128, 0.4424943175844931], "isController": false}, {"data": ["HTTP Get Customer Balance", 125, 12, 9.6, 2062.8239999999983, 22, 7778, 1680.0, 4215.400000000003, 5925.799999999999, 7733.0199999999995, 0.43031333695944035, 2.11844936696605, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 112, 2, 1.7857142857142858, 1294.0892857142858, 27, 4206, 1119.5, 2016.5000000000002, 2774.7999999999956, 4205.22, 0.4014495195151063, 0.6903343971446904, 0.4375172497840417], "isController": false}, {"data": ["HTTP Get payments history", 119, 13, 10.92436974789916, 1203.638655462185, 26, 6622, 929.0, 2235.0, 3538.0, 6234.199999999994, 0.4577697764237025, 0.6904751729619627, 0.0], "isController": false}, {"data": ["HTTP Request Token", 1, 0, 0.0, 8173.0, 8173, 8173, 8173.0, 8173.0, 8173.0, 8173.0, 0.1223540927444023, 0.2465004817692402, 0.0], "isController": false}, {"data": ["HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 111, 4, 3.6036036036036037, 1065.396396396396, 23, 2994, 909.0, 1820.3999999999999, 2214.599999999999, 2931.5999999999976, 0.4088924907446632, 0.820756416573039, 0.4068959453796991], "isController": false}, {"data": ["Interchange SimmetricKey", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 12.585586376404494, 0.0], "isController": false}, {"data": ["HTTP Get Pockets", 112, 20, 17.857142857142858, 4393.374999999999, 22, 23485, 2466.5, 19657.600000000006, 20835.05, 23206.41000000001, 0.4531917648582157, 0.9169103752589668, 0.0], "isController": false}, {"data": ["HTTP Get Own Loans", 121, 11, 9.090909090909092, 3523.1322314049594, 24, 12389, 3108.0, 6784.599999999999, 7849.999999999998, 11759.360000000004, 0.4523804182836463, 1.499594499138234, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 10, 4.504504504504505, 0.29515938606847697], "isController": false}, {"data": ["403\/Forbidden", 212, 95.49549549549549, 6.257378984651712], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3388, 222, "403\/Forbidden", 212, "500\/Internal Server Error", 10, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 112, 1, "403\/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get transfer history", 117, 12, "403\/Forbidden", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get Basic Data", 131, 13, "403\/Forbidden", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 112, 3, "403\/Forbidden", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 111, 7, "403\/Forbidden", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 111, 4, "403\/Forbidden", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get Secure data", 130, 8, "403\/Forbidden", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get Customer Movements", 124, 7, "403\/Forbidden", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get subscribed loans", 121, 15, "403\/Forbidden", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 111, 3, "403\/Forbidden", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Delete Token", 1, 1, "403\/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 112, 3, "403\/Forbidden", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 112, 3, "403\/Forbidden", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Transfiya credit", 126, 10, "403\/Forbidden", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 111, 4, "403\/Forbidden", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get Contacts", 115, 11, "403\/Forbidden", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get activated products", 126, 11, "403\/Forbidden", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 112, 3, "403\/Forbidden", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Process QR code", 111, 14, "403\/Forbidden", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Transfiya debit", 128, 10, "403\/Forbidden", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 112, 3, "403\/Forbidden", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get bills", 115, 11, "403\/Forbidden", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 112, 3, "403\/Forbidden", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get Customer Balance", 125, 12, "403\/Forbidden", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 112, 2, "403\/Forbidden", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get payments history", 119, 13, "403\/Forbidden", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 111, 4, "403\/Forbidden", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP Get Pockets", 112, 20, "500\/Internal Server Error", 10, "403\/Forbidden", 10, null, null, null, null, null, null], "isController": false}, {"data": ["HTTP Get Own Loans", 121, 11, "403\/Forbidden", 11, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
