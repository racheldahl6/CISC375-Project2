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

// -------------------------INDEX VARIABLES----------------------------------

function CoalTestSql(year) {

    return new Promise( function(res,rej) {
        coalSum = 0;
        let sql = 'SELECT coal FROM consumption WHERE year = ?';
        db.all(sql, [year], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                coalSum = coalSum + row.coal;
            });
            res(coalSum);
        });
    });
}

function NaturalGasTestSql(year) {
    return new Promise( function(res,rej) {
        naturalSum = 0;
        let sql = 'SELECT natural_gas FROM consumption WHERE year = ?';
        db.all(sql, [year], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                naturalSum = naturalSum + row.natural_gas;
            });
            res(naturalSum);
        });
    });
}

function NuclearTestSql(year) {

    return new Promise( function(res,rej) {
        nuclearSum = 0;
        let sql = 'SELECT nuclear FROM consumption WHERE year = ?';
        db.all(sql, [year], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                nuclearSum = nuclearSum + row.nuclear;
            });
            res(nuclearSum);
        });
    });
}	

function PetroleumTestSql(year) {
    return new Promise( function(res,rej) {
        petroleumSum = 0;
        let sql = 'SELECT petroleum FROM consumption WHERE year = ?';
        db.all(sql, [year], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                petroleumSum = petroleumSum + row.petroleum;
            });
            res(petroleumSum);
        });
    });
}   

function RenewableTestSql(year) {
    return new Promise( function(res,rej) {
        renewableSum = 0;
        let sql = 'SELECT renewable FROM consumption WHERE year = ?';
        db.all(sql, [year], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => { 
                renewableSum = renewableSum + row.renewable;
            });
            res(renewableSum);
        });
    });
}   
//-----------------------------STATE VARIABLES -----------------------------
function StateCoalTestSql(state) {
    return new Promise( function(res,rej) {
        var coalSum = 0;

        let sql = 'SELECT coal FROM consumption WHERE state_abbreviation = ?';

        db.all(sql, [state], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                
                coalSum = coalSum + row.coal;
            });

            console.log(coalSum + " STATE COAL SUM");
            res(coalSum);
        });
    
    });
}   

//------------------Dynamic Tables (Year State and Energy)----------------

function GetConsumptionForIndexTable(year) {
    return new Promise( function(res,rej) {
        let sql = 'SELECT * FROM consumption WHERE year = ?';
        var table = "";
        db.all(sql, [year], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                //console.log(row);
                //total = total + row.coal + row.natural_gas + row.nuclear + row.petroleum + row.renewable;
                table += "<tr> "+ "<td>"+ row.state_abbreviation + "</td>" + "<td>"+ row.coal + "</td>" + "<td>"+ row.natural_gas + "</td>" + "<td>" + row.nuclear + "</td>" + "<td>" + row.petroleum+ "</td>"+ "<td>" + row.renewable + "</td>" +"</tr>";
            });
            res(table);
        });
    });
}

//function for table on year page
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
                //console.log(row);
                total = total + row.coal + row.natural_gas + row.nuclear + row.petroleum + row.renewable;
                table += "<tr> "+ "<td>"+ row.state_abbreviation + "</td>" + "<td>"+ row.coal + "</td>" + "<td>"+ row.natural_gas + "</td>" + "<td>" + row.nuclear + "</td>" + "<td>" + row.petroleum+ "</td>"+ "<td>" + row.renewable + "</td>" + "<td>"+ total + "</td>" + "</tr>";  
            });
            res(table);
        });
    });
}

app.use(express.static(public_dir));

//function for table on state page
function GetConsumptionForStateTable(state) {
    return new Promise( function(res,rej) {
        let sql = 'SELECT * FROM consumption WHERE state_abbreviation = ?';
        var table = "";
        var total = 0;
        db.all(sql, [state], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                //console.log(row);
                total = total + row.coal + row.natural_gas + row.nuclear + row.petroleum + row.renewable;
                table += "<tr> "+ "<td>"+ row.year + "</td>" + "<td>"+ row.coal + "</td>" + "<td>"+ row.natural_gas + "</td>" + "<td>" + row.nuclear + "</td>" + "<td>" + row.petroleum+ "</td>"+ "<td>" + row.renewable + "</td>" + "<td>"+ total + "</td>" + "</tr>";  
            });
            res(table);
        });
    });
}
//app.use(express.static(public_dir));

//function for table on energy page
function GetConsumptionForEnergyTable(energysource) {
    return new Promise( function(res,rej) {
        let sql = 'SELECT ? FROM consumption WHERE state_abbreviation = ?';
        var table = "";
        var total = 0;
        db.all(sql, [energysource], (err, rows) => {
            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                //console.log(row);
                total = total + row.coal + row.natural_gas + row.nuclear + row.petroleum + row.renewable;
                table += "<tr> "+ "<td>"+ row.year + "</td>" + "<td>"+ row.coal + "</td>" + "<td>"+ row.natural_gas + "</td>" + "<td>" + row.nuclear + "</td>" + "<td>" + row.petroleum+ "</td>"+ "<td>" + row.renewable + "</td>" + "<td>"+ total + "</td>" + "</tr>";  
            });
            res(table);
        });
    });
}

//function for getting full state name from state abbreviation
function GetFullStateName(stateabbrev) {
    return new Promise( function(res,rej) {
        let sql = 'SELECT state_name FROM States WHERE state_abbreviation = (SELECT state_abbreviation FROM Consumption WHERE state_abbreviation = ?)';
        var fullName = "";
        var total = 0;
        db.all(sql, [stateabbrev], (err, rows) => {
            if(err){
                rej(err);
            }
		    rows.forEach((row) =>{
				var fullName = row.state_name;
				console.log(fullName + " fullname" );
            });
            res(fullName);
        });
    });
}

// -------------------------------GET REQUESTS----------------------------------
// GET request handler for '/' HOME PAGE
app.get('/', (req, res) => {

    ReadFile(path.join(template_dir, 'index.html')).then((template) => {

        Promise.all([CoalTestSql(2017), NaturalGasTestSql(2017), NuclearTestSql(2017), PetroleumTestSql(2017), RenewableTestSql(2017), GetConsumptionForIndexTable(2017)]).then((results) => {
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

        Promise.all([CoalTestSql(req.params.selected_year), NaturalGasTestSql(req.params.selected_year), NuclearTestSql(req.params.selected_year), PetroleumTestSql(req.params.selected_year), RenewableTestSql(req.params.selected_year), GetConsumptionForYearTable(req.params.selected_year)]).then((results) => {

            template = template.toString();
            
            template = template.replace('!YEAR!', req.params.selected_year);
			template = template.replace('!COALCOUNT!', results[0]);
            template = template.replace('!NATURALCOUNT!', results[1]);  
            template = template.replace('!NUCLEARCOUNT!', results[2]);
            template = template.replace('!PETROLEUMCOUNT!', results[3]); 
            template = template.replace('!RENEWABLECOUNT!', results[4]); 
            template = template.replace('!DATAHERE!', results[5]); 

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

        var state = req.params.selected_state;

            template = template.toString();
			//GetFullStateName(req.params.selected_state).then((fullName) =>{	
				//template = template.replace('!STATE!');
            //});
            //populate image 
            template = template.replace('noimage', req.params.selected_state);
            template = template.replace('No Image', req.params.selected_state);

        Promise.all([GetFullStateName(req.params.selected_state), CoalTestSql(req.params.selected_year), NaturalGasTestSql(req.params.selected_year), NuclearTestSql(req.params.selected_year), PetroleumTestSql(req.params.selected_year), RenewableTestSql(req.params.selected_year),GetConsumptionForStateTable(req.params.selected_state)]).then((results) => {

            //populate state table 
			template = template.replace('!STATENAME!', results[0]);
			template = template.replace('!STATE!', results[0]);
			//console.log(results[0] + 'results0');
			template = template.replace('!COALCOUNT!', results[1]);
            template = template.replace('!NATURALCOUNT!', results[2]);  
            template = template.replace('!NUCLEARCOUNT!', results[3]);
            template = template.replace('!PETROLEUMCOUNT!', results[4]); 
            template = template.replace('!RENEWABLECOUNT!', results[5]); 
            template = template.replace('!DATAHERE!', results[6]); 
            
            let response = template;
            WriteHtml(res, response);


            //lookup state_abbreviation in state table and find corresponding full state name

        });

    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/energy-type/*'
app.get('/energy-type/:selected_energy_type', (req, res) => {
    ReadFile(path.join(template_dir, 'energy.html')).then((template) => {
		Promise.all([GetConsumptionForEnergyTable(req.params.selected_energy_type)]).then((results) => {
 
			template = template.toString();
			template = template.replace('!ENERGY!', req.params.selected_energy_type);

			let response = template;
			WriteHtml(res, response);
		});
		
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
