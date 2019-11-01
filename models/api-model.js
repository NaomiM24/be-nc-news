const { readFile } = require("fs");

exports.fetchAvailableEndpoints = (cb) => {
  readFile(`./endpoints.json`, 'utf8', (err, endpoints) => {
    if (err) cb(err);
    else cb(null, JSON.parse(endpoints))
  })
}