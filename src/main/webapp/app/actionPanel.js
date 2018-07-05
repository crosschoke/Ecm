define(function() {
    return {
        addActionButtons(tab) {
            require([
        "dijit/form/Button",
        "dijit/registry", 
        "dijit/layout/ContentPane",
        "app/viewEmployerForms",
        "app/viewAssignmentForms",
        "app/viewOrganizationForms",
        "app/viewUnitForms",
        "dijit/Dialog",
        "dojo/request",
        "app/gridFill",
        "dojo/dom-construct",
        "dojo/dom-attr"
    ], function(Button, registry, ContentPane, viewEmployerForm, viewAssignmentForm, viewOrganizationForm, viewUnitForms, Dialog, request, 
        gridFill, constructor, domAttr){
        
        var createButton = new Button({
            label: "Создать",
            onClick: function(){
                if(tab.id === 'employersTab') {
                    if(registry.byId("addEmployerTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'addEmployerTab',
                            title: "Добавить сотрудника"
                        }); 
                        registry.byId("content").addChild(pane);

                        registry.byId("content").selectChild(pane);

                        viewEmployerForm.addForm(pane);
                    }
                }
                
                else if(tab.id === 'allAssignmentsTab') {
                    if(registry.byId("addAssignmentTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'addAssignmentTab',
                            title: "Добавить поручение"
                        }); 
                        registry.byId("content").addChild(pane);

                        registry.byId("content").selectChild(pane);

                        viewAssignmentForm.addForm(pane);
                    }
                }
                
                else if(tab.id === 'organizationsTab') {
                    if(registry.byId("addOrganizationTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'addOrganizationTab',
                            title: "Добавить организацию"
                        }); 
                        registry.byId("content").addChild(pane);

                        registry.byId("content").selectChild(pane);

                        viewOrganizationForm.addForm(pane);
                    }
                }
                
                else if(tab.id === "unitsTab") {
                    if(registry.byId("addUnitTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'addUnitTab',
                            title: "Добавить подразделение"
                        }); 
                        registry.byId("content").addChild(pane);

                        registry.byId("content").selectChild(pane);

                        viewUnitForms.addForm(pane);
                    }
                }
            }
        });
        
        createButton.placeAt(tab);
        createButton.startup();
        
        var editButton = new Button({
            id: "editActionButton",
            disabled: true,
            label: "Изменить",
            onClick: function(){ 
                if(tab.id === 'employersTab') {
                    if(registry.byId("editEmployerTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'editEmployerTab',
                            title: "Изменить запись"
                        }); 

                        registry.byId("content").addChild(pane);
                        registry.byId("content").selectChild(pane);
                        
                        var grid = registry.byId("grid");

                        viewEmployerForm.addForm(pane, grid);
                    }
                }
                else if(tab.id === 'allAssignmentsTab') {
                    if(registry.byId("editAssignmentTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'editAssignmentTab',
                            title: "Изменить запись"
                        }); 

                        registry.byId("content").addChild(pane);
                        registry.byId("content").selectChild(pane);
                        
                        var grid = registry.byId("grid");

                        viewAssignmentForm.addForm(pane, grid);
                    }
                }
                else if(tab.id === 'organizationsTab') {
                    if(registry.byId("editOrganizationTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'editOrganizationTab',
                            title: "Изменить запись"
                        }); 

                        registry.byId("content").addChild(pane);
                        registry.byId("content").selectChild(pane);
                        
                        var grid = registry.byId("grid");

                        viewOrganizationForm.addForm(pane, grid);
                    }
                }
                
                else if(tab.id === "unitsTab") {
                    if(registry.byId("editUnitTab") === undefined) {
                        var pane = new ContentPane({
                            id: 'editUnitTab',
                            title: "Изменить запись"
                        }); 

                        registry.byId("content").addChild(pane);
                        registry.byId("content").selectChild(pane);
                        
                        var grid = registry.byId("grid");

                        viewUnitForms.addForm(pane, grid);
                    }
                }
            }
        }); 
        
        editButton.placeAt(tab);
        editButton.startup();
        
        var deleteButton = new Button({
            id: "deleteActionButton",
            disabled: true,
            label: "Удалить",
            onClick: function(){ 
                var myDialog = registry.byId("dialog");
                
                var content;
                if(tab.id === 'employersTab') {
                    content = "Вы хотите удалить сотрудника?";
                }
                else if(tab.id === 'assignmentsTab') {
                    content = "Вы хотите удалить поручение?";
                }
                else if(tab.id === 'organizationsTab') {
                    content = "Вы хотите удалить организацию?";
                }
                else if(tab.id === "unitsTab"){
                    content = "Вы хотите удалить подразделение?";
                }
                
                if(myDialog === undefined) {
                    myDialog = new Dialog({
                        id: "dialog",
                        title: "Подтверждение",
                        content: content +
                                '<button id="yesButton">Да</button><button id="noButton">Нет</button>'
                        ,
                        style: "width:200px;"
                    }).show();  
                }
                else {
                    myDialog.show();
                }   
                
                var yesBtn = new Button({
                    style: "margin-right: 100px; margin-top: 10px;",
                    onClick: function() {

                        var grid = registry.byId("grid");
                        var rowId = grid.select.row.getSelected();
                        var data = grid.store.data[rowId];
                        
                        if(tab.id === "employersTab") {
                            var name = grid.cell(rowId, 1).data();
                            var surname = grid.cell(rowId, 0).data();
                            var patronymic = grid.cell(rowId, 2).data();
                            var post = grid.cell(rowId, 3).data();

                            var dataObject = {
                                surname: surname,
                                name: name,
                                patronymic: patronymic,
                                post: post
                            };
                            
                            var address = "views/employers/delete";
                        }
                        
                        else if(tab.id === "assignmentsTab") {
                            var subject = grid.cell(rowId, 0).data();
                            var author = grid.cell(rowId, 1).data();

                            var dataObject = {
                                subject: subject,
                                author: author,
                            };
                            
                            var address = "views/assignments/delete";
                        }
                        
                        else if(tab.id === "organizationsTab") {
                            var name = grid.cell(rowId, 0).data();
                    
                            var dataObject = {
                                name: name,
                            };
                            
                            var address = "views/organizations/delete";
                        }
                        
                        else if(tab.id === "unitsTab") {
                            var name = grid.cell(rowId, 0).data();
                            
                            var dataObject = {
                                name: name,
                            };
                            
                            var address = "views/units/delete";
                        }
                        

                        var jsonEmployerData = JSON.stringify(dataObject);

                        var deferred = request.post(address, {
                            data: jsonEmployerData,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });

                        deferred.then(function(res){
                            
                            if(tab.id === "employersTab")
                                gridFill.updateEmployers();
                            else if(tab.id === "assignmentsTab")
                                gridFill.updateAssignments("all");
                            else if(tab.id === "organizationsTab")
                                gridFill.updateOrganizations();
                            else if(tab.id === "unitsTab")
                                gridFill.updateUnits();
                            
                            registry.byId("dialog").hide();
                            registry.byId("dialog").destroyRecursive();

                        });
                    }
                },"yesButton");
                
                var noBtn = new Button({
                    style: "margin-top: 10px;",
                    onClick: function() {
                        registry.byId("dialog").hide();
                    }
                },"noButton");
            }
        });
        
        
        /*
        var deleteButton = new Button({
            id: "deleteActionButton",
            disabled: true,
            label: "Удалить",
            onClick: function(){ 
                
                if(tab.id === 'employersTab') {
                    var myDialog = registry.byId("dialog");
                    if(myDialog === undefined) {
                        myDialog = new Dialog({
                            id: "dialog",
                            title: "Подтверждение",
                            content: "Вы хотите удалить сотрудника?" +
                                    '<button id="yesButton">Да</button><button id="noButton">Нет</button>'
                            ,
                            style: "width:200px;"
                        }).show();
                    
                        var yesBtn = new Button({
                            style: "margin-right: 100px; margin-top: 10px;",
                            onClick: function() {
                                
                                var grid = registry.byId("grid");
                                var rowId = grid.select.row.getSelected();
                                var data = grid.store.data[rowId];
                                
                                var name = grid.cell(rowId, 1).data();
                                var surname = grid.cell(rowId, 0).data();
                                var patronymic = grid.cell(rowId, 2).data();
                                var post = grid.cell(rowId, 3).data();
                              
                                var employerData = {
                                    surname: surname,
                                    name: name,
                                    patronymic: patronymic,
                                    post: post
                                };

                                var jsonEmployerData = JSON.stringify(employerData);

                                var deferred = request.post("views/employers/delete", {
                                    data: jsonEmployerData,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });

                                deferred.then(function(res){
                                    gridFill.updateEmployers();
                                    registry.byId("dialog").hide();
                                    
                                    registry.byId("dialog").destroyRecursive();
                                    
                                });
                            }
                        },"yesButton");
                    
                        var noBtn = new Button({
                            style: "margin-top: 10px;",
                            onClick: function() {
                                registry.byId("dialog").hide();
                                registry.byId("dialog").destroyRecursive();
                            }
                        },"noButton");
                    }
                       
                    else {
                        myDialog.show();
                    }      
                }
                
                else if(tab.id === "allAssignmentsTab") {
                    var myDialog = registry.byId("dialog");
                    if(myDialog === undefined) {
                        myDialog = new Dialog({
                            id: "dialog",
                            title: "Подтверждение",
                            content: "Вы хотите удалить поручение?" +
                                    '<button id="yesButton">Да</button><button id="noButton">Нет</button>'
                            ,
                            style: "width:200px;"
                        }).show();
                    
                        var yesBtn = new Button({
                            style: "margin-right: 100px; margin-top: 10px;",
                            onClick: function() {
                                
                                var grid = registry.byId("grid");
                                var rowId = grid.select.row.getSelected();
                                var data = grid.store.data[rowId];
                                
                                var subject = grid.cell(rowId, 0).data();
                                var author = grid.cell(rowId, 1).data();
                                  
                                var assignmentData = {
                                    subject: subject,
                                    author: author,
                                };

                                var jsonEmployerData = JSON.stringify(assignmentData);

                                var deferred = request.post("views/assignments/delete", {
                                    data: jsonEmployerData,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                });

                                deferred.then(function(res){
                                    gridFill.updateAssignments("all");
                                    registry.byId("dialog").hide();
                                });
                            }
                        },"yesButton");
                    
                        var noBtn = new Button({
                            style: "margin-top: 10px;",
                            onClick: function() {
                                registry.byId("dialog").hide();
                            }
                        },"noButton");
                    }
                       
                    else {
                        myDialog.show();
                    }                       
                }
            }
        });
        */
        deleteButton.placeAt(tab);
        deleteButton.startup();
        
        /*
        var div = constructor.create("div", null, tab.id);
        div.id = "findDiv";
        
        var findButton = new Button({
            label: "Поиск"
        });
    
        findButton.placeAt(div);
        findButton.startup();
        
        var findField = constructor.create("input", null, div.id);
        findField.id = "findField";
        domAttr.set(findField, "type", "text");
        */
        });
        }
    };
});
