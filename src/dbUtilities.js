export function handleErrors(err){
    if(err){
        if(!err.errors){
            if(err.message.indexOf('duplicate key error') !== -1){
                var regex = /\bindex:\s+\K\S+/g;
                
                var field = err.message.match(/\bindex:\s+\S+/g);
        
                var thisMatch = field[0];
                var indexRemoved = thisMatch.replace("index: ", "");
                var fieldName = indexRemoved.split("_")[0];

                return [`An account with that ${fieldName} already exists!`];
            }
            return ["Unknown error occurred"];
        }

        var readableErrors = []

        Object.keys(err.errors).forEach(function(key) {
            var element = err.errors[key].properties;
            var errorString = "";
            if(element.type == "required"){
                errorString = `${element.path} is required!`
            }
            readableErrors.push(errorString);
        }, this);

        return readableErrors;
    }
}