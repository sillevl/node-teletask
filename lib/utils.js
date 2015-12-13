

exports.getKey = function( value , group) {
    var that = (typeof(group) === 'undefined') ? this : this[group];
    for( var prop in that ) {
        if( that.hasOwnProperty( prop ) ) {
             if( that[ prop ] === value )
                 return prop;
        }
    }
}
