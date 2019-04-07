const fs = require('fs');
const readline = require('readline');
const path = require('path');
const events = require('events');

module.exports = function convertCsv2Json(csv_file, json_file, callback, encoding = 'utf-8') {
    let proxy = new events.EventEmitter();
    proxy.once('error', (error) => {
        proxy.removeAllListeners();
        callback(error, null);

    });

    let property_names = [];
    let json_data = [];

    proxy.on('line', function (data) {
        if (data.no == 0) {
            property_names = data.line.split(',');
            return;
        }


        let row = {};
        let property_values = data.line.split(',');
        if (property_names.length !== property_values.length) {
            proxy.emit('error', Error('The header is not match its content'));
            return;
        }

        for (let i = 0; i < property_names.length; i++) {
            row[property_names[i]] = property_values[i];
        }
        json_data.push(row);

    });

    proxy.on('done', () => {

        if (json_file) {
            fs.writeFile(json_file, JSON.stringify(json_data), (error) => {
                if (error != null) {
                    callback(error, null);
                    return;
                }

                callback(null, 'done');
            });
        } else {
            callback(null, json_data)
        }
    });

    let rs = fs.createReadStream(csv_file, { encoding: 'utf8' });
    rs.on('error', (error) => proxy.emit('error', error));

    let rl = readline.createInterface({
        input: rs,
    });

    let line_counter = 0;
    rl.on('line', function (line) {
        proxy.emit('line', {
            no: line_counter,
            line: line
        });
        line_counter++;
    }).on('close', () => proxy.emit('done'));

}



