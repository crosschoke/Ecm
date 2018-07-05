define(function() {
    return {
        sentenceRegister : function(text) {
            var formatedText = text.toLowerCase();
            formatedText = formatedText.charAt(0).toUpperCase() + formatedText.substr(1);
            return formatedText;
        },
        
        fullnameRegister: function(fullname) {
            var fullname = fullname.split(" ");
            var connectedFullname = "";

            for(var j = 0; j < fullname.length; j++) {
                if(j === fullname.length - 1)
                    connectedFullname += this.sentenceRegister(fullname[j]);
                else
                    connectedFullname += this.sentenceRegister(fullname[j]) + " ";
            }
            
            return connectedFullname;
        }
    };
});

