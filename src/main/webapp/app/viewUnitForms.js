define(function() {
    return {
        addForm: function(pane, grid) {
            var argsCount = arguments.length;
            
            var oldName;
            var oldContactDetails;
            var oldHead;
            var oldOrganization;

        require([
        "dijit/form/Button", "dojo/dom-construct",
        "dojo/dom", "dijit/Dialog",
        "dojo/request", "app/validate",
        "dijit/registry", "app/gridFill",
        "dijit/form/DateTextBox", "dijit/form/CheckBox",
        "dijit/form/Select", "dijit/Editor",
        "dijit/registry", "app/format"
    ], function(Button, constructor, dom, Dialog, request, Validator, registry, gridFill, DateTextBox, CheckBox, Select, Editor, registry, format) {
            var container = pane.id;

            var btnId = "saveButton" + argsCount;
            var closeBtnId = "closeButton" + argsCount;
           
            if(argsCount === 1) {
                var html =
                    `<button id="${btnId}">Сохранить</button><button id="${closeBtnId}">Закрыть</button>` +     
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Название подрразделения</span><input type="text" id="name" class="assignmentTextField" name="Название подрразделения"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Контактные данные</span><input type="text" id="contactDetails" class="assignmentTextField" name="Контактные данные"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Руководитель</span><input type="text" id="head" class="assignmentTextField" name="Руководитель"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Организация</span><input type="text" id="organization" class="assignmentTextField" name="Организация"></label>';

            }
            else {
                var rowId = grid.select.row.getSelected();
                var data = grid.store.data[rowId];
                
                oldName = data['name'];
                oldContactDetails = data['contactDetails'];
                oldHead = data['head'],
                oldOrganization = data['organization'];
                
                var html =
                    `<button id="${btnId}">Сохранить</button><button id="${closeBtnId}">Закрыть</button>` +     
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Название подрразделения</span><input type="text" id="name" class="assignmentTextField" name="Название подрразделения" value="${oldName}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Контактные данные</span><input type="text" id="contactDetails" class="assignmentTextField" name="Контактные данные" value="${oldContactDetails}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Руководитель</span><input type="text" id="head" class="assignmentTextField" name="Руководитель" value="${oldHead}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Организация</span><input type="text" id="organization" class="assignmentTextField" name="Организация" value="${oldOrganization}"></label>`;

            }  
            
            constructor.create("div", {
                id: "addEmployerForm",
                innerHTML: html     
            }, container);
            

            var addButton = new Button({
                style: "margin-right: 20px;",
                onClick: function(){
                    var name = dom.byId("name");
                    name.style = "background-color: white";
                    var contactDetails = dom.byId("contactDetails");
                    contactDetails.style = "background-color: white";
                    var head = dom.byId("head");
                    head.style = "background-color: white";
                    var organization = dom.byId("organization");
                    organization.style = "background-color: white";

                    var response = Validator.validateUnitForm(name, contactDetails, head, organization);

                    if(response.code === 1) {
                        
                        var formatedName = format.sentenceRegister(name.value);
                        var formatedContactDetails = format.sentenceRegister(contactDetails.value);
                        var formatedHead = format.fullnameRegister(head.value);
                        var formatedOrganization = format.sentenceRegister(organization.value);

                        if (argsCount === 1) {

                            var organizationData = {
                                name: formatedName,
                                contactDetails: formatedContactDetails,
                                head: formatedHead,
                                organization: formatedOrganization
                            };                            
                            alert(formatedContactDetails);
                            var jsonData = JSON.stringify(organizationData);
       
                            request.post("views/units/add", {
                                data: jsonData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                                function(response){
                                    
                                    if(response === "OK") {
                                        gridFill.updateOrganizations();
                                        var myDialog = new Dialog({
                                            title: "Изменения внесены",
                                            content: "Новое подразделение добавлено",
                                            style: "width:200px;"
                                        }).show();
                                    }
                                    else {
                                        var myDialog = new Dialog({
                                            title: "Ошибка",
                                            content: "Такого сотрудника не существует",
                                            style: "width:200px;"
                                        }).show();
                                    }
                                }
                            );
                        }    
                        
                        else {
                            
                            var data = { 
                                oldRecord: {
                                    name: oldName,
                                    contactDetails: oldContactDetails,
                                    head: oldHead,
                                    organization: oldOrganization
                                },
                                newRecord: {
                                    name: formatedName,
                                    contactDetails: formatedContactDetails,
                                    head: formatedHead,
                                    organization: formatedOrganization
                                }
                            };
                            
                            var jsonData = JSON.stringify(data);
                            
                            request.post("views/units/edit", {
                                data: jsonData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                                function(response){
                                    var myDialog = new Dialog({
                                        title: "Изменения внесены",
                                        content: "Данные подразделения изменены",
                                        style: "width:200px;"
                                    }).show();
                                    gridFill.updateOrganizations();
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

            addButton.startup();
            
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

