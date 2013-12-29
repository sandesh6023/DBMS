var catalog = {};

catalog.getBookCatalogObj = function(text){
	var bookCatalogObj = {};
	var bookAttributes = ['isbn','price','author','title','publisher','tags'];
	
	var convert_element_to_object = function(element,index,book){
		key = element.split(':');
		var assignValuesToAttribute = function(attribute){
			if(key[0].indexOf(attribute)!=-1) bookCatalogObj[attribute]=key[1].trim();
		}
		bookAttributes.forEach(assignValuesToAttribute);
	};
	var BreakBookInfo = text.split(';');
	BreakBookInfo.forEach(convert_element_to_object);
	bookCatalogObj.tags = '';
	return bookCatalogObj;
};


var createCallBack = function(option)
{
	return function(text)
	{
		return text == option;
	}
};


catalog.getUserInput =function(args)
{
	var result = {
		functionality:null,
		searchAttribute:false
	};
	if(args.length==0) console.log("Enter record and command");

	result.functionality = args.filter(createCallBack('add')).toString();
	if(result.functionality == 'add'){
		result.string = args[1];
		return result;
	}

	result.functionality = args.filter(createCallBack('list')).toString();
		if(result.functionality == 'list') return result;

	//remove	
	result.functionality = args.filter(createCallBack('remove')).toString();
		if(result.functionality =='remove'){
			result.isbn = args[2];
			return result;
		}


	// search
	result.functionality = args.filter(createCallBack('search')).toString();
	result.searchAttribute = args.filter(createCallBack('-title'));
	if(result['searchAttribute'].length==0)
		result['searchAttribute'] = args.filter(createCallBack('-author'));
	if(result['searchAttribute'].length==0)
		result['searchAttribute'] = args.filter(createCallBack('-publisher'));
	if(result['searchAttribute'].length==0)
		result['searchAttribute'] = args.filter(createCallBack('-tag'));

	if(result.functionality == 'search'){
		if(result.searchAttribute.length!=0){
			result.string = args[2];
				return result;
		}
		result.string = args[1];
		return result;
	}
};


exports.catalog = catalog;