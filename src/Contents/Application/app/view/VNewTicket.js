App.view.define('VNewTicket', {
    extend: "Ext.window.Window",
    alias: 'widget.TNewTicket',
    initComponent: function() {
        this.width = 800;
        this.height = 600;

        this.layout = {
            type: 'vbox'
        };
        
        this.tbar = [
        {
            html: "Demande d'achat",
            padding: 5
        },
        {
            xtype: 'toggleslide',
			itemId: "DA",
            margin: {
                left: 5  
            },
            onText: 'oui',
            offText: 'non'
        }    
        ];
        
        this.bbar = [
			{
				text: "Annuler",
				itemId: "CancelMe"
			},
			{
				text: "Effacer",
				itemId: "DeleteMe",
				hidden: true
			},
            '->', 
			{
                text: 'Valider',
				itemId: "OK"
            },
			{
				text: "OK",
				itemId: "CloseMe",
				hidden: true
			},
			{
				text: "Clôturer",
				itemId: "ClotureMe",
				hidden: true
			}
        ];
		
        this.defaults = {
            split: true
        };
		
		this.title = "Ticket";
		
        this.items = [
		{
			layout: "hbox",
			width: "100%",
			border: false,
			padding: 10,
			width: "100%",
			frame: false,
			border: false,
			bodyStyle: "background:transparent",
			items: [
			{
				xtype: "combo",
				itemId: "tkDomaine",
				labelAlign: "left",
				fieldLabel: "Domaine",
				store: App.store.create('infocentre://domaine_metier',{autoLoad:true}),
				displayField: "libelle_domaine_metier",
				valueField: "ID_domaine_metier",
				disabled: true,
				editable: false
			},
			{
				flex: 1,
				border: false
			},
			{
				xtype: "datetimefield",
				itemId: "tkDate",
				readOnly: true,
				labelAlign: "top",
				fieldCls: "text_disabled",
				fieldLabel: "Dépôt",
				fieldStyle: 'text-align: center;',
				width: 150
			},
			{
				xtype: "datetimefield",
				itemId: "tkDateAttrib",
				readOnly: true,
				margin: {
					left: 5
				},
				labelAlign: "top",
				fieldCls: "text_disabled",
				fieldLabel: "Attribution",
				fieldStyle: 'text-align: center;',
				width: 150,
				hidden: true
			}			
			]
		},
		// panel du CLI - SII
		{
			layout: "hbox",
			itemId: "CLIPanel1",
			hidden: true,
			width: "100%",
			border: false,
			padding: 10,
			width: "100%",
			frame: false,
			border: false,
			bodyStyle: "background:transparent",
			items: [
			{
				xtype: "combo",
				itemId: "tkEtablissements",
				labelAlign: "top",
				fieldLabel: "Etablissements",
				width: 100,
				store: App.store.create('bpclight://etablissements{Kets,LibEtsC+}?archive=0',{autoLoad:true}),
				displayField: "LibEtsC",
				valueField: "Kets",
				editable: false
			},
			{
				xtype: "combo",
				itemId: "tkDepartements",
				labelAlign: "top",
				margin: {
					left: 10
				},
				width: 100,
				fieldLabel: "Départements",
				store: App.store.create('bpclight://unites{Kuni,LibUniC+}?archive=0',{autoLoad:true}),
				displayField: "LibUniC",
				valueField: "Kuni",
				editable: false			
			},
			{
				xtype: "combo",
				itemId: "tkSubdis",
				margin: {
					left: 10
				},
				width: 100,
				labelAlign: "top",
				fieldLabel: "Services",
				store: App.store.create('bpclight://subdis{Ksub,LibSubC+}?archive=0',{autoLoad:true}),
				displayField: "LibSubC",
				valueField: "Ksub",
				editable: false			
			},
			{
				xtype: "combo",
				itemId: "tkAgents",
				margin: {
					left: 10
				},
				flex: 1,
				labelAlign: "top",
				fieldLabel: "Agents",
				store: App.store.create('bpclight://agents{Kage,nom+" "+prenom=nomprenom+}?actif=1&kuni=-1'),
				displayField: "nomprenom",
				valueField: "Kage",
				editable: false			
			}			
			]
		},
		{
			layout: "hbox",
			itemId: "CLIPanel2",
			hidden: true,
			width: "100%",
			border: false,
			width: "100%",
			frame: false,
			border: false,
			bodyStyle: "background:transparent",
			items: [
			{
				xtype: "combo",
				itemId: "tkCompetences",
				margin: {
					left: 10
				},
				flex: 1,
				labelAlign: "top",
				fieldLabel: "Compétences",
				store: App.store.create('infocentre://competences{id,libelle+}',{autoLoad:true}),
				displayField: "libelle",
				valueField: "id",
				editable: false			
			},
			{
				xtype: "combo",
				itemId: "tkAttribution",
				margin: {
					left: 10,
					right: 10
				},
				flex: 1,
				labelAlign: "top",
				fieldLabel: "Attribution",
				store: App.store.create('infocentre://users{id_agent,nom_agent+}?valid_rayon=1',{autoLoad:true}),
				displayField: "nom_agent",
				valueField: "id_agent",
				editable: false			
			},
			{
				xtype: "checkbox",
				itemId: "tkSurSite",
				margin: {
					left: 10,
					right: 10,
					top: 10
				},
				width: 'auto',
				labelAlign: "right",
    			fieldLabel: "Sur site",
				hidden: true
			}
			]
		},
		{
			height: 20,
			border: false
		},
		{
			xtype: "textfield",
			readOnly: true,
			itemId: "titre",
			labelAlign: "left",
			width: "100%",
			border: false,
			padding: 10,
			fieldLabel: "Titre"
		},
		{
			xtype: "htmleditor",
			readOnly: true,
			itemId: "demande",
			labelAlign: "top",
			padding: 10,
			fieldLabel: "Demande",
			border: false,
			width: "100%",
			flex: 1
		},
		{
			layout: "hbox",
			width: "100%",
			border: false,
			bodyStyle: "background:transparent",
			items: [
			{
				flex: 1,
				border: false
			},
			{
				xtype: 'switchbuttonsegment',
				itemId: "steps",
				padding: 10,
				hidden: true,
				margin: {
					bottom: 10
				},
				items: [
					{
						text: "Posé",
						height:26
					},
					{
						text: "Attribué",
						height:26
					},
					{
						text: "En cours",
						height:26
					},
					{
						text: "Traité",
						height:26
					},
					{
						text: "Clos",
						height:26
					},					
					{
						text: "Sans suite",
						height:26
					}
				]			
			},
			{
				flex: 1,
				border: false
			}			
			]
		}
		];

        this.callParent();
    }
});