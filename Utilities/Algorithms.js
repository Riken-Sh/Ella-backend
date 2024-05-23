

exports.CapitalizeToLowerCaseWithDelimitier = (Value) => (Value.split('').map((Character, Index) => 
    ((Character.match(/[A-Z]/) && Index !== 0) ? ('-') : ('')) + Character )
).join('').toLowerCase();