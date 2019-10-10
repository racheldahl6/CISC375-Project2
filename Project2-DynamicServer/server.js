// Built-in Node.js modules
var fs = require('fs')
var path = require('path')


// NPM modules
var express = require('express')
var sqlite3 = require('sqlite3')


var public_dir = path.join(__dirname, 'public');
var template_dir = path.join(__dirname, 'templates');
var db_filename = path.join(__dirname, 'db', 'usenergy.sqlite3');

var app = express();
var port = 8000;

// open usenergy.sqlite3 database
var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
        //TestSql();
    }
});

function CoalTestSql() {
	return new Promise( function(res,rej) {
		coalSum = 0;

		let sql = 'SELECT coal FROM consumption WHERE year = ?';

		db.all(sql, ['2017'], (err, rows) => {

			if(err){
				rej(err);

			}
			rows.forEach((row) => {
				coalSum = coalSum + row.coal;

			});

			console.log(coalSum + "one");
			res(coalSum);

		});
	
	});
}

		

app.use(express.static(public_dir));


// GET request handler for '/' HOME PAGE
app.get('/', (req, res) => {
	
    //var coal = coalsum.toString();

    ReadFile(path.join(template_dir, 'index.html')).then((template) => {
        var coal;
    	CoalTestSql().then(function(coalSum) {
    		console.log(coalSum);
    		template = template.toString();
	        template = template.replace('!COALCOUNT!', coalSum);
	        let response = template;

	        WriteHtml(res, response);
	    });

        //console.log(coal + " COAL SUM ");

        // modify `response` here
        
    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/year/*'
app.get('/year/:selected_year', (req, res) => {
    ReadFile(path.join(template_dir, 'year.html')).then((template) => {

        // modify `response` here
        template = template.toString();
        //console.log(req.params.selected_year);
        template = template.replace('!YEAR!', req.params.selected_year);

        let response = template;
        WriteHtml(res, response);
    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/state/*'
app.get('/state/:selected_state', (req, res) => {
    ReadFile(path.join(template_dir, 'state.html')).then((template) => {
        
        // modify `response` here
        template = template.toString();
        template = template.replace('!STATE!', req.params.selected_state);

        let response = template;
        WriteHtml(res, response);

    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/energy-type/*'
app.get('/energy-type/:selected_energy_type', (req, res) => {
    ReadFile(path.join(template_dir, 'energy.html')).then((template) => {
        
        // modify `response` here
        template = template.toString();
        template = template.replace('!ENERGY!', req.params.selected_energy_type);

        let response = template;
        WriteHtml(res, response);
    }).catch((err) => {
        Write404Error(res);
    });
});

function ReadFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
}

function Write404Error(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error: file not found');
    res.end();
}

function WriteHtml(res, html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();
}


var server = app.listen(port);
