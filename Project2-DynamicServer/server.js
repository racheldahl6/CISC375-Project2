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

            //console.log(coalSum + "one");
            res(coalSum);
        });
    });
}

function NaturalGasTestSql() {
    return new Promise( function(res,rej) {
        naturalSum = 0;

        let sql = 'SELECT natural_gas FROM consumption WHERE year = ?';

        db.all(sql, ['2017'], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                naturalSum = naturalSum + row.natural_gas;

            });

            console.log(naturalSum + " one");
            res(naturalSum);
        });
    
    });
}
        

function NaturalGasTestSql() {
	return new Promise( function(res,rej) {
		naturalSum = 0;

		let sql = 'SELECT natural_gas FROM consumption WHERE year = ?';

		db.all(sql, ['2017'], (err, rows) => {

			if(err){
				rej(err);
			}
			rows.forEach((row) => {
				naturalSum = naturalSum + row.natural_gas;

			});

			console.log(naturalSum + " one");
			res(naturalSum);
		});
	
	});
}
	
function NuclearTestSql() {
    return new Promise( function(res,rej) {
        nuclearSum = 0;

        let sql = 'SELECT nuclear FROM consumption WHERE year = ?';

        db.all(sql, ['2017'], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                nuclearSum = nuclearSum + row.nuclear;

            });

            console.log(nuclearSum + " one");
            res(nuclearSum);
        });
    
    });
}	

function PetroleumTestSql() {
    return new Promise( function(res,rej) {
        petroleumSum = 0;

        let sql = 'SELECT petroleum FROM consumption WHERE year = ?';

        db.all(sql, ['2017'], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                petroleumSum = petroleumSum + row.petroleum;

            });

            console.log(petroleumSum + " one");
            res(petroleumSum);
        });
    
    });
}   

function RenewableTestSql() {
    return new Promise( function(res,rej) {
        renewableSum = 0;

        let sql = 'SELECT renewable FROM consumption WHERE year = ?';

        db.all(sql, ['2017'], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                
                renewableSum = renewableSum + row.renewable;
            });

            console.log(renewableSum + " one");
            res(renewableSum);
        });
    
    });
}   

function GetConsumptionForIndexTable(year) {
    return new Promise( function(res,rej) {
        let sql = 'SELECT * FROM consumption WHERE year = ?';
        var table = "";
        db.all(sql, [year], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                console.log(row);
                //total = total + row.coal + row.natural_gas + row.nuclear + row.petroleum + row.renewable;
                table += "<tr> "+ "<td>"+ row.state_abbreviation + "</td>" + "<td>"+ row.coal + "</td>" + "<td>"+ row.natural_gas + "</td>" + "<td>" + row.nuclear + "</td>" + "<td>" + row.petroleum+ "</td>"+ "<td>" + row.renewable + "</td>" +"</tr>";
              
            });

            res(table);
        });
    });
        

}
function GetConsumptionForYearTable(year) {
    return new Promise( function(res,rej) {
        let sql = 'SELECT * FROM consumption WHERE year = ?';
        var table = "";
        var total = 0;
        db.all(sql, [year], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                console.log(row);
                total = total + row.coal + row.natural_gas + row.nuclear + row.petroleum + row.renewable;
                table += "<tr> "+ "<td>"+ row.state_abbreviation + "</td>" + "<td>"+ row.coal + "</td>" + "<td>"+ row.natural_gas + "</td>" + "<td>" + row.nuclear + "</td>" + "<td>" + row.petroleum+ "</td>"+ "<td>" + row.renewable + "</td>" + "<td>"+ total + "</td>" + "</tr>";
              
            });

            res(table);
        });
    });
}
app.use(express.static(public_dir));


// GET request handler for '/' HOME PAGE
app.get('/', (req, res) => {

    ReadFile(path.join(template_dir, 'index.html')).then((template) => {

        Promise.all([CoalTestSql(), NaturalGasTestSql(), NuclearTestSql(), PetroleumTestSql(), RenewableTestSql(), GetConsumptionForIndexTable(2017)]).then((results) => {
            template = template.toString();
            //results = results[0].replace('!COALCOUNT!', results[1]);
            //console.log(coalSum);
            template = template.replace('!COALCOUNT!', results[0]);
            template = template.replace('!NATURALCOUNT!', results[1]);  
            template = template.replace('!NUCLEARCOUNT!', results[2]);
            template = template.replace('!PETROLEUMCOUNT!', results[3]); 
            template = template.replace('!RENEWABLECOUNT!', results[4]); 
            template = template.replace('!DATAHERE!', results[5]); 

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
        Promise.all([GetConsumptionForYearTable(req.params.selected_year)]).then((results) => {
            template = template.toString();
            
            template = template.replace('!YEAR!', req.params.selected_year);
            template = template.replace('!DATAHERE!', results[0]); 

            let response = template;
            WriteHtml(res, response);
            
        });
        // modify `response` here
       
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

        //lookup state_abbreviation in state table and find corresponding full state name
        
        template = template.replace('noimage', req.params.selected_state);
        template = template.replace('No Image', req.params.selected_state);

		//lookup state_abbreviation in state table and find corresponding full state name
		
		template = template.replace('noimage', req.params.selected_state);
		template = template.replace('No Image', req.params.selected_state);

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
