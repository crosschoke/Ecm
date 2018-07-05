require([
    "dojo/dom", "dojo/store/Memory",
    "dijit/tree/ObjectStoreModel", "dijit/Tree",
    "dijit/registry", "dijit/layout/ContentPane",
    "app/actionPanel",
    "dojo/dom-construct","dojo","dijit",
    "dijit/layout/TabContainer",
    "app/gridFill",
    "dijit/Dialog",
    "dijit/form/Button",
    "dojo/cookie",
    "app/format"
], function(dom, Memory, ObjectStoreModel, Tree, registry, ContentPane, actionPanel, constructor, dojo, dijit, TabContainer, gridFill, 
    Dialog, Button, Cookie, format){

    var myStore = new Memory({
        data: [
            {id: 'root', name: 'root'},
                {id: 'catalog', name: 'Справочник организации', parent: 'root'},
                    {id: 'orgstructure', name: 'Оргструктура', parent: 'catalog'},
                        {id: 'organizations', name: 'Организации', parent: 'orgstructure'},
                        {id: 'units', name: 'Подразделения', parent: 'orgstructure'},
                    {id: 'employers', name: 'Все сотрудники', parent: 'catalog'},
                {id: 'assignments', name: 'Поручения', parent: 'root'},
                    {id: 'allAssignments', name: 'Все поручения', parent: 'assignments'},
                    {id: 'myAssignments', name: 'Мои поручения', parent: 'assignments'},
                    {id: 'assignmentsForMe', name: 'Поручения мне', parent: 'assignments'}
        ],
        getChildren: function(object){
            return this.query({parent: object.id});
        }
    });
    
    var myModel = new ObjectStoreModel({
        store: myStore,
        query: {id: 'root'}
    });

    var tree = new Tree({
        model: myModel,
        showRoot: false,
        openOnClick: true,
        onClick: function(item, node, event) {
            
            registry.byId('content').destroyRecursive();
            
            var contentTabs = new TabContainer({
                region: "center",
                id: "content",
                tabPosition: "top"
            });

            registry.byId("appLayout").addChild(contentTabs);
            
            
            if(item.id === 'employers') {
                var pane = new ContentPane({
                    id: 'employersTab',
                    title: item.name
                }); 
                registry.byId("content").addChild(pane);  
                
                actionPanel.addActionButtons(pane);
    
                gridFill.fillEmployers(pane);
               
            }
            
            else if(item.id === 'organizations') {
                var pane = new ContentPane({
                    id: 'organizationsTab',
                    title: item.name
                }); 
                registry.byId("content").addChild(pane);  
                
                actionPanel.addActionButtons(pane);
    
                gridFill.fillOrganizations(pane);
            }
            
            else if(item.id === 'units') {
                var pane = new ContentPane({
                    id: 'unitsTab',
                    title: item.name
                }); 
                registry.byId("content").addChild(pane);  
                
                actionPanel.addActionButtons(pane);
    
                gridFill.fillUnits(pane);
            }
            
            else if(item.id === 'allAssignments') {
                var pane = new ContentPane({
                    id: 'allAssignmentsTab',
                    title: item.name
                }); 

                registry.byId("content").addChild(pane);  
                
                actionPanel.addActionButtons(pane);

                gridFill.fillAssignments(pane, "all");
                
                Cookie("selctor","all");
            }
            
            else if(item.id === 'myAssignments' || item.id === "assignmentsForMe") {
                var pane = new ContentPane({
                    id: 'allAssignmentsTab',
                    title: item.name
                }); 

                registry.byId("content").addChild(pane);  
                
                actionPanel.addActionButtons(pane);
                
                var myDialog = new Dialog({
                    id: "dialog",
                    title: "Мои данные",
                    content:   
                    '<label class="addEmployerLabel"><span class="addEmployerSpan">Фамилия</span><input type="text" id="surname" name="Фамилия"></label>' +
                    '<label class="addEmployerLabel"><span class="addEmployerSpan">Имя</span><input type="text" id="name" name="Имя"></label>' +
                    '<label class="addEmployerLabel"><span class="addEmployerSpan">Отчество</span><input type="text" id="patronymic" name="Отчество"></label>' +
                    `<button id="save">Подтвердить</button><button id="close">Закрыть</button>`,
            
                    style: "width:300px;"
                }).show();
                
                var saveBtn = new Button({
                    
                    style: "margin-top: 10px;",
                    
                    onClick: function() {
                        var surname = dom.byId("surname").value;
                        var name = dom.byId("name").value;
                        var patronymic = dom.byId("patronymic").value;
                        
                        var user = format.fullnameRegister(surname + " " + name + " " + patronymic); 
                        var selector = item.id === "myAssignments" ? "my" : "forMe";
                        
                        Cookie("user",user);
                        Cookie("selector", selector);
                        
                        registry.byId("dialog").hide();
                        registry.byId("dialog").destroyRecursive();
                        
                        gridFill.fillAssignments(pane, selector);
                    }
                },"save");
                
                var closeBtn = new Button({
                    style: "margin-top: 10px;",
                    onClick: function() {
                        registry.byId("dialog").hide();
                        registry.byId("dialog").destroyRecursive();
                    }
                },"close");
                
                
            }
            
        }
    });
    
    var list = dom.byId("viewList");
      
    tree.placeAt(list);
    tree.startup();
});

                       



