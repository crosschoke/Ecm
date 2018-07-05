define(function() {
    return {
        fillEmployers: function(pane) {
             require([
                "dojo/store/Memory",
                "gridx/Grid",
                "gridx/core/model/cache/Async",
                "dojo/request",
                "dojo/_base/array",
                "app/viewEmployerForms",
                "dijit/registry",
                "dijit/layout/ContentPane",
                "gridx/modules/extendedSelect/Row",
                "gridx/modules/Filter",
                "gridx/modules/filter/FilterBar",
                "gridx/modules/SingleSort"
            ], function(Memory, Grid, Cache, request, array, viewForm, registry, ContentPane, ExtendedSelectRow, Filter, FilterBar, SingleSort){

                    var structure = [
                        { id: 'surname', field: 'surname', name: 'Фамилия'},
                        { id: 'name', field: 'name', name: 'Имя'},
                        { id: 'patronymic', field: 'patronymic', name: 'Отчество'},
                        { id: 'post', field: 'post', name: 'Должность'}
                    ];

                    var store = new Memory();

                     var deferred = request.get("views/employers/all", {
                        handleAs: "json"
                    });

                    deferred.then(function(data){
                        array.forEach(data, function(item,i){
                                var obj = {id: i, surname: item.surname, name: item.name, patronymic: item.patronymic, post: item.post};
                                store.put(obj);
                            });
                            var grid = Grid({
                                id: 'grid',
                                cacheClass: Cache,
                                store: store,
                                structure: structure,
                                modules: [
                                    ExtendedSelectRow,
                                    Filter,
                                    FilterBar,
                                    SingleSort
                                ],
                                selectRowTriggerOnCell: true,
                                bodyRowHoverEffect: false
                            });

                            grid.on("rowClick", function(evt) {
                                var editBtn = registry.byId("editActionButton");
                                var deleteBtn = registry.byId("deleteActionButton");
                                if(editBtn.disabled === true)
                                    editBtn.setDisabled(false);
                                if(deleteBtn.disabled === true)
                                    deleteBtn.setDisabled(false);
                                //else if()
                                   // editBtn.setDisabled(true);
                            });

                            grid.on("rowDblClick", function(evt) {
                                if(registry.byId("editEmployerTab") === undefined) {
                                    var tab = new ContentPane({
                                        id: 'editEmployerTab',
                                        title: "Изменить запись"
                                    }); 

                                    registry.byId("content").addChild(tab);
                                    registry.byId("content").selectChild(tab);

                                    viewForm.addForm(tab, grid);
                                }
                            });
                            grid.placeAt(pane);

                            grid.startup();
                    });
                });
        },
        
        fillOrganizations: function(pane) {
            require([
                "dojo/store/Memory",
                "gridx/Grid",
                "gridx/core/model/cache/Async",
                "dojo/request",
                "dojo/_base/array",
                "app/viewOrganizationForms",
                "dijit/registry",
                "dijit/layout/ContentPane",
                "gridx/modules/extendedSelect/Row",
                "gridx/modules/Filter",
                "gridx/modules/filter/FilterBar",
                "gridx/modules/SingleSort"
            ], function(Memory, Grid, Cache, request, array, viewForm, registry, ContentPane, ExtendedSelectRow, Filter, FilterBar, SingleSort) {
                var structure = [
                        { id: 'name', field: 'name', name: 'Организация'},
                        { id: 'physAddress', field: 'physAddress', name: 'Физический адрес'},
                        { id: 'jurAddress', field: 'jurAddress', name: 'Юридический адрес'},
                        { id: 'head', field: 'head', name: 'Руководитель'},
                        { id: 'units', field: 'units', name: 'Подразделения'}
                    ];

                var store = new Memory();

                var deferred = request.get("views/organizations/all", {
                    handleAs: "json"
                });

                deferred.then(function(data){
                    array.forEach(data, function(item,i){
                            var obj = {id: i, name: item.name, physAddress: item.physAddress, jurAddress: item.jurAddress, head: item.head, units: item.units};
                            store.put(obj);
                        });
                        var grid = Grid({
                            id: 'grid',
                            cacheClass: Cache,
                            store: store,
                            structure: structure,
                            modules: [
                                ExtendedSelectRow, 
                                Filter, 
                                FilterBar, 
                                SingleSort
                            ],
                            selectRowTriggerOnCell: true,
                            bodyRowHoverEffect: false
                        });

                        grid.on("rowClick", function(evt) {
                            var editBtn = registry.byId("editActionButton");
                            var deleteBtn = registry.byId("deleteActionButton");
                            if(editBtn.disabled === true)
                                editBtn.setDisabled(false);
                            if(deleteBtn.disabled === true)
                                deleteBtn.setDisabled(false);
                            //else if()
                               // editBtn.setDisabled(true);
                        });

                        grid.on("rowDblClick", function(evt) {
                            if(registry.byId("editOrganizationsTab") === undefined) {
                                var tab = new ContentPane({
                                    id: 'editOrganizationsTab',
                                    title: "Изменить запись"
                                }); 

                                registry.byId("content").addChild(tab);
                                registry.byId("content").selectChild(tab);

                                viewForm.addForm(tab, grid);
                            }
                        });
                        grid.placeAt(pane);

                        grid.startup();    
                });
            });
        },
        
        fillAssignments: function(pane, selector) {
            require([
                "dojo/store/Memory",
                "gridx/Grid",
                "gridx/core/model/cache/Async",
                "dojo/request",
                "dojo/_base/array",
                "app/viewAssignmentForms",
                "dijit/registry",
                "dijit/layout/ContentPane",
                "gridx/modules/extendedSelect/Row",
                "gridx/modules/Filter",
                "gridx/modules/filter/FilterBar",
                "gridx/modules/SingleSort",
                "gridx/modules/CellWidget",
                "dojo/cookie"
            ], function(Memory, Grid, Cache, request, array, viewForm, registry, ContentPane, ExtendedSelectRow, Filter, FilterBar, SingleSort, 
                CellWidget, Cookie) {
            
                var structure = [
                        { id: 'subject', field: 'subject', name: 'Предмет поручения'},
                        { id: 'author', field: 'author', name: 'Автор поручения'},
                        { id: 'executor', field: 'executor', name: 'Исполнители поручения'},
                        { id: 'date', field: 'date', name: 'Срок исполнения'},
                        { id: 'controlAttribute', field: 'controlAttribute', name: 'Признак контрольности',
                            widgetsInCell: true,
                            decorator: function(){
				return [
					'<span data-dojo-type="dijit.form.CheckBox" ',
						'data-dojo-attach-point="cb" ',
						'data-dojo-props="readOnly: true"',
					'></span>'
				].join('');
			},
			setCellValue: function(data){
				this.cb.set('checked', data === "false" ? false : true);
			}
                        },
                        { id: 'executionAttribute', field: 'executionAttribute', name: 'Признак исполнения'}
                    ];

                var store = new Memory();
               
               var getBody;
               if(selector === "all") {
                    getBody = `views/assignments/${selector}/null`;
                }
                else if(selector === "my") {
                    getBody = `views/assignments/myAssignments/${Cookie("user")}`;
                }
                else if(selector === "forMe") {
                    getBody = `views/assignments/assignmentsForMe/${Cookie("user")}`;
                }
               
                var deferred = request.get(getBody, {
                        handleAs: "json"
                });
                
                deferred.then(function(data){
                    
                    array.forEach(data, function(item,i){
                        var execution = item.executionAttribute === "executed" ? "Исполнено" : "Не исполнено";
                        var dateParts = item.executionDate.split("-");
                        var fDate = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
                        var obj = {id: i, subject: item.subject, author: item.author, executor: item.executors, date: fDate,
                            controlAttribute: item.controlAttribute, executionAttribute: execution};  
                        store.put(obj);
                    });
                        
                    var grid = Grid({
                        id: 'grid',
                        cacheClass: Cache,
                        store: store,
                        structure: structure,
                        modules: [
                            ExtendedSelectRow,
                            Filter,
                            FilterBar,
                            SingleSort,
                            CellWidget
                        ],
                        selectRowTriggerOnCell: true,
                        bodyRowHoverEffect: false
                    });

                    grid.on("rowClick", function(evt) {
                        var editBtn = registry.byId("editActionButton");
                        var deleteBtn = registry.byId("deleteActionButton");
                        if(editBtn.disabled === true)
                            editBtn.setDisabled(false);
                        if(deleteBtn.disabled === true)
                            deleteBtn.setDisabled(false);
                        //else if()
                           // editBtn.setDisabled(true);
                    });

                    grid.on("rowDblClick", function(evt) {
                        if(registry.byId("editAssignmentTab") === undefined) {
                            var tab = new ContentPane({
                                id: 'editAssignmentTab',
                                title: "Изменить запись"
                            }); 

                            registry.byId("content").addChild(tab);
                            registry.byId("content").selectChild(tab);

                            viewForm.addForm(tab, grid);
                        }
                    });
                    grid.placeAt(pane);
                    grid.startup();    
                });
            });
        },
        
        fillUnits: function(pane) {
            require([
                "dojo/store/Memory",
                "gridx/Grid",
                "gridx/core/model/cache/Async",
                "dojo/request",
                "dojo/_base/array",
                "app/viewUnitForms",
                "dijit/registry",
                "dijit/layout/ContentPane",
                "gridx/modules/extendedSelect/Row",
                "gridx/modules/Filter",
                "gridx/modules/filter/FilterBar",
                "gridx/modules/SingleSort"
            ], function(Memory, Grid, Cache, request, array, viewForm, registry, ContentPane, ExtendedSelectRow, Filter, FilterBar, SingleSort) {
                var structure = [
                        { id: 'name', field: 'name', name: 'Подзразделение'},
                        { id: 'contactDetails', field: 'contactDetails', name: 'Контактные данные'},
                        { id: 'head', field: 'head', name: 'Руководитель'},
                        { id: 'organization', field: 'organization', name: 'Организация'}
                    ];

                var store = new Memory();

                var deferred = request.get("views/units/all", {
                    handleAs: "json"
                });

                deferred.then(function(data){
                    array.forEach(data, function(item,i){
                            var obj = {id: i, name: item.name, contactDetails: item.contactDetails, head: item.head, organization: item.organization};
                            store.put(obj);
                        });
                        var grid = Grid({
                            id: 'grid',
                            cacheClass: Cache,
                            store: store,
                            structure: structure,
                            modules: [
                                ExtendedSelectRow, 
                                Filter, 
                                FilterBar, 
                                SingleSort
                            ],
                            selectRowTriggerOnCell: true,
                            bodyRowHoverEffect: false
                        });

                        grid.on("rowClick", function(evt) {
                            var editBtn = registry.byId("editActionButton");
                            var deleteBtn = registry.byId("deleteActionButton");
                            if(editBtn.disabled === true)
                                editBtn.setDisabled(false);
                            if(deleteBtn.disabled === true)
                                deleteBtn.setDisabled(false);
                            //else if()
                               // editBtn.setDisabled(true);
                        });

                        grid.on("rowDblClick", function(evt) {
                            if(registry.byId("editUnitTab") === undefined) {
                                var tab = new ContentPane({
                                    id: 'editUnitTab',
                                    title: "Изменить запись"
                                }); 

                                registry.byId("content").addChild(tab);
                                registry.byId("content").selectChild(tab);

                                viewForm.addForm(tab, grid);
                            }
                        });
                        grid.placeAt(pane);

                        grid.startup();    
                });
            });
        },
        
        updateEmployers: function() {
            require([
              "dojo/_base/array",
              "dojo/request",
              "dojo/store/Memory",
              "dijit/registry"
            ], function(array, request, Memory, registry) {

                var store = new Memory();
                var grid = registry.byId('grid');

                var deferred = request.get("views/employers/all", {
                            handleAs: "json"
                        });
                
                deferred.then(function(data){
                    array.forEach(data, function(item,i){
                            var obj = {id: i, surname: item.surname, name: item.name, patronymic: item.patronymic, post: item.post};
                            store.put(obj);
                        });
        
                    grid.model.clearCache();
                    grid.model.setStore(store);
                    grid.body.refresh();

                });
            });            
        },
        
        updateAssignments: function() {
            require([
              "dojo/_base/array",
              "dojo/request",
              "dojo/store/Memory",
              "dijit/registry",
              "dojo/cookie"
            ], function(array, request, Memory, registry, Cookie) {

                var store = new Memory();
                var grid = registry.byId('grid');
                
                var selector = Cookie("selector");
                
 
                var getBody;
                if(selector === "all") {
                    getBody = `views/assignments/${selector}/null`;
                }
                else if(selector === "my") {
                    getBody = `views/assignments/myAssignments/${Cookie("user")}`;
                }
                else if(selector === "forMe") {
                    getBody = `views/assignments/assignmentsForMe/${Cookie("user")}`;
                }
            
                var deferred = request.get(getBody, {
                    handleAs: "json"
                });

                
                deferred.then(function(data){
                    array.forEach(data, function(item,i){
                        var execution = item.executionAttribute === "executed" ? "Исполнено" : "Не исполнено";
                        var dateParts = item.executionDate.split("-");
                        var fDate = dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
                        var obj = {id: i, subject: item.subject, author: item.author, executor: item.executors, date: fDate,
                            controlAttribute: item.controlAttribute, executionAttribute: execution};  
                        store.put(obj);
                    });
        
                    grid.model.clearCache();
                    grid.model.setStore(store);
                    grid.body.refresh();

                });
            });               
        },
        
        updateOrganizations: function() {
            require([
              "dojo/_base/array",
              "dojo/request",
              "dojo/store/Memory",
              "dijit/registry"
            ], function(array, request, Memory, registry) {

                var store = new Memory();
                var grid = registry.byId('grid');

                var deferred = request.get(`views/organizations/all`, {
                    handleAs: "json"
                });
                
                
                deferred.then(function(data){
                    array.forEach(data, function(item,i){
                        
                        var obj = {id: i, name: item.name, physAddress: item.physAddress, jurAddress: item.jurAddress, head: item.head};
                        
                        store.put(obj);
                        
                    });
        
                    grid.model.clearCache();
                    grid.model.setStore(store);
                    grid.body.refresh();

                });
            });
        },
        
        updateUnits: function() {
            require([
              "dojo/_base/array",
              "dojo/request",
              "dojo/store/Memory",
              "dijit/registry"
            ], function(array, request, Memory, registry) {

                var store = new Memory();
                var grid = registry.byId('grid');

                var deferred = request.get(`views/units/all`, {
                    handleAs: "json"
                });
                
                
                deferred.then(function(data){
                    array.forEach(data, function(item,i){
                        
                        var obj = {id: i, name: item.name, contactDetails: item.contactDetails, head: item.head, organization: item.organization};
                        
                        store.put(obj);
                        
                    });
        
                    grid.model.clearCache();
                    grid.model.setStore(store);
                    grid.body.refresh();

                });
            });
        }
    };
});


