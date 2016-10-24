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

    arr.forEach(function(item) {
        var val = item[prop];
        if (!lookup[val]) {
            lookup[val] = item;
        } else {
            var date1 = new Date(lookup[val].entryDate);
            var date2 = new Date(item.entryDate);
            if (date2.getTime() >= date1.getTime()) {
                removed.push(lookup[val]);
                lookup[val] = item;
            }
        }
    });

    for (var key in lookup) {
        filtered.push(lookup[key]);
    }

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
    // Remove duplicates based on email
    var unique1 = removeDuplicates(json.leads, "email");

    // Remove duplicates based on _id
    var unique2 = removeDuplicates(unique1.filtered, "_id");

    // Output all records to web
    document.getElementById('original').innerHTML += toTable(json.leads);
    document.getElementById('removed-by-email').innerHTML += toTable(unique1.removed);
    document.getElementById('removed-by-id').innerHTML += toTable(unique2.removed);
    document.getElementById('filtered').innerHTML += toTable(unique2.filtered);
});