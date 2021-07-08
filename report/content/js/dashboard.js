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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.43137254901960786, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get transfer history"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Basic Data"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Secure data"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Customer Movements"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get subscribed loans"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Delete Token"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya credit"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Contacts"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get activated products"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Process QR code"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya debit"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Public Key"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get bills"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Customer Balance"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get payments history"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Token"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [1.0, 500, 1500, "Interchange SimmetricKey"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Pockets"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get Own Loans"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 51, 0, 0.0, 1185.6862745098042, 119, 6596, 730.0, 2064.4, 5131.8, 6596.0, 0.8192639475671073, 1.8576665686093397, 0.41942097315705773], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 2, 0, 0.0, 900.5, 871, 930, 900.5, 930.0, 930.0, 930.0, 0.04544628249409198, 0.07917594528267587, 0.04952934693692056], "isController": false}, {"data": ["HTTP Get transfer history", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 2.4661641725352115, 0.0], "isController": false}, {"data": ["HTTP Get Basic Data", 2, 0, 0.0, 705.5, 656, 755, 705.5, 755.0, 755.0, 755.0, 0.043549265106151334, 0.07595604246053349, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 2, 0, 0.0, 2994.0, 786, 5202, 2994.0, 5202.0, 5202.0, 5202.0, 0.061604805174803635, 0.1073271215154782, 0.06713961188972739], "isController": false}, {"data": ["HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 2.884637741815476, 1.480829148065476], "isController": false}, {"data": ["HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 2, 0, 0.0, 739.0, 736, 742, 739.0, 742.0, 742.0, 742.0, 0.07143622530985462, 0.12445529878201236, 0.07785432367753688], "isController": false}, {"data": ["HTTP Get Secure data", 2, 0, 0.0, 690.0, 683, 697, 690.0, 697.0, 697.0, 697.0, 0.04362050163576881, 0.08681502181025082, 0.0], "isController": false}, {"data": ["HTTP Get Customer Movements", 2, 0, 0.0, 892.5, 804, 981, 892.5, 981.0, 981.0, 981.0, 0.04523249502442555, 0.228636127193776, 0.0], "isController": false}, {"data": ["HTTP Get subscribed loans", 1, 0, 0.0, 2118.0, 2118, 2118, 2118.0, 2118.0, 2118.0, 2118.0, 0.47214353163361666, 0.8119577726628896, 0.0], "isController": false}, {"data": ["HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 2, 0, 0.0, 3612.0, 628, 6596, 3612.0, 6596.0, 6596.0, 6596.0, 0.045698617616817094, 0.0931823374842911, 0.04547547983548498], "isController": false}, {"data": ["HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 2.4332227653631286, 1.5221281424581006], "isController": false}, {"data": ["HTTP Delete Token", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 10.1318359375, 0.0], "isController": false}, {"data": ["HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 2, 0, 0.0, 630.0, 629, 631, 630.0, 631.0, 631.0, 631.0, 0.06190034045187249, 0.1265209107087589, 0.061598092695759825], "isController": false}, {"data": ["HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 2, 0, 0.0, 990.0, 639, 1341, 990.0, 1341.0, 1341.0, 1341.0, 0.05286110744020087, 0.11047145500198229, 0.05260299656402802], "isController": false}, {"data": ["HTTP Transfiya credit", 2, 0, 0.0, 1854.0, 1688, 2020, 1854.0, 2020.0, 2020.0, 2020.0, 0.042643014008230104, 0.07491677949297455, 0.0], "isController": false}, {"data": ["HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 3.361042692939245, 1.6340183702791462], "isController": false}, {"data": ["HTTP Get Contacts", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 4.5813700213371265, 0.0], "isController": false}, {"data": ["HTTP Get activated products", 2, 0, 0.0, 596.0, 542, 650, 596.0, 650.0, 650.0, 650.0, 0.044040252791051025, 0.10846632572170965, 0.0], "isController": false}, {"data": ["HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 2, 0, 0.0, 671.0, 612, 730, 671.0, 730.0, 730.0, 730.0, 0.05435816595548067, 0.11190138069741527, 0.054092745223276166], "isController": false}, {"data": ["HTTP Process QR code", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 15.792112299465241, 0.0], "isController": false}, {"data": ["HTTP Transfiya debit", 2, 0, 0.0, 1739.5, 1710, 1769, 1739.5, 1769.0, 1769.0, 1769.0, 0.042621204049014386, 0.07487846297282899, 0.0], "isController": false}, {"data": ["HTTP Request Public Key", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 2.21264160906298, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 2, 0, 0.0, 2893.5, 702, 5085, 2893.5, 5085.0, 5085.0, 5085.0, 0.05440252427712646, 0.09477939776405625, 0.05929025106764954], "isController": false}, {"data": ["HTTP Get bills", 1, 0, 0.0, 2066.0, 2066, 2066, 2066.0, 2066.0, 2066.0, 2066.0, 0.484027105517909, 2.3199267909002907, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 2, 0, 0.0, 836.0, 684, 988, 836.0, 988.0, 988.0, 988.0, 0.05380683346785042, 0.09374159268227064, 0.0586410411622276], "isController": false}, {"data": ["HTTP Get Customer Balance", 2, 0, 0.0, 1255.5, 1144, 1367, 1255.5, 1367.0, 1367.0, 1367.0, 0.04356823875394837, 0.23528550811458446, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 2, 0, 0.0, 727.5, 711, 744, 727.5, 744.0, 744.0, 744.0, 0.05275652862041678, 0.09191176470588236, 0.057496372988657354], "isController": false}, {"data": ["HTTP Get payments history", 1, 0, 0.0, 946.0, 946, 946, 946.0, 946.0, 946.0, 946.0, 1.0570824524312896, 1.72808205602537, 0.0], "isController": false}, {"data": ["HTTP Request Token", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 2.9113416726878616, 0.0], "isController": false}, {"data": ["HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 2, 0, 0.0, 628.5, 628, 629, 628.5, 629.0, 629.0, 629.0, 0.07170514842965725, 0.14803191775419475, 0.07135502563459056], "isController": false}, {"data": ["Interchange SimmetricKey", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 9.412749474789916, 0.0], "isController": false}, {"data": ["HTTP Get Pockets", 1, 0, 0.0, 1353.0, 1353, 1353, 1353.0, 1353.0, 1353.0, 1353.0, 0.7390983000739099, 1.6384308019216556, 0.0], "isController": false}, {"data": ["HTTP Get Own Loans", 1, 0, 0.0, 2058.0, 2058, 2058, 2058.0, 2058.0, 2058.0, 2058.0, 0.48590864917395526, 1.7486068087949467, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 51, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
