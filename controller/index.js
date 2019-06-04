/**
 * Created by Nagion on 2016. 10. 5..
 */

var GoogleUrl = require( 'google-url' );

googleUrl = new GoogleUrl( { key: '----------------------------' });


exports.urlShortener=function(req,res) {
    googleUrl.shorten( "https://developers.google.com/api-client-library/php/auth/api-keys", function( err, shortUrl ) {
        res.render("index", {
            title : "URLSHORTENED!",
            urlShortened : shortUrl
        });
    } );
};


