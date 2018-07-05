define(function() {
    return {
        addForm: function(pane, grid) {
            var argsCount = arguments.length;
            var oldSubject;
            var oldAuthor;
            var oldExecutor;
            var oldDate;
            var oldControl;
            var oldExecution;
            var oldText;
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
            
            var controlId = "control" + argsCount;
            var executionId = "execution" + argsCount;
            //var executorId = "executor" + argsCount;
            var dateId = "date" + argsCount;
            var textId = "text" + argsCount;
            
            if(argsCount === 1) {
                var html =
                    `<button id="${btnId}">Сохранить</button><button id="${closeBtnId}">Закрыть</button>` +     
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Предмет поручения</span><input type="text" id="subject" class="assignmentTextField" name="Предмет поручения"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Автор поручения</span><input type="text" id="author" class="assignmentTextField" name="Автор поручения"></label>' +
                    '<label class="addAssignmentLabel"><span class="addAssignmentSpan">Исполнители поручения</span><textarea wrap="soft" id="executor" class="assignmentTextField" name="Исполнители поручения"></textarea></label>' +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Срок исполнения</span><input id="${dateId}" name="Срок исполнения"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Признак контрольности</span><input id="${controlId}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Признак исполнения</span><input id="${executionId}"></label>` +
                    `<div class="editorContainer"><span class="editorSpan">Текст поручения</span><div id="${textId}" style="display: inline-block;"></div></div>`;

            }
            else {
                var rowId = grid.select.row.getSelected();
                var data = grid.store.data[rowId];
                
                oldSubject = data['subject'];
                oldAuthor = data['author'];
                oldExecutor = data['executor'];
                oldDate = data['date'];
                oldControl = data['controlAttribute'];
                oldExecution = data['executionAttribute'] === "Исполнено" ? "executed" : "notExecuted" ;
                         
                var html =
                    `<button id="${btnId}">Сохранить</button><button id="${closeBtnId}">Закрыть</button>` +     
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Предмет поручения</span><input type="text" id="subject" class="assignmentTextField" name="Предмет поручения" value="${oldSubject}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Автор поручения</span><input type="text" id="author" class="assignmentTextField" name="Автор поручения" value="${oldAuthor}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Исполнители поручения</span><textarea wrap="soft" id="executor" class="assignmentTextField" name="Исполнитель поручения">${oldExecutor}</textarea></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Срок исполнения</span><input id="${dateId}" name="Срок исполнения" ></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Признак контрольности</span><input id="${controlId}"></label>` +
                    `<label class="addAssignmentLabel"><span class="addAssignmentSpan">Признак исполнения</span><input id="${executionId}"></label>` +
                    `<div class="editorContainer"><span class="editorSpan">Текст поручения</span><div id="${textId}" style="display: inline-block;"></div></div>`;  
        }  
            constructor.create("div", {
                id: "addEmployerForm",
                innerHTML: html     
            }, container);
            
            var date = new DateTextBox({
            }, dateId);
            if(argsCount > 1)
                date.set("displayedValue", oldDate);
            else
                date.set("value", new Date());
            date.startup();
            
            var box = new CheckBox({
                checked: oldControl === "false" ? false : true
            }, controlId);
            box.startup();

            var sel = new Select({
                options: [
                    { label: "Не исполнено", value: "notExecuted", selected: (oldExecution === "Не исполнено" || argsCount === 1) ? true : false },
                    { label: "Исполнено", value: "executed", selected: oldExecution === "Исполнено" ? true : false}
                ]
            }, executionId);
            sel.startup();
            
            var editor = new Editor({
                style: "width: 600px; height: 300px;"
            }, textId);
            
            if(argsCount > 1) {
                var assignment = {
                    subject: oldSubject,
                    author: oldAuthor
                };
                var jsonAssignment = JSON.stringify(assignment);

                request.post("views/assignments/getAssignmentText", {
                    data: jsonAssignment,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(
                    function(response){
                        oldText = response;
                        editor.set("value", oldText);
                    }
                );
            }
            editor.startup();

            var addButton = new Button({
                style: "margin-right: 20px;",
                onClick: function(){
                    var subject = dom.byId("subject");
                    subject.style = "background-color: white";
                    var author = dom.byId("author");
                    author.style = "background-color: white";
                    var executor = dom.byId("executor");
                    executor.style = "background-color: white";
                    var date = dom.byId(dateId);
                    date.style = "background-color: white";
                    var control = registry.byId(controlId);
                    var execution = registry.byId(executionId);
                    var text = registry.byId(textId);

                    var response = Validator.validateAssignmentForm(subject, author, executor);

                    if(response.code === 1) {
                        
                        var formatedSubject = format.sentenceRegister(subject.value);
                        var formatedAuthor = format.fullnameRegister(author.value);
                        var formatedExecutor = "";
                        
                        var executorList = executor.value.split(";");
                        for(var i = 0; i < executorList.length; i++) {
                            
                            var fullname = executorList[i].split(" ");
                            var connectedFullname = "";
                            
                            for(var j = 0; j < fullname.length; j++) {
                                if(j === fullname.length - 1)
                                    connectedFullname += format.sentenceRegister(fullname[j]);
                                else
                                    connectedFullname += format.sentenceRegister(fullname[j]) + " ";
                            }
                            
                            if(i === executorList.length - 1)
                                formatedExecutor += connectedFullname;
                            else
                                formatedExecutor += connectedFullname + ";";
                        }

                        if (argsCount === 1) {

                            var assignmentData = {
                                subject: formatedSubject,
                                author: formatedAuthor,
                                executor: formatedExecutor,
                                date: date.value,
                                control: control.checked,
                                execution: execution.attr("value"),
                                text: text.attr("value")
                            };                            
                            
                            var jsonAssignmentData = JSON.stringify(assignmentData);
       
                            request.post("views/assignments/addAssignment", {
                                data: jsonAssignmentData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                                function(response){
                                    
                                    if(response === "OK") {
                                        gridFill.updateAssignments("all");
                                        var myDialog = new Dialog({
                                            title: "Изменения внесены",
                                            content: "Новое поручение добавлено",
                                            style: "width:200px;"
                                        }).show();
                                    }
                                    else {
                                        var myDialog = new Dialog({
                                            title: "Ошибка",
                                            content: "Такого автора не существует",
                                            style: "width:200px;"
                                        }).show();
                                    }
                                }
                            );
                        }                   
                        else {
                            
                            var data = {
                                oldRecord: {
                                    subject: oldSubject,
                                    author: oldAuthor,
                                    executor: oldExecutor,
                                    date: oldDate,
                                    control: oldControl,
                                    execution: oldExecution,
                                    text: oldText 
                                },
                                newRecord: {
                                    subject: formatedSubject,
                                    author: formatedAuthor,
                                    executor: formatedExecutor,
                                    date: date.value,
                                    control: control.checked,
                                    execution: execution.attr("value"),
                                    text: text.attr("value")
                                }
                            };
                            
                            var jsonEmployerData = JSON.stringify(data);
                            
                            request.post("views/assignments/editAssignment", {
                                data: jsonEmployerData,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }).then(
                                function(response){
                                    var myDialog = new Dialog({
                                        title: "Изменения внесены",
                                        content: "Данные поручения изменены",
                                        style: "width:200px;"
                                    }).show();
                                    gridFill.updateAssignments();
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


