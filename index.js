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

function toTable(data) {
    return data.map(function(record) {
        var html = '<tr>';
        html += '<td>' + record._id + '</td>'
        html += '<td>' + record.address + '</td>'
        html += '<td>' + record.email + '</td>'
        html += '<td>' + record.entryDate + '</td>'
        html += '<td>' + record.firstName + '</td>'
        html += '<td>' + record.lastName + '</td>'
        html += '</tr>'
        return html
    }).join()
}

XHR('leads.json', function(json) {
    // Remove duplicates based on email
    var json1 = removeDuplicates(json.leads, "email");

    // Remove duplicates based on _id
    var json2 = removeDuplicates(json1.filtered, "_id");

    // Output all records on web
    $('#original').append(toTable(json.leads));
    $('#removed-by-email').append(toTable(json1.removed));
    $('#removed-by-id').append(toTable(json2.removed));
    $('#filtered').append(toTable(json2.filtered));
});