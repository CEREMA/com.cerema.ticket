App.view.define('VMain', {

    extend: 'Ext.Panel',
	alias : 'widget.mainform',
	border: false,
	
	layout: "border",
	
	items: [
		{
			region: 'north',
			height: 25,
			minHeight: 25,
			border:false,
			baseCls: 'cls-header',
			xtype: "Menu",
			itemId: "MenuPanel",
			menu: [
			]		
		},
		{
			region: "center",			
			split:true,
			layout: "vbox",
			items: [
				{
					xtype: "grid",
					flex: 1,
					itemId: "maingrid",
					width: "100%",
					columns: [
						{
							width: 30,
							dataIndex: "DA",
							renderer: function(value) {
								if (value) return '<div class="buy">';
							}
						},
						{
							text: "Id",
							width: 30,
							dataIndex: "id",
							renderer: function(value) {
								if (!value) var value="";
								var prepend='<div style="padding:3px"><b>';
								var append='</b></div>';
								return prepend+value+append;
							}
						},						
						{
							text: "Demandeur",
							width: 200,
							dataIndex: "agent_nom",
							renderer: function(value) {
								var prepend='<div style="padding:3px">';
								var append='</div>';
								return prepend+value+append;
							}							
						},
						{
							text: "Service",
							width: 50,
							dataIndex: "agent_service",
							renderer: function(value) {
								var prepend='<div style="padding:3px">';
								var append='</div>';
								return prepend+value+append;
							}				
						},
						{
							text: "Titre",
							flex: 1,
							dataIndex: "titre",
							renderer: function(value) {
								var prepend='<div style="padding:3px">';
								var append='</div>';
								return prepend+value+append;
							}
						},
						{
							text: "Déposé le",
							dataIndex: "date_depot",
							width: 150,
							type: 'date',
							renderer: function(value) {
								var prepend='<div style="padding:3px"><b>';
								var append='</b></div>';
								return prepend+value.toString('dd/MM/yyyy HH:mm')+append;
							}
						},
						{
							text: "Pris en charge le",
							dataIndex: "date_attrib",
							width: 150,
							type: 'date',
							renderer: function(value) {
								if (!value) var value="";
								var prepend='<div style="padding:3px"><b>';
								var append='</b></div>';
								return prepend+value.toString('dd/MM/yyyy HH:mm')+append;
							}
						},
						{
							text: "Compétence",
							dataIndex: "competence_display",
							width: 150,
							renderer: function(value) {
								if (!value) var value="";
								var prepend='<div style="padding:3px">';
								var append='</div>';
								return prepend+value+append;
							}
						},
						{
							text: "Technicien",
							dataIndex: "attrib_nom",
							width: 200,
							renderer: function(value) {
								if (!value) var value="";
								var prepend='<div style="padding:3px">';
								var append='</div>';
								return prepend+value+append;
							}
						},
						{
							text: "Etat",
							width: 40,
							dataIndex: "state",
							renderer: function(x) {
								var result="";
								var prepend='<div style="padding:3px">';
								var append='</div>';
								if (x==-1) result="<span style='color:red'>Sans suite</span>";
								if (x==1) result="Posé";
								if (x==2) result="Attribué";
								if (x==3) result="En cours";
								if (x==4) result="Traité";
								if (x==5) result="Clos";
								return prepend+result+append;
							}
						},
						{
							text: "",
							width: 150,
							dataIndex: "state",
							renderer: function(value, meta, record){
								if (value==-1) return "";
								if(value == null){
									value = 0;
								};              
								pt = (value*100/5)/100;
								var id = Ext.id();
								Ext.defer(function (id,pt) {
									var p = Ext.create('Ext.ProgressBar',{
										renderTo: id,
										animate: true,
										width: '100%',
										value: pt,
										text: (pt*100)+"%",
									});                        
								}, 50, undefined, [id,pt]);
								return "<div id='" + id + "'></div>";
							}
						}
					],
					features: [
						{
							groupHeaderTpl: 'Département: {name}',
							ftype: 'groupingsummary'
						}
					],					
					store: App.store.create("App.Demandes.toutes",{
						groupField: "agent_departement"
					}),
					tbar: [
					{
						xtype: "button",
						itemId: "btnNew",
						scale: 'large',
						iconCls: 'btnNew',
						text: "Nouveau ticket"
					}
					],
                    bbar: [
                    {
                        xtype: "checkbox",
                        itemId: "cbArchive",
                        boxLabel: "Archive",
                        padding: 4
                    },
                    {
                        xtype: "checkbox",
                        itemId: "cbNew",
                        boxLabel: "Nouveaux tickets",
                        padding: 4
                    },
                    {
                        xtype: "checkbox",
                        itemId: "cbMyTickets",
                        boxLabel: "Mes tickets",
                        padding: 4
                    }
                    ]
				}
			]
		}
	]
	
});
