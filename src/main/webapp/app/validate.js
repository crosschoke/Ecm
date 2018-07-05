define(function () {
    
    function validateCommonField(text) {
        var response = {};
        if(text.value.length >=2 && text.value.length <=100) {
            response.code = 1;
            response.text = "OK";
            return response;
        }
        else {
            response.code = 0;
            response.text = `Поле \"${text.name}\" имеет недопустимую длину`;
            response.fieldId = text.id;
            return response;
        }
    }


    function validateTextField(field) {
        var response = {};

        if(field.value.length === 0)
            return {code: 0, text: `Заполните поле \"${field.name}\"`, fieldId: field.id};

        var test = field.value.match(/[A-zА-я]/g).length;


        if(test === field.value.length && test >=2 && test <= 30) {
            response.code = 1;
            response.text = "OK";
        }
        else {
            response.code = 0;
            if(test !== field.value.length) {
                response.text = `Поле \"${field.name}\" содержит недопустимые символы`;
                response.fieldId = field.id;
            }
            else {
                response.text = `Поле \"${field.name}\" содержит недопустимое количество символов`;   
                response.fieldId = field.id;
            }
        }

        return response; 
    }
    
    function validateText(text, field) {
        var response = {};

        if(text.length === 0)
            return {code: 0, text: `Заполните поле \"${field.name}\"`, fieldId: field.id};

        var test = text.match(/[A-zА-я]/g).length;


        if(test === text.length && test >=2 && test <= 30) {
            response.code = 1;
            response.text = "OK";
        }
        else {
            response.code = 0;
            if(test !== text.length) {
                response.text = `Поле \"${field.name}\" содержит недопустимые символы`;
                response.fieldId = field.id;
            }
            else {
                response.text = `Поле \"${field.name}\" содержит недопустимое количество символов`;   
                response.fieldId = field.id;
            }
        }

        return response; 
    }
    
    function validateFullname(data, field) {
        var response = {};
        
        var fullname = data.split(" ");
        
        if(fullname.length !== 3) {
                response.code = 0;
                response.text = `Поле \"${field.name}\" заполнено неверно. Поле должно содержать фамилию, имя и отчество. Пример заполнения: \"Сидоров Иван Иванович\"`;
                response.fieldId = field.id;
                return response;
        }
        else {
            var checkSurname = validateText(fullname[0], field);
            var checkName = validateText(fullname[1], field);
            var checkPatronymic = validateText(fullname[2], field);

            if(checkSurname.code === 1 && checkName.code === 1 && checkPatronymic.code === 1) {
                return {code: 1, text: "OK"};
            }
            else {
                response.code = 0;
                
                if(checkSurname.code === 0) {
                    response.text = `Поле \"${field.name}\" заполнено неверно. Фамилия содержит недопустимые символы, либо имеет недопустимую длину`;
                }
                else if(checkName.code === 0) {
                    response.text = `Поле \"${field.name}\" заполнено неверно. Имя содержит недопустимые символы, либо имеет недопустимую длину`;
                }
                else {
                    response.text = `Поле \"${field.name}\" заполнено неверно. Отчество содержит недопустимые символы, либо имеет недопустимую длину`;
                }
                
                response.fieldId = field.id;
                return response;
            }  
        }
    }
    
    function validateExecutors(executors) {
        var response = {};
        var authorsArray = executors.value.split(";");
        
        for(var i = 0; i < authorsArray.length; i++) {
            var parts = authorsArray[i].split(" ");
            if(parts.length !== 3) {
                response.code = 0;
                response.text = `Поле \"${executors.name}\" заполнено неверно. Пример заполнения: \"Сидоров Иван Иванович;Пупкин Василий Васильевич\"`;
                response.fieldId = executors.id;
                return response;
            }
        }
       
        for(var i = 0; i < authorsArray.length; i++) {
            response = validateFullname(authorsArray[i], executors);
            
            if(response.code === 0) {
                return response;
            }  
        }
        
        response.code = 1;
        response.text = "OK";
        return response;
    }
    

    return {
        validateEmployerForm: function(surname, name, patronymic, post) {
            var checkSurname = validateTextField(surname);
            var checkName = validateTextField(name);
            var checkPatronymic = validateTextField(patronymic);
            var checkpost = validateTextField(post);

            if(checkSurname.code === 1 && checkName.code === 1 && checkPatronymic.code === 1 && checkpost.code === 1) {
                return {code: 1, text: "OK"};
            }
            else {
                if(checkSurname.code === 0)
                    return checkSurname;
                else if(checkName.code === 0)
                    return checkName;
                else if(checkPatronymic.code === 0)
                    return checkPatronymic;
                else
                    return checkpost;
            }    
        },
        
        validateAssignmentForm: function(subject, author, executor) {
            var checkSubject = validateCommonField(subject);
            var checkAuthor = validateFullname(author.value,author);
            var checkExecutor = validateExecutors(executor);
            
            if(checkSubject.code === 1 && checkAuthor.code === 1 && checkExecutor.code === 1) {
                return {code: 1, text: "OK"};
            }
            else {
                if(checkSubject.code === 0)
                    return checkSubject;
                else if(checkAuthor.code === 0)
                    return checkAuthor;
                else
                    return checkExecutor;
            }
        },
        
        validateOrganizationForm: function(name, physAddress, jurAddress, head) {
            var checkName = validateCommonField(name);
            var checkPhysAddress = validateCommonField(physAddress);
            var checkJurAddress = validateCommonField(jurAddress);
            var checkHead = validateFullname(head.value, head);
            
            if(checkName.code === 1 && checkPhysAddress.code === 1 && checkJurAddress.code === 1 && checkHead.code === 1) {
                return {code: 1, text: "OK"};
            }
            else {
                if(checkName.code === 0)
                    return checkName;
                else if(checkPhysAddress.code === 0)
                    return checkPhysAddress;
                else if(checkJurAddress.code === 0)
                    return checkJurAddress;
                else {
                    return checkHead;
                }
            }
            
        },
        
        validateUnitForm: function(name, contactDetails, head, organization) {
            var checkName = validateCommonField(name);
            var checkContactDetails = validateCommonField(contactDetails);
            var checkHead = validateFullname(head.value, head);
            var checkOrganization = validateCommonField(organization);
            
            if(checkName.code === 1 && checkContactDetails.code === 1 && checkHead.code === 1 && checkOrganization.code === 1) {
                return {code: 1, text: "OK"};
            }
            else {
                if(checkName.code === 0)
                    return checkName;
                else if(checkContactDetails.code === 0)
                    return checkContactDetails;
                else if(checkHead.code === 0)
                    return checkHead;
                else {
                    return checkOrganization;
                }
            }  
        }
        
        
    };
});

