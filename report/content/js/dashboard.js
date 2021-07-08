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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4117647058823529, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get transfer history"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Basic Data"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Secure data"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Customer Movements"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get subscribed loans"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Delete Token"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya credit"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Contacts"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get activated products"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Process QR code"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Transfiya debit"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Public Key"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get bills"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Customer Balance"], "isController": false}, {"data": [0.25, 500, 1500, "HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get payments history"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request Token"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"], "isController": false}, {"data": [1.0, 500, 1500, "Interchange SimmetricKey"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Get Pockets"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Get Own Loans"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 51, 0, 0.0, 1258.8823529411764, 91, 5528, 753.0, 2328.6, 4593.599999999999, 5528.0, 0.7696370633064212, 1.745138482796348, 0.39401456274051155], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["HTTP Detailed Movs: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 2, 0, 0.0, 840.0, 748, 932, 840.0, 932.0, 932.0, 932.0, 0.05273705305347537, 0.09187783461660162, 0.05747514766374855], "isController": false}, {"data": ["HTTP Get transfer history", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 1.8296515804597702, 0.0], "isController": false}, {"data": ["HTTP Get Basic Data", 2, 0, 0.0, 857.0, 752, 962, 857.0, 962.0, 962.0, 962.0, 0.049344945843921934, 0.08606452468480916, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 2, 0, 0.0, 3528.5, 2332, 4725, 3528.5, 4725.0, 4725.0, 4725.0, 0.05452265416280465, 0.09498868654926121, 0.05942117387274412], "isController": false}, {"data": ["HTTP Detail: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 2.9549947599085367, 1.516946932164634], "isController": false}, {"data": ["HTTP Detailed Movs: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 2, 0, 0.0, 3182.0, 836, 5528, 3182.0, 5528.0, 5528.0, 5528.0, 0.05014290728576443, 0.08735834628691772, 0.054647934112219826], "isController": false}, {"data": ["HTTP Get Secure data", 2, 0, 0.0, 720.0, 687, 753, 720.0, 753.0, 753.0, 753.0, 0.04968450340338848, 0.09888380657822826, 0.0], "isController": false}, {"data": ["HTTP Get Customer Movements", 2, 0, 0.0, 924.0, 800, 1048, 924.0, 1048.0, 1048.0, 1048.0, 0.05214036185411127, 0.26355323530945307, 0.0], "isController": false}, {"data": ["HTTP Get subscribed loans", 1, 0, 0.0, 2677.0, 2677, 2677, 2677.0, 2677.0, 2677.0, 2677.0, 0.3735524841240194, 0.6424081294359357, 0.0], "isController": false}, {"data": ["HTTP Detail: 6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", 2, 0, 0.0, 1003.0, 702, 1304, 1003.0, 1304.0, 1304.0, 1304.0, 0.05305602716468591, 0.10818455539049236, 0.05279696453204585], "isController": false}, {"data": ["HTTP Detailed Movs: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 2.3448014804845223, 1.4668152759084792], "isController": false}, {"data": ["HTTP Delete Token", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 7.141382158590308, 0.0], "isController": false}, {"data": ["HTTP Detail: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 2, 0, 0.0, 700.0, 699, 701, 700.0, 701.0, 701.0, 701.0, 0.06125574272588055, 0.12520338820826954, 0.06095664241960184], "isController": false}, {"data": ["HTTP Detail: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 2, 0, 0.0, 972.0, 619, 1325, 972.0, 1325.0, 1325.0, 1325.0, 0.060188389659634654, 0.12578432995275213, 0.059894501038249726], "isController": false}, {"data": ["HTTP Transfiya credit", 2, 0, 0.0, 1886.0, 1794, 1978, 1886.0, 1978.0, 1978.0, 1978.0, 0.04856254856254856, 0.08531643053127429, 0.0], "isController": false}, {"data": ["HTTP Detail: ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 3.0733858858858856, 1.4941699512012012], "isController": false}, {"data": ["HTTP Get Contacts", 1, 0, 0.0, 701.0, 701, 701, 701.0, 701.0, 701.0, 701.0, 1.4265335235378032, 4.594440977175464, 0.0], "isController": false}, {"data": ["HTTP Get activated products", 2, 0, 0.0, 638.0, 609, 667, 638.0, 667.0, 667.0, 667.0, 0.05000500050005001, 0.12315684693469346, 0.0], "isController": false}, {"data": ["HTTP Detail: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 2, 0, 0.0, 661.0, 651, 671, 661.0, 671.0, 671.0, 671.0, 0.06128577557148986, 0.1261625145553717, 0.06098652862045719], "isController": false}, {"data": ["HTTP Process QR code", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 14.335558252427186, 0.0], "isController": false}, {"data": ["HTTP Transfiya debit", 2, 0, 0.0, 2131.0, 1991, 2271, 2131.0, 2271.0, 2271.0, 2271.0, 0.048217170134284816, 0.08470965729646328, 0.0], "isController": false}, {"data": ["HTTP Request Public Key", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 2.3730307866556837, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce", 2, 0, 0.0, 716.0, 711, 721, 716.0, 721.0, 721.0, 721.0, 0.06121074860745546, 0.10664060108955133, 0.06671015180265655], "isController": false}, {"data": ["HTTP Get bills", 1, 0, 0.0, 1997.0, 1997, 1997, 1997.0, 1997.0, 1997.0, 1997.0, 0.500751126690035, 2.400084501752629, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683", 2, 0, 0.0, 727.5, 687, 768, 727.5, 768.0, 768.0, 768.0, 0.06121636925713936, 0.10665039331517248, 0.06671627743258547], "isController": false}, {"data": ["HTTP Get Customer Balance", 2, 0, 0.0, 1158.0, 977, 1339, 1158.0, 1339.0, 1339.0, 1339.0, 0.04962409746172741, 0.26798951070639904, 0.0], "isController": false}, {"data": ["HTTP Detailed Movs: 7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451", 2, 0, 0.0, 2614.5, 723, 4506, 2614.5, 4506.0, 4506.0, 4506.0, 0.05388947269150971, 0.09388556570473958, 0.05873110500363754], "isController": false}, {"data": ["HTTP Get payments history", 1, 0, 0.0, 2315.0, 2315, 2315, 2315.0, 2315.0, 2315.0, 2315.0, 0.4319654427645788, 0.7061622570194385, 0.0], "isController": false}, {"data": ["HTTP Request Token", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 2.2998269834474887, 0.0], "isController": false}, {"data": ["HTTP Detail: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", 2, 0, 0.0, 652.0, 645, 659, 652.0, 659.0, 659.0, 659.0, 0.05713632727688264, 0.11795526939778311, 0.05685734130385099], "isController": false}, {"data": ["Interchange SimmetricKey", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.308980082417582, 0.0], "isController": false}, {"data": ["HTTP Get Pockets", 1, 0, 0.0, 1372.0, 1372, 1372, 1372.0, 1372.0, 1372.0, 1372.0, 0.7288629737609329, 1.615741162536443, 0.0], "isController": false}, {"data": ["HTTP Get Own Loans", 1, 0, 0.0, 2291.0, 2291, 2291, 2291.0, 2291.0, 2291.0, 2291.0, 0.43649061545176776, 1.5707694511130512, 0.0], "isController": false}]}, function(index, item){
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
