
// Built-in Node.js modules
var fs = require('fs');
var path = require('path');

// NPM modules
var express = require('express');
var sqlite3 = require('sqlite3');


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
        var coalSum = [];

        let sql = 'SELECT coal FROM consumption WHERE state_abbreviation = ? ORDER BY year';

        db.all(sql, [state], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                
                coalSum.push(row.coal);
            });

            res(JSON.stringify(coalSum));
        });
    
    });
}   
function StateNaturalTestSql(state) {
    return new Promise( function(res,rej) {
        var naturalSum = [];

        let sql = 'SELECT natural_gas FROM consumption WHERE state_abbreviation = ? ORDER BY year';

        db.all(sql, [state], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
                
                naturalSum.push(row.natural_gas);
            });

            res(JSON.stringify(naturalSum));
        });
    
    });
}   

function StateNuclearTestSql(state) {
    return new Promise( function(res,rej) {
        var nuclearSum = [];

        let sql = 'SELECT nuclear FROM consumption WHERE state_abbreviation = ? ORDER BY year';

        db.all(sql, [state], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
              
                nuclearSum.push(row.nuclear);
            });

            res(JSON.stringify(nuclearSum));
        });
    
    });
} 

function StatePetroleumTestSql(state) {
    return new Promise( function(res,rej) {
        var petroleumSum = [];

        let sql = 'SELECT petroleum FROM consumption WHERE state_abbreviation = ? ORDER BY year';

        db.all(sql, [state], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
              
                petroleumSum.push(row.petroleum);
            });

            res(JSON.stringify(petroleumSum));
        });
    
    });
} 

function StateRenewableTestSql(state) {
    return new Promise( function(res,rej) {
        var renewableSum = [];

        let sql = 'SELECT renewable FROM consumption WHERE state_abbreviation = ? ORDER BY year';

        db.all(sql, [state], (err, rows) => {

            if(err){
                rej(err);
            }
            rows.forEach((row) => {
              
                renewableSum.push(row.renewable);
            });

            res(JSON.stringify(renewableSum));
        });
    
    });
} 
//--------------------ENERGY VARIABLES -----------------------------------------//
function GetEnergyArray(energy)
{
    return new Promise( function(res,rej) {
        let sql = 'SELECT * FROM Consumption ORDER BY year';
        var energyObject = {AK:[],AL:[],AR:[],AZ:[],CA:[],CO:[],CT:[],DC:[],DE:[],FL:[],
		     GA:[],HI:[],IA:[],ID:[],IL:[],IN:[],KS:[],KY:[],LA:[],MA:[],MD:[],ME:[],MI:[],MN:[],
			 MO:[],MS:[],MT:[],NC:[],ND:[],NE:[],NH:[],NJ:[],NM:[],NV:[],NY:[],OH:[],OK:[],OR:[],
			 PA:[],RI:[],SC:[],SD:[],TN:[],TX:[],UT:[],VA:[],VT:[],WA:[],WI:[],WV:[],WY:[]};
        energyArray = [];
        db.all(sql, (err, rows) => {
			
            if(err){
                rej(err);
            }

            rows.forEach((row) => {
                var key = row.state_abbreviation;
                key.toString();
				energyObject[key].push(row[energy]);
            });

            res(energyObject);
        });
    })

}

//-----------------Prev and next function for STATE -------------------------------

function getPrevState(state){
    return new Promise( function(res,rej) {
        var States = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];
        var prevState = "";
        var path = "http://localhost:8000/state/";

        for (i =0; i < States.length; i++){
            if (States[i] === state){
               
                index = (i-1)%51;
                if (States[i] === "AK"){
                    index = 50;
                }
                prevState = prevState + States[index];
            }
        }
     
        prevState = path+prevState;
        res(prevState);
    });
}

function getNextState(state){
    return new Promise( function(res,rej) {
        var States = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];
        var nextState = "";
        var path = "http://localhost:8000/state/";

        for (i =0; i < States.length; i++){
            if (States[i] === state){
               
                index = (i+1)%51; //not sure why mod doesnt work but for if is fine i guess
                //console.log("index" + index);
                if (States[i] === "WY"){
                    index = 0;
                }
                nextState = nextState + States[index];
               // console.log("State" + nextState);
            }
        }
     
        nextState = path+nextState;
        //console.log("path" + nextState);
        res(nextState);
    });
}

//------------------Get prev and next for YEAR------------------------------------

function getPrevYear(year){
    return new Promise( function(res,rej) {
        var Years = [];
        var start = 1960
        var prevYear = 0;
        var index = 0;
        var path = "http://localhost:8000/year/";
        var yearPath = "";

        //create a years array
        for(j = 0; j<58; j++){
            Years.push(start)
            start = start +1;
        }

        for (i =0; i < Years.length; i++){
            if (Years[i].toString() === year){      
                index = (i-1)%58; //not sure why mod doesnt work but for if is fine i guess
                if (Years[i].toString() === "1960"){
                    index = 57;
                }
                prevYear = prevYear + Years[index];
            }
        }
        yearPath = prevYear.toString();
        yearPath = path+yearPath;
        
        res(yearPath);
    });
}

function getNextYear(year){
    return new Promise( function(res,rej) {
        var Years = [];
        var start = 1960
        var nextYear = 0;
        var index = 0;
        var path = "http://localhost:8000/year/";
        var yearPath = "";

        //create a years array
        for(j = 0; j<58; j++){
            Years.push(start)
            start = start +1;
        }

        for (i =0; i < Years.length; i++){
            if (Years[i].toString() === year){      
                index = (i+1)%58; //not sure why mod doesnt work but for if is fine i guess
                if (Years[i].toString() === "2017"){
                    index = 0;
                }
                nextYear = nextYear + Years[index];
            }
        }
        yearPath = nextYear.toString();
        yearPath = path+yearPath;
        
        res(yearPath);
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

//function for table on energy page
function GetConsumptionForEnergyTable(energysource) {
    return new Promise( function(res,rej) {
        let sql = 'SELECT * FROM consumption ORDER BY year';
        var table = "";
        var total = 0;
        db.all(sql, (err, rows) => {
            if(err){
                rej(err);
            }
			
            let i=0;
			let prevYear = 1960;
			//console.log("Rows.length: "+rows.length);
			var rowTotal=0;
			while (i<rows.length){
				if (rows[i].year==prevYear){
					if(i==0){
						table+="<tr>"+"<td>" + rows[i].year+"</td>";
					}

					table += "<td>" +rows[i][energysource] + "</td>";
					rowTotal+=rows[i][energysource];
					//console.log("if: "+rows[i].year);
					//console.log("if i: "+i);
					if(i==2957){
						table+="<td>"+ rowTotal +"</td>" + "</tr>";
					}

				}else{
					//rowTotal += rows[i][energysource];
					table += "<td>"+ rowTotal +"</td>" + "</tr>";
					rowTotal=0;
					table+="<tr>" + "<td>" + rows[i].year + "</td>" + "<td>" + rows[i][energysource] + "</td>";
					//console.log("else: "+rows[i].year);
					//console.log("else i: "+i);
					//rowTotal += rows[i][energysource];
					rowTotal+=rows[i][energysource];
					prevYear += 1;

				}
				//rowTotal=0;
				i++;
			}
        res(table);
    });
});
}


//function for getting full state name from state abbreviation
function GetFullStateName(stateabbrev) {
	if(stateabbrev == 'undefined'){
	
	}
    return new Promise( function(res,rej) {
        let sql = 'SELECT state_name FROM States WHERE state_abbreviation = ?';
        var fullName = "";
        var total = 0;
        db.get(sql, [stateabbrev], (err, row) => {
            if(err){
                rej(err);
            }
            
            var fullName = row.state_name;
            res(fullName)
			
			
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
        var year = req.params.selected_year;

        Promise.all([CoalTestSql(year), NaturalGasTestSql(year), NuclearTestSql(year), PetroleumTestSql(year), RenewableTestSql(year), GetConsumptionForYearTable(year), getPrevYear(year), getNextYear(year)]).then((results) => {

        	if (results[5] == ''){

        		res.writeHead(404, {'Content-Type': 'text/plain'});
    			res.write('Error: No data for year ' + req.params.selected_year);
   				res.end();
        		
        	}
            template = template.toString();
            
            template = template.replace('!YEAR!', req.params.selected_year);
            template = template.replace('!COALCOUNT!', results[0]);
            template = template.replace('!NATURALCOUNT!', results[1]);  
            template = template.replace('!NUCLEARCOUNT!', results[2]);
            template = template.replace('!PETROLEUMCOUNT!', results[3]); 
            template = template.replace('!RENEWABLECOUNT!', results[4]); 
            template = template.replace('!DATAHERE!', results[5]); 

            //prev and next 
            template = template.replace('!PREV!', results[6]); 
            template = template.replace('!NEXT!', results[7]); 

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
        var states = [];
        var flag = false;
        var States = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];
        
        //Checks if user typed in a valid state
        for (i = 0; i <States.length; i++){
            if(States[i] === state){
                flag = true; //it is a real state 
            }
        }

        //If user does not input a real state sends appropriate 404 message
        if (flag != true){
        
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('Error: No data for state '+ state);
            res.end();
        }
        template = template.toString();

        //populate image 
        template = template.replace('noimage', req.params.selected_state);
        template = template.replace('No Image', req.params.selected_state);

        Promise.all([StateCoalTestSql(state), StateNaturalTestSql(state), StateNuclearTestSql(state), StatePetroleumTestSql(state),StateRenewableTestSql(state), GetConsumptionForStateTable(state), GetFullStateName(state), getPrevState(state), getNextState(state)]).then((results) => {
                
            //populate state variables 
            template = template.replace('!COALCOUNT!', results[0]);
            template = template.replace('!NATURALCOUNT!', results[1]);  
            template = template.replace('!NUCLEARCOUNT!', results[2]); 
            template = template.replace('!PETROLEUMCOUNT!', results[3]); 
            template = template.replace('!RENEWABLECOUNT!', results[4]);

            //state table 
            template = template.replace('!DATAHERE!', results[5]); 

            //Full state name 
            template = template.replace('!STATE!', results[6]); 
            template = template.replace('!STATENAME!', results[6]); 

            //pev and next 
            template = template.replace('!PREV!', results[7]);
            template = template.replace('!NEXT!', results[8]);

            let response = template;
            WriteHtml(res, response);

        }).catch((err) => {
        });

    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/energy-type/*'
app.get('/energy-type/:selected_energy_type', (req, res) => {
    ReadFile(path.join(template_dir, 'energy.html')).then((template) => {
        var energy = req.params.selected_energy_type;
        Promise.all([GetConsumptionForEnergyTable(energy),GetEnergyArray(energy)]).then((results) => {
			
			if (results[0].includes('undefined')){

				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.write('Error: No data for energy type '+ req.params.selected_energy_type);
				res.end();
			}

            template = template.toString();
            template = template.replace('!ENERGY!', req.params.selected_energy_type);
            template = template.replace('!ENERGYARRAY!', JSON.stringify(results[1]));
			template = template.replace('!ENERGYTABLEHERE!', JSON.stringify(results[0]));
            //console.log(template);

            //prev and next functionality
       
            if(energy === 'coal'){
              template = template.replace('!PREV!', "http://localhost:8000/energy-type/renewable"); 
              template = template.replace('!NEXT!', "http://localhost:8000/energy-type/natural_gas");  
            }
            else if(energy === 'natural_gas'){
              template = template.replace('!PREV!', "http://localhost:8000/energy-type/coal"); 
              template = template.replace('!NEXT!', "http://localhost:8000/energy-type/nuclear");  
            }
            else if(energy === 'nuclear'){
              template = template.replace('!PREV!', "http://localhost:8000/energy-type/natural_gas"); 
              template = template.replace('!NEXT!', "http://localhost:8000/energy-type/petroleum");  
            }
            else if(energy === 'petroleum'){
              template = template.replace('!PREV!', "http://localhost:8000/energy-type/nuclear"); 
              template = template.replace('!NEXT!', "http://localhost:8000/energy-type/renewable");  
            }
            else{
              template = template.replace('!PREV!', "http://localhost:8000/energy-type/petroleum"); 
              template = template.replace('!NEXT!', "http://localhost:8000/energy-type/coal");  
            }
            


            //images
            template = template.replace('noimage', req.params.selected_energy_type);
            template = template.replace('No Image', req.params.selected_energy_type);

            let response = template;
            WriteHtml(res, response);
        }).catch((err) => {
       
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