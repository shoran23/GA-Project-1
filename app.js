console.log("Javascript Loaded");


// arrays
let breweryList = [];
let cityList = [];
let typeList = [];


// global variables
let userInput = "";
let $searchResults = $(".search-results");
let currentBrewery = 0;
let state = "";
let showCities = false;
let showZips = false;
let showTypes = false;
let filterResults = false;

// classes
class Brewery {
    constructor(name,type,street,city,state,zip,phone,website,id) {
        this.name = name;
        this.type = type;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phone = phone;
        this.website = website;
        this.id = id;
    };
};

class City {
    constructor(name,amount){
        this.name = name;
        this.amount = amount;
    }
}

class Type {
    constructor(name,amount){
        this.name = name;
        this.amount = amount;
    }
}

// clear brewery list
const clearBreweryList = () => {
    // clear the brewerylist
    breweryList = [];
    // remove all children from the search results div
    $(".search-results").empty();
    filterResults = false;
}

// show brewery information
const showBreweryInfo = (event) => {
    // set current brewery
    $currentBreweryFullId = $(event.currentTarget).attr("id");
    $currentBreweryId = $currentBreweryFullId.substr(9);   // need to rework this
    currentBrewery = Number($currentBreweryId);

    // populate the current brewery information
    $("#name").text(breweryList[currentBrewery].name);
    $("#street").text(breweryList[currentBrewery].street);
    $("#city").text(`${breweryList[currentBrewery].city}, ${breweryList[currentBrewery].state} ${breweryList[currentBrewery].zip}`);
    $("#type").text(breweryList[currentBrewery].type);
    // set phone text
    if(breweryList[currentBrewery].phone.length > 0) {
        $("#phone").text(breweryList[currentBrewery].phone);
    } else {
        $("#phone").text("N/A");
    }
    // remove the old link
    $("#website").empty();
    // append the new link
    let $label = $("<div>").text("Website").addClass("label");
    let $website = $(`<a id="link" target="_blank" href=${breweryList[currentBrewery].website}>${breweryList[currentBrewery].website}</a>`);
    $("#website")
        .append($label)
        .append($website);
    // animate show brewery info
    $(".brewery-info").animate({opacity: "1"});
}

// hide brewery info
const hideBreweryInfo = () => {
    $(".brewery-info").animate({opacity: "0"});
}

// show filter options
const showFilterOptions = () => {
    if(filterResults === true){
        // animate show brewery info
        $(".filter-info").animate({opacity: "1"});
    }
}

// hide filter options
const hideFilterOptions = () => {
    // animate hide filter options
    $(".filter-info").animate({opacity: "0"});
    // hide the filter options
    hideCities();
    hideTypes();
}


// reset results
const resetResults = () => {
    // clear the brewery list
    clearBreweryList();
    // hide the results container
    $(".results-container").css("opacity","0");
}

// show no results
const showNoResults = () => {
    // clear the array
    clearBreweryList();
    // create the no results div
    let $noResults = $("<div>").addClass("result-item");
    $noResults.text("No Results Found");
    // append the no results div to the search results
    $(".search-results").append($noResults);
    // show the brewery list
    $(".results-container").animate({opacity: "1"});
    // hide search in progress
    $(".search-in-progress").animate({opacity: "0"});
    $(".search-in-progress").css("z-index","-1");

}

/* Recreate Brewery List ****************************************************************************************/
const recreateBreweryList = (arr) => {
    $(".search-results").empty();
    for(let i=0;i<arr.length;i++) {
        // create HTML elements
        let $resultItem = $("<div>").addClass("result-item");
        let $resultInfo = $("<div>").addClass("result-info");
        let $resultButton = $(`<button>Get More Info</button>`).attr("id","show-info"+i);
        // append brewery name and city/state to the result info variable
        $resultInfo.append(`<h4>${arr[i].name}</h4>`);
        $resultInfo.append(`<p>${arr[i].city}, ${arr[i].state}</p>`);
        // append result info to result item
        $resultItem.append($resultInfo);
        // append buttom to result item
        $resultItem.append($resultButton);
        // append div to 'search results
        $(".search-results").append($resultItem);
        // set listener on button
        $("#show-info"+i).on("click",showBreweryInfo);
    }
    // show the brewery list
    $(".results-container").animate({opacity: "1"});
    // hide search in progress
    $(".search-in-progress").animate({opacity: "0"});
    $(".search-in-progress").css("z-index","-1");
}

/* filter by city *********************************************************************************************/
const setResultsByCity = (event) => {
    // set current city
    let $currenCityFullId = $(event.currentTarget).attr("id");
    let $currentCityId = $currenCityFullId.substr(4);   // need to rework this
    let currentCity = Number($currentCityId);
    let arr = [];
    // create an array of html elements for the cities
    for(let i=0;i<cityList.length;i++){
        if(breweryList[i].city === cityList[currentCity].name){
            arr.push(breweryList[i]);
        }
    }
    // recreate the brewery listr
    recreateBreweryList(arr);
}
const filterByCity = () => {
    // hide other lists
    hideTypes();
    // clear city list
    cityList = [];
    let uniqueCityList = [];
    // filter cities
    for(let i=0;i<breweryList.length;i++){
        let amount = 0;
        for(let j=0;j<breweryList.length;j++){
            if(breweryList[i].city === breweryList[j].city){
               amount = amount + 1;
            }
        }
        cityList.push(new City(breweryList[i].city,amount));
    }
    // remove duplicates from cityList ======================================

    // append city list to html
    for(let city=0;city<cityList.length;city++){
        let $city = $(`<button>${cityList[city].name} (${cityList[city].amount})</button>`)
            .attr("id","city"+city)
            .addClass("city");
        // append results to city results
        $("#city-results").append($city);
        $("#city"+city).on("click",setResultsByCity);
    }
    // set variable
    showCities = true;
}
const hideCities = () => {
    // remove the city list
    $("#city-results").empty();
    // set variables
    showCities = false;
}
const toggleCities = () => {
    if(showCities === false) {
        filterByCity();
    } else {
        hideCities();
    }
}

/* filter by type *********************************************************************************************/
const setResultsByType = (event) => {
    // set current city
    let $currenCityFullId = $(event.currentTarget).attr("id");
    let $currentCityId = $currenCityFullId.substr(4);   // need to rework this
    let currentType = Number($currentCityId);
    let arr = [];
    // create an array of html elements for the cities
    for(let i=0;i<typeList.length;i++){
        if(breweryList[i].type === typeList[currentType].name){
            arr.push(breweryList[i]);
        }
    }
    // recreate the brewery listr
    recreateBreweryList(arr);
}
const filterByTypes = () => {
    // hide other lists
    hideCities();
    // clear city list
    typeList = [];
    let uniqueTypeList = [];
    // filter cities
    for(let i=0;i<breweryList.length;i++){
        let amount = 0;
        for(let j=0;j<breweryList.length;j++){
            if(breweryList[i].type === breweryList[j].type){
               amount = amount + 1;
            }
        }
        typeList.push(new Type(breweryList[i].type,amount));
    }
    // remove duplicates from cityList ======================================
    // append city list to html
    for(let type=0;type<typeList.length;type++){
        let $type = $(`<button>${typeList[type].name} (${typeList[type].amount})</button>`)
            .attr("id","type"+type)
            .addClass("type");
        // append results to city results
        $("#type-results").append($type);
        $("#type"+type).on("click",setResultsByType);
    }
    // set variable
    showTypes = true;
}

const hideTypes = () => {
    // remove the city list
    $("#type-results").empty();
    // set variables
    showTypes = false;
}

const toggleTypes = () => {
    if(showTypes === false) {
        filterByTypes();
    } else {
        hideTypes();
    }
}
/* create brewery list ***********************************************************************************************/
const createBreweryList = () => {
    // loop through the brewery list
    for(let i=0;i<breweryList.length;i++) {
        // create HTML elements
        let $resultItem = $("<div>").addClass("result-item");
        let $resultInfo = $("<div>").addClass("result-info");
        let $resultButton = $(`<button>Get More Info</button>`).attr("id","show-info"+i);
        // append brewery name and city/state to the result info variable
        $resultInfo.append(`<h4>${breweryList[i].name}</h4>`);
        $resultInfo.append(`<p>${breweryList[i].city}, ${breweryList[i].state}</p>`);
        // append result info to result item
        $resultItem.append($resultInfo);
        // append buttom to result item
        $resultItem.append($resultButton);
        // append div to 'search results
        $(".search-results").append($resultItem);
        // set listener on button
        $("#show-info"+i).on("click",showBreweryInfo);
    }
    // show the brewery list
    $(".results-container").animate({opacity: "1"});
    // hide search in progress
    $(".search-in-progress").animate({opacity: "0"});
    $(".search-in-progress").css("z-index","-1");
    // disable filter results
    filterResults = true;
}

// search database by state
const searchByState = (input) => {
    // clear the current brewery list
    clearBreweryList();
    $.ajax({
        async: true,
        crossDomain: true,
        url: `https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries?by_state=${input}`,
        method: "GET",
        data: {"$limit": 500},
        limit: 200,
        headers: {
            "x-rapidapi-host": "brianiswu-open-brewery-db-v1.p.rapidapi.com",
            "x-rapidapi-key": "b23d5fc7acmsh72f6c5cdd0d0545p1c4890jsndc70e71ceed2"
        }
    }).done(function(data) {
        console.log(data);
        // clear the brewery list
        breweryList = [];
        // create a new list of breweries based on the search
        for(let i=0;i<data.length;i++) {
            // assign data from the return values
            let name = data[i].name;
            let type = data[i].brewery_type;
            let street = data[i].street;
            let city = data[i].city;
            let state = data[i].state;
            let zip = data[i].postal_code;
            let phone = data[i].phone;
            let website = data[i].website_url;
            let id = data[i].id;
            // create the new class object
            let brewery = new Brewery(name,type,street,city,state,zip,phone,website,id);
            // push the class object to the array
            breweryList.push(brewery);
        }
        // create brewery list
        $(".search-in-progress").css("z-index","1");
        $(".search-in-progress").css("opacity","1");
        if(data.length > 0) {
            setTimeout(createBreweryList,2000);
        }
        else {
            setTimeout(showNoResults,2000);
        }
    });
}

const determineStateAbb = (input) => {
    // set input to uppercase
    let inputUpper = input.toUpperCase();
    let state = "";
    // switch between all state possibility
    switch(inputUpper) {
        case "AL": {state = "Alabama";break;}
        case "AK": {state = "Alaska";break;}
        case "AZ": {state = "Arizona";break;}
        case "AR": {state = "Arkansas";break;}
        case "CA": {state = "California";break;}
        case "CO": {state = "Colorado";break;}
        case "CT": {state = "Connecticut";break;}
        case "DE": {state = "Delaware";break;}
        case "FL": {state = "Florida";break;}
        case "GA": {state = "Georgia";break;}
        case "HI": {state = "Hawaii";break;}
        case "ID": {state = "Idaho";break;}
        case "IL": {state = "Illinois";break;}
        case "IN": {state = "Indiana";break;}
        case "IA": {state = "Iowa";break;}
        case "KS": {state = "Kansas";break;}
        case "KY": {state = "Kentucky";break;}
        case "LA": {state = "Louisiana";break;}
        case "ME": {state = "Maine";break;}
        case "MD": {state = "Maryland";break;}
        case "MA": {state = "Massachusetts";break;}
        case "MI": {state = "Michigan";break;}
        case "MN": {state = "Minnesota";break;}
        case "MS": {state = "Mississippi";break;}
        case "MO": {state = "Missouri";break;}
        case "MT": {state = "Montana";break;}
        case "NV": {state = "Nevada";break;}
        case "NH": {state = "New Hampshire";break;};
        case "NJ": {state = "New Jersey";break;}
        case "NM": {state = "New Mexico";break;}
        case "NY": {state = "New York";break;}
        case "NC": {state = "North Carolina";break;}
        case "ND": {state = "North Dakota";break;}
        case "OH": {state = "Ohio";break;}
        case "OK": {state = "Oklahoma";break;}
        case "OR": {state = "Oregon";break;}
        case "PA": {state = "Pennsylvania";break;}
        case "RI": {state = "Rhode Island";break;}
        case "SC": {state = "South Carolina";break;}
        case "TN": {state = "Tennessee";break;}
        case "TX": {state = "Texas";break;}
        case "UT": {state = "Utah";break;}
        case "VA": {state = "Virgina";break;}
        case "VT": {state = "Vermont";break;}
        case "WA": {state = "Washington";break;}
        case "WV": {state = "West Virginia";break;}
        case "WI": {state = "Wisconsin";break;}
        case "WY": {state = "Wyoming";break;}
        case "DC": {state = "District of Columbia";break;}
        default: {state = "Unknown";break;}
    }
    // search by state
    if(state === "Unknown"){
        clearBreweryList();
        $(".search-in-progress").css("z-index","1");
        $(".search-in-progress").css("opacity","1");
        setTimeout(showNoResults,2000);
    } else {
        searchByState(state);
    }
}

// determine search
const determineSearch = () => {
    // get user input
    userInput = $(".search-box").val();
    // use abbreviations
    if(userInput.length === 2) {
        determineStateAbb(userInput)
    }
    else if(userInput.length === 0) {
        $(".search-in-progress").css("z-index","1");
        $(".search-in-progress").css("opacity","1");
        setTimeout(showNoResults,2000);
    }
    else {
        searchByState(userInput);
    }
}

$(() => {
    // DOM loaded
    console.log("DOM Loaded");

    $('.search-button').on("click",determineSearch);
    $('#brewery-close').on("click",hideBreweryInfo);
    $('#results-clear').on("click",resetResults);
    $('#results-filter').on("click",showFilterOptions);
    $('#filter-close').on("click",hideFilterOptions);
    $('#filter-city').on("click",toggleCities);
    $('#filter-type').on("click",toggleTypes);
});
