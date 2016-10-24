function XHR(file, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            json = JSON.parse(xhr.responseText);
            callback(json);
        }
    }
    xhr.open('GET', file, true);
    xhr.send();
}

function removeDuplicates(arr, prop) {
    var lookup = {};
    var filtered = [];
    var removed = [];
    var order = [];
    arr.forEach(function(item) {
        var val = item[prop];
        if (!lookup[val]) {
            lookup[val] = item;
            order.push(val);
        } else {
            var date1 = new Date(lookup[val].entryDate);
            var date2 = new Date(item.entryDate);
            if (date2.getTime() >= date1.getTime()) {
                removed.push(lookup[val]);
                lookup[val] = item;
                order = order.filter(function(key) {
                    return key !== val;
                });
                order.push(val);
            }
        }
    });

    order.forEach(function(key) {
        filtered.push(lookup[key]);
    });

    return {
        filtered: filtered,
        removed: removed
    }
}

function toTable(records) {
    return records.map(function(record) {
        var html = '<tr>';
        for(var key in record) {
            html += '<td>' + record[key] + '</td>';
        }
        html += '</tr>';
        return html;
    }).join("")
}

XHR('leads.json', function(json) {
    var uniqueByEmail = removeDuplicates(json.leads, "email");
    var uniqueById = removeDuplicates(uniqueByEmail.filtered, "_id");
    document.getElementById('original').innerHTML += toTable(json.leads);
    document.getElementById('removed-by-email').innerHTML += toTable(uniqueByEmail.removed);
    document.getElementById('removed-by-id').innerHTML += toTable(uniqueById.removed);
    document.getElementById('filtered').innerHTML += toTable(uniqueById.filtered);
    document.getElementById('output-json').innerHTML += JSON.stringify({leads: uniqueById.filtered});
});