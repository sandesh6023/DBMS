var mysql  = require('mysql');
var catalog = require('./bookcatalogLib.js').catalog;
var executeFunctionality = {};
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'sandy',
  password : 'sandy',
  database : 'test'
});

connection.connect();

var addRecordToDatabase = function(text){
	var bookInfo = {};
	bookInfo = catalog.getBookCatalogObj(text);
	
	var accessDatabase = function(err, rows, fields){
	      if(err) {
	      	console.log("Record with same isbn already exists"); 
	      	return;
	      }
	      console.log(bookInfo.isbn+' inserted successfully\n');
	}
	connection.query('INSERT INTO book(isbn,price,author,title,publisher) VALUES("'+bookInfo.isbn+'",'+bookInfo.price+',"'+bookInfo.author+'","'+bookInfo.title+'","'+bookInfo.publisher+'")',accessDatabase );
}
var printRecords = function(Records){
	console.log("isbn\tprice\tauthor\ttitle\tpublisher\ttags\n");
		for(var i=0;i<Records.length;i++){
			console.log(Records[i].isbn+"\t"+Records[i].price+"\t"+Records[i].author+"\t"+
				Records[i].title+"\t"+Records[i].publisher+"\t"+Records[i].tags);
		}
}

var displayRecord = function(){
	var data;
	var accessDatabase = function(err,rows,fields){
		if(!rows){
			console.log("No Records to display");
			return;
		}
		data = rows;
		printRecords(data);
	}
	connection.query('select * from book',accessDatabase);
}

var deleteRecord = function(isbn){
	var accessDatabase = function(err,rows,fields){
		console.log("Record successfully deleted");
	}
	connection.query('delete from book where isbn ='+isbn,accessDatabase);
}

var searchUnderAllAttributes = function(searchString){
	var accessDatabase = function(err,rows,fields){
		var data;
		var searchedRecords = [];
		data = rows;
		searchString = searchString.toLowerCase();

		data.forEach(function(element){
			if(element["isbn"].toLowerCase().indexOf(searchString)!=-1 ||
			   element["title"].toLowerCase().indexOf(searchString)!=-1||
			   element["author"].toLowerCase().indexOf(searchString)!=-1 ||
			   element["publisher"].toLowerCase().indexOf(searchString)!=-1)
					searchedRecords.push(element);
		})
		printRecords(searchedRecords);
	}
	connection.query('select * from book',accessDatabase);
}

var searchUnderOneAttribute = function(userInput){
		var accessDatabase = function(err,rows,fields){
		var data;
		var searchString;
		var searchedRecords =[];
		var searchAttribute = userInput.searchAttribute.toString().substr(1);
		searchString = userInput.string.toLowerCase();
		data = rows;

		data.forEach(function(element){
			if(element[searchAttribute].toLowerCase().indexOf(searchString)!=-1)
				searchedRecords.push(element);
		})
		printRecords(searchedRecords);
	}
	connection.query('select * from book',accessDatabase);
}

var updateRecords = function(text){
		var accessDatabase = function(err,rows,fields){
			console.log(rows);
	}
	connection.query('select * from book',accessDatabase);
}
var search = function(userInput){
	if(userInput.searchAttribute.length!=0){
		searchUnderOneAttribute(userInput);
		return;
	}
	searchUnderAllAttributes(userInput.string);
}

var calculateResult = function(input){
	var executeFunctionality = {
		add :function(){
		 addRecordToDatabase(input.string);
		},
		list : function(){
			displayRecord();
		},
		search : function(){
			search(input);
		},
		remove : function(){
			deleteRecord(input.isbn);
		}
	}
	executeFunctionality[input.functionality]();
}

var main = function(){
	var input = catalog.getUserInput(process.argv.slice(2,process.argv.length));
	// console.log(input);
	calculateResult(input);
}
main();

connection.end();