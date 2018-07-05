define(function() {
    return {
        addForm: function(pane, grid) {
            var argsCount = arguments.length;
            var oldName;
            var oldSurname;
            var oldPost;
            var oldPatronymic;
        require([
        "dijit/form/Button",
        "dojo/dom-construct",
        "dojo/dom",
        "dijit/Dialog",
        "dojo/request",
        "app/validate",
        "dijit/registry",
        "app/gridFill",
        "app/format"
    ], function(Button, constructor, dom, Dialog, request, Validator, registry, gridFill, format) {
            var container = pane.id;
            var btnId = "saveButton" + argsCount;
            var closeBtnId = "closeButton" + argsCount;

            if(argsCount === 1) {
                var html =
                    `<button id="${btnId}">Сохранить</button><button id="${closeBtnId}">Закрыть</button>` +     
                    '<label class="addEmployerLabel"><span class="addEmployerSpan">Фамилия</span><input type="text" id="surname" name="Фамилия"></label>' +
                    '<label class="addEmployerLabel"><span class="addEmployerSpan">Имя</span><input type="text" id="name" name="Имя"></label>' +
                    '<label class="addEmployerLabel"><span class="addEmployerSpan">Отчество</span><input type="text" id="patronymic" name="Отчество"></label>' +
                    '<label class="addEmployerLabel"><span class="addEmployerSpan">Должность</span><input type="text" id="post" name="Должность"></label>';

            }
            else {
                var rowId = grid.select.row.getSelected();
                var data = grid.store.data[rowId];
                
                oldSurname = data['surname'];
                oldName = data['name'];
                oldPost = data['post'];
                oldPatronymic = data['patronymic'];
                
                
                var html =  
                    `<button id="${btnId}">Сохранить</button><button id="${closeBtnId}">Закрыть</button>` +       
                    `<label class="addEmployerLabel"><span class="addEmployerSpan">Фамилия</span><input type="text" id="surname" name="Фамилия" value=${oldSurname}></label>` +
                    `<label class="addEmployerLabel"><span class="addEmployerSpan">Имя</span><input type="text" id="name" name="Имя" value=${oldName}></label>` +
                    `<label class="addEmployerLabel"><span class="addEmployerSpan">Отчество</span><input type="text" id="patronymic" name="Отчество" value=${oldPatronymic}></label>` +
                    `<label class="addEmployerLabel"><span class="addEmployerSpan">Должность</span><input type="text" id="post" name="Должность" value=${oldPost}></label>`;
                    
                }
            constructor.create("div", {
                id: "addEmployerForm",
                innerHTML: html     
            }, container);

            var saveButton = new Button({
                style: "margin-right: 20px;",
                onClick: function(){
                    var surname = dom.byId("surname");
                    surname.style = "background-color: white";
                    var name = dom.byId("name");
                    name.style = "background-color: white";
                    var patronymic = dom.byId("patronymic");
                    patronymic.style = "background-color: white";
                    var post = dom.byId("post");
                    post.style = "background-color: white";

                    var response = Validator.validateEmployerForm(surname, name, patronymic, post);

                    if(response.code === 1) {

                        var formatedSurname = format.sentenceRegister(surname.value);
                        var formatedName = format.sentenceRegister(name.value);
                        var formatedPatronymic = format.sentenceRegister(patronymic.value);
                        var formatedPost = format.sentenceRegister(post.value);

                        if (argsCount === 1) {
                            
                            var employerData = {
                                surname: formatedSurname,
                                name: formatedName,
                                patronymic: formatedPatronymic,
                                post: formatedPost
                            };

                            var jsonEmployerData = JSON.stringify(employerData);
                            
                            request.post("views/employers/addEmployer", {
                                data: jsonEmployerData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                                function(response){
                                    
                                    var text;
                                    
                                    if(response === "OK") {
                                        text = "Новый сотрудник добавлен";
                                        gridFill.updateEmployers();
                                    }
                                    else
                                        text = "Ошибка - такой сотрудник уже существует";
                                    
                                    var myDialog = new Dialog({
                                        title: "Результат",
                                        content: text,
                                        style: "width:200px;"
                                    }).show();
                                    

                                }
                            );
                        }
                        else {
                            
                            var data = {
                                oldRecord: {
                                    surname: oldSurname,
                                    name: oldName,
                                    patronymic: oldPatronymic,
                                    post: oldPost
                                },
                                newRecord: {
                                    surname: formatedSurname,
                                    name: formatedName,
                                    patronymic: formatedPatronymic,
                                    post: formatedPost
                                }
                            };
                            
                            var jsonEmployerData = JSON.stringify(data);
                            
                            request.post("views/employers/editEmployer", {
                                data: jsonEmployerData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                                function(response){
                                    var myDialog = new Dialog({
                                        title: "Изменения внесены",
                                        content: "Данные сотрудника изменены",
                                        style: "width:200px;"
                                    }).show();
                                    gridFill.updateEmployers();
                                }
                            );
                        }
                        
                    }
                    else {       
                        var errorField = dom.byId(response.fieldId);
                        errorField.style = "background-color: salmon";

                        var myDialog = new Dialog({
                            title: "Ошибка",
                            content: response.text,
                            style: "width:200px;"
                        }).show();
                    }
                }
            }, btnId);

            saveButton.startup();
            
            var closeButton = new Button({
                onClick: function() {
                   
                    var tc = registry.byId("content");
                    tc.removeChild(tc.selectedChildWidget);
                    registry.byId(pane.id).destroyRecursive();
                }
            }, closeBtnId);
            
            closeButton.startup();
            
            });    
        }
    };
});

