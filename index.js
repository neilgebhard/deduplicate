/* 

Programming Challenge:

Take a variable number of identically structured json records and de-duplicate the set.

An example file of records is given in the accompanying 'leads.json'. Output should be same format, with dups reconciled 

according to the following rules:

1. The data from the newest date should be preferred

2. duplicate IDs count as dups. Duplicate emails count as dups. Duplicate values elsewhere do not count as dups.

3. If the dates are identical the data from the record provided last in the list should be preferred

Simplifying assumption: the program can do everything in memory (don't worry about large files)

The application should also provide a log of changes including some representation of the source record, the output record and the individual field changes 
(value from and value to) for each field.

*/

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
    $('#original').append(toTable(json.leads));

    var json1 = removeDuplicates(json.leads, "email");
    var json2 = removeDuplicates(json1.filtered, "_id");

    $('#removed-by-email').append(toTable(json1.removed));
    $('#removed-by-id').append(toTable(json2.removed));
    $('#filtered').append(toTable(json2.filtered));
});

function oldDeDuplicate(records, property) {
    var hash = {};
    var removed = [];
    records.forEach(function(record, index) {
        console.log(index);
        var value = record[property];
        if (!hash[value]) {
            hash[value] = {};
            hash[value].record = record;
            hash[value].index = index;
        } else {
            // duplicate record found
            var hashedDate = new Date(hash[value].record.entryDate);
            var date = new Date(record.entryDate);
            if (date.getTime() >= hashedDate.getTime()) {
                removed.push(hash[value].record);
                records.splice(hash[value].index, 1);
                hash[value].record = record;
                hash[value].index = index;
            } else {
                // record found is older
                removed.push(record);
                records.splice(index, 1);
            }
        }
    });

    return removed;
}