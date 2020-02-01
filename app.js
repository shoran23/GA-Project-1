console.log("Javascript Loaded");

// app object
let app = {
    location: "",
    dbKey: "d9d7c24e535c3576e57a73e1d4093273",
    dbEnvironment: "sandbox",
    endpoint: ""
}

// variables
const setheader = () => {
    XPathResult.setRequestHeader('Authorization', token);
}

const accessDatabase = () => {
    $.ajax({
        url: `https://sandbox-api.brewerydb.com/v2/?key=d9d7c24e535c3576e57a73e1d4093273/`,
        type: "GET",
        datatype: "application/json",
    
    }).done(function(data) {
        console.log(data);
    });
} 



$(() => {
    // DOM loaded
    console.log("DOM Loaded");



    
});
