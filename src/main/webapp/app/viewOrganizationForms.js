define(function() {
    return {
        addForm: function(pane, grid) {
            var argsCount = arguments.length;
            
            var oldName;
            var oldPhysAddress;
            var oldJurAddress;
            var oldHead;

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
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Название организации</span><input type="text" id="name" class="assignmentTextField" name="Название организации"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Физический адрес</span><input type="text" id="physAddress" class="assignmentTextField" name="Физический адрес"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Юридический адрес</span><input type="text" id="jurAddress" class="assignmentTextField" name="Юридический адрес"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Руководитель</span><input type="text" id="head" class="assignmentTextField" name="Руководитель"></label>';

            }
            else {
                var rowId = grid.select.row.getSelected();
                var data = grid.store.data[rowId];
                
                oldName = data['name'];
                oldPhysAddress = data['physAddress'];
                oldJurAddress = data['jurAddress'];
                oldHead = data['head'];
                
                var html =
                    `<button id="${btnId}">Сохранить</button><button id="${closeBtnId}">Закрыть</button>` +     
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Название организации</span><input type="text" id="name" class="assignmentTextField" name="Название организации" value="${oldName}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Физический адрес</span><input type="text" id="physAddress" class="assignmentTextField" name="Физический адрес" value="${oldPhysAddress}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Юридический адрес</span><input type="text" id="jurAddress" class="assignmentTextField" name="Юридический адрес" value="${oldJurAddress}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Руководитель</span><input type="text" id="head" class="assignmentTextField" name="Руководитель" value="${oldHead}"></label>`; 
        
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
                    var physAddress = dom.byId("physAddress");
                    physAddress.style = "background-color: white";
                    var jurAddress = dom.byId("jurAddress");
                    jurAddress.style = "background-color: white";
                    var head = dom.byId("head");
                    head.style = "background-color: white";

                    var response = Validator.validateOrganizationForm(name, physAddress, jurAddress, head);

                    if(response.code === 1) {
                        
                        var formatedName = format.sentenceRegister(name.value);
                        var formatedPhysAddress = format.sentenceRegister(physAddress.value);
                        var formatedJurAddress = format.sentenceRegister(jurAddress.value);
                        var formatedHead = format.fullnameRegister(head.value);

                        if (argsCount === 1) {

                            var organizationData = {
                                name: formatedName,
                                physAddress: formatedPhysAddress,
                                jurAddress: formatedJurAddress,
                                head: formatedHead
                            };                            
                            
                            var jsonData = JSON.stringify(organizationData);
       
                            request.post("views/organizations/add", {
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
                                            content: "Новая организация добавлена",
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
                                    physAddress: oldPhysAddress,
                                    jurAddress: oldJurAddress,
                                    head: oldHead
                                },
                                newRecord: {
                                    name: formatedName,
                                    physAddress: formatedPhysAddress,
                                    jurAddress: formatedJurAddress,
                                    head: formatedHead
                                }
                            };
                            
                            var jsonData = JSON.stringify(data);
                            
                            request.post("views/organizations/edit", {
                                data: jsonData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                                function(response){
                                    var myDialog = new Dialog({
                                        title: "Изменения внесены",
                                        content: "Данные организвции изменены",
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

