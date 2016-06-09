App.controller.define('CMain', {

	views: [
		"VMain",
		"VNewTicket"
	],
	
	models: [
	],
	
	init: function()
	{
		var me=this;
		this.control({
			"menu>menuitem": {
				click: "Menu_onClick"
			},
			"mainform button#btnNew": {
				click: "on_newticket"
			},
			"mainform grid#maingrid": {
				itemdblclick: "on_click_grid"
			},
            "mainform checkbox#cbArchive": {
                change: "cbArchive_onchange"  
            },
            "mainform checkbox#cbNew": {
                change: "cbNew_onchange"  
            },			
            "mainform checkbox#cbMyTickets": {
                change: "cbMyTickets_onchange"  
            },			
			"TNewTicket": {
				show: "TNewTicket_onshow"
			},
			"TNewTicket combo#tkEtablissements": {
				select: "tkEtablissements_select"
			},
			"TNewTicket combo#tkDepartements": {
				select: "tkDepartements_select"
			},
			"TNewTicket combo#tkSubdis": {
				select: "tkSubdis_select"
			},
			"TNewTicket button#OK": {
				click: "ticket_valid"
			},
			"TNewTicket button#CloseMe": {
				click: "closeme_handle"
			},
			"TNewTicket button#CancelMe": {
				click: "closeme_handle"
			},
			"TNewTicket button#ClotureMe": {
				click: "clotureme_handle"
			},
			"TNewTicket switchbuttonsegment#steps": {
				change: "steps_change"
			}
		});
		
		App.init('VMain',function() {
			me.onLoad(me);
		});
		
	},
    display: function(o) {
        this.ItemID=o.id;
    },
    cbArchive_onchange: function(cb,newval,oldval) {
        var extraParams=App.get('mainform grid#maingrid').getStore().getProxy().extraParams;
        if (newval) {
			App.get("mainform checkbox#cbMyTickets").setValue(false);
			App.get("mainform checkbox#cbNew").setValue(false);
            var store=App.store.create('App.Demandes.toutes_archives',{groupField: "agent_departement"});
            store.getProxy().extraParams=extraParams;
            App.get('mainform grid#maingrid').bindStore(store);
        } else {
            var store=App.store.create('App.Demandes.toutes',{groupField: "agent_departement"});
            store.getProxy().extraParams=extraParams;
            App.get('mainform grid#maingrid').bindStore(store);            
        };
        App.get('mainform grid#maingrid').getStore().load();
    },
	cbMyTickets_onchange: function(cb,newval,oldval) {
        var extraParams=App.get('mainform grid#maingrid').getStore().getProxy().extraParams;
        if (newval) {
			App.get("mainform checkbox#cbNew").setValue(false);
			App.get("mainform checkbox#cbArchive").setValue(false);
            var store=App.store.create('App.Demandes.mytickets',{groupField: "agent_departement"});
            store.getProxy().extraParams=extraParams;
			store.getProxy().extraParams.id=Auth.User.uid;
            App.get('mainform grid#maingrid').bindStore(store);
        } else {
            var store=App.store.create('App.Demandes.toutes',{groupField: "agent_departement"});
            store.getProxy().extraParams=extraParams;
            App.get('mainform grid#maingrid').bindStore(store);            
        };
        App.get('mainform grid#maingrid').getStore().load();
    },
    cbNew_onchange: function(cb,newval,oldval) {
        var extraParams=App.get('mainform grid#maingrid').getStore().getProxy().extraParams;
        if (newval) {
			App.get("mainform checkbox#cbArchive").setValue(false);
			App.get("mainform checkbox#cbMyTickets").setValue(false);
            var store=App.store.create('App.Demandes.news',{groupField: "agent_departement"});
            store.getProxy().extraParams=extraParams;
            App.get('mainform grid#maingrid').bindStore(store);
        } else {
            var store=App.store.create('App.Demandes.toutes',{groupField: "agent_departement"});
            store.getProxy().extraParams=extraParams;
            App.get('mainform grid#maingrid').bindStore(store);            
        };
        App.get('mainform grid#maingrid').getStore().load();
    },
	steps_change: function(p) {
		App.DB.get('infocentre://ticket?id='+p.up('window').data.id,function(e,v) {
			var d=v.result.data[0];
			if (d.state==4) {
				if ((d.attrib==Auth.User.uid) || (Auth.User.profiles.indexOf('GEST')>-1)) {
					if (App.get('TNewTicket switchbuttonsegment#steps').activeItem==4) {
					
					} else {
						App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(4);
					};
					return;
				};			
			};
			if (d.state==3) {
				if ((d.attrib==Auth.User.uid) || (Auth.User.profiles.indexOf('GEST')>-1)) {
					if ((App.get('TNewTicket switchbuttonsegment#steps').activeItem==3) || (App.get('TNewTicket switchbuttonsegment#steps').activeItem==5)) {
					
					} else {
						App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(2);
					};
					return;
				};
			};
			if (d.state!=-1) App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(d.state-1); else App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(5);
		});
	},
	clotureme_handle: function(z)
	{
		var p=z.up('window');
		var me=this;	
		App.DB.post('infocentre://ticket',{
			id: p.data.id,
			state: 5
		},function(e,r) {
			App.get('TNewTicket').close();
			App.notify('Votre ticket a bien été clos');
			me.MAJ_Grid();			
		});		
	},
	closeme_handle: function(p)
	{
		p.up('window').close();
	},
	on_click_grid: function(p,record)
	{
		App.view.create('VNewTicket',{
			data: record.data,
			modal: true
		}).show();
	},
	ticket_valid: function(z)
	{
		z.setDisabled(true);
		var p=z.up('window');
		var me=this;
		// Mise à jour de l'enregistrement
		if (p.data) {
			if (p.data.state<4) {
				var obj={
					id: p.data.id,
					titre: App.get('TNewTicket textfield#titre').getValue(),
					demande: App.get('TNewTicket htmleditor#demande').getValue(),
					competence: App.get('TNewTicket combo#tkCompetences').getValue(),
					competence_display: App.get('TNewTicket combo#tkCompetences').getRawValue(),
					attrib_nom: App.get('TNewTicket combo#tkAttribution').getRawValue(),
					attrib: App.get('TNewTicket combo#tkAttribution').getValue(),
					DA: App.get('TNewTicket toggleslide#DA').getValue()
				};		
				App.DB.post('infocentre://ticket',obj,function(e,r) {
					var old_attrib=p.data.attrib;
					var new_attrib=App.get(p,'combo#tkAttribution').getValue();
					if (old_attrib!=new_attrib) {
						obj.person=Auth.User;
						obj.old=old_attrib;
						App.Mails.fin_attribuer(obj,function(){
							
						});
					}
				});
			} else {
				var obj={
					id: p.data.id,
					titre: App.get('TNewTicket textfield#titre').getValue(),
					demande: App.get('TNewTicket htmleditor#demande').getValue(),
				};		
				App.DB.post('infocentre://ticket',obj,function(e,r) {
				
				});
			}
		};
		// STEP 1 --------------------------------------------
		if (Auth.User.profiles.indexOf('SII')>-1) {
			// le ticket existe déjà
			if (p.data) {
				// STEP 4 --------------------------------------------
				// Passage en clôturer
				if (p.data.state==4) {
					App.DB.post('infocentre://ticket',{
						id: p.data.id,
						state: 5
					},function(e,r) {
						App.get('TNewTicket').close();
						App.notify('Votre ticket a été clôturé');
						me.MAJ_Grid();												
					});				
					return;
				};
				// STEP 3 --------------------------------------------
				// Ticket en cours
				if ((p.data.state==3) || (p.data.state==2)) {
					var step=App.get('TNewTicket switchbuttonsegment#steps').activeItem;
					
					if (step==5) step=-1;
					if (step==3) step=4;
					App.DB.post('infocentre://ticket',{
						id: p.data.id,
						state: step
					},function(e,r) {
						App.get('TNewTicket').close();
						App.notify('Votre ticket a été mis à jour');
						me.MAJ_Grid();			
					});
					return;
				};		
				// STEP 2 --------------------------------------------
				// Attribuer le ticket
				var o={
					id: p.data.id,
					state: 2,
					titre: App.get('TNewTicket textfield#titre').getValue(),
					demande: App.get('TNewTicket htmleditor#demande').getValue(),
					date_attrib: new Date(),
					competence: App.get('TNewTicket combo#tkCompetences').getValue(),
					competence_display: App.get('TNewTicket combo#tkCompetences').getRawValue(),
					attrib_nom: App.get('TNewTicket combo#tkAttribution').getRawValue(),
					attrib: App.get('TNewTicket combo#tkAttribution').getValue()
				};
				App.DB.post('infocentre://ticket',o,function(e,v) {
					o.person=Auth.User;
					o.location=location.href;
					App.Mails.attribuer(o,function(x) {
						App.get('TNewTicket').close();
						App.notify('Votre ticket a été mis à jour');
						me.MAJ_Grid();
					});
				});
				return;
			};
		} else {
			// STEP 4 --------------------------------------------
			// Clôturer
            if (p.data) {
                if (p.data.state==4) {
                    App.DB.post('infocentre://ticket',{
                        id: p.data.id,
                        state: 5
                    },function(e,r) {
                        App.get('TNewTicket').close();
                        App.notify('Votre ticket a été clôturé');
                        me.MAJ_Grid();			
                    });				
                    return;
                }
            }
		};
		
		// STEP 0 ----------------------------------------------------------------
		// Premier enregistrement !
			
		// on teste les valeurs entrées
		
		if ((App.get('TNewTicket textfield#titre').getValue()=="") || (App.get('TNewTicket htmleditor#demande').getValue()=="")) {
			alert('Veuillez renseigner le titre et la demande');
			z.setDisabled(false);
		};
		
		if ((Auth.User.profiles.indexOf('SII')>-1) || (Auth.User.profiles.indexOf('CLI')>-1)) {		
			// Pour un utilisateur du SII
			// on teste les valeurs rentrées
			if (
				(App.get('TNewTicket combo#tkEtablissements').getRawValue()!="") 
				&& (App.get('TNewTicket combo#tkDepartements').getRawValue()!="") 
				&& (App.get('TNewTicket combo#tkSubdis').getRawValue()!="") 
				&& (App.get('TNewTicket combo#tkAgents').getRawValue()!="")
			) {
				if (App.get('TNewTicket combo#tkCompetences').getRawValue()=="") var step=1; else var step=2;
				App.DB.get('bpclight://agents{nom,prenom,kuni,ksub,unites.libunic,subdis.libsubc}?kage='+App.get('TNewTicket combo#tkAgents').getValue(),function(e,r) {
					
                    
					var v=r.result.data[0];
					
					var obj={
						agent: App.get('TNewTicket combo#tkAgents').getValue(),
						agent_nom: App.get('TNewTicket combo#tkAgents').getRawValue(),
						agent_departement_id: v.kuni,
						agent_departement: v.libunic,
						agent_service_id: v.ksub,
						agent_service: v.libsubc,
						titre: App.get('TNewTicket textfield#titre').getValue(),
						demande: App.get('TNewTicket htmleditor#demande').getValue(),
						date_depot: App.get('TNewTicket datetimefield#tkDate').getValue(),
						state: step,
						DA: App.get('TNewTicket toggleslide#DA').getValue()
					};
					
					if (step==2) {
						obj.date_attrib=new Date();
						obj.competence=App.get('TNewTicket combo#tkCompetences').getValue();
						obj.competence_display=App.get('TNewTicket combo#tkCompetences').getRawValue();
						obj.attrib_nom=App.get('TNewTicket combo#tkAttribution').getRawValue();
                        obj.attrib=App.get('TNewTicket combo#tkAttribution').getValue();
					};
                                        
					App.DB.post('infocentre://ticket',obj,function(e,r) {
						if (!r.result.insertId) {
							alert("Votre ticket ne peut être enregistré.");
							return;
						};
						obj.location=location.href;
						obj.id=r.result.insertId;
                        App.Mails.depot_demande(obj,function(e,r) {
                            
                        });
						if (step==2) {
							obj.person=Auth.User;
							App.Mails.attribuer(obj,function(x) {
								App.get('TNewTicket').close();
								App.notify('Votre ticket a été attribué');
								me.MAJ_Grid();
							});						
						};
						App.get('TNewTicket').close();
						App.notify('Votre ticket a bien été enregistré');
						me.MAJ_Grid();
					});
					
				});			
			} else {
				alert("Veuillez renseigner l'établissement, le département, le service et le nom de l'agent concerné.");
				z.setDisabled(false);			
			}
		} else {
			// Pour un utilisateur lambda
			App.DB.post('infocentre://ticket',{
				agent: Auth.User.uid,
				agent_nom: Auth.User.lastname+' '+Auth.User.firstname,
				agent_departement_id: Auth.User.kuni,
				agent_departement: Auth.User.libunic,
				agent_service_id: Auth.User.ksub,
				agent_service: Auth.User.libsubc,
				titre: App.get('TNewTicket textfield#titre').getValue(),
				demande: App.get('TNewTicket htmleditor#demande').getValue(),
				date_depot: App.get('TNewTicket datetimefield#tkDate').getValue(),
				state: 1,
				DA: App.get('TNewTicket toggleslide#DA').getValue(),
				location: location.href
			},function(e,r) {
                App.Mails.depot_demande(obj,function(e,r) {
                            
                });                
				App.get('TNewTicket').close();
				App.notify('Votre ticket a bien été enregistré');
				me.MAJ_Grid();
			});		
		}
	},
	MAJ_Grid: function()
	{
		var grid=App.get('mainform grid#maingrid').getStore();
		grid.getProxy().extraParams.uid=Auth.User.uid;
		grid.getProxy().extraParams.profil=Auth.User.profiles;
		grid.load();
        if (this.ItemID) {
			//App.info.loading("chargement en cours...");			
            App.DB.get('infocentre://ticket?id='+this.ItemID,function(e,r) {
                var data={};
                if (r.result.data.length>0) data=r.result.data[0];
                App.view.create('VNewTicket',{
                    data: data,
                    modal: true
                }).show();
				//App.info.hide();
            });
			delete this.ItemID;
        };        
	},
	tkSubdis_select: function(p)
	{
		if (App.get('TNewTicket combo#tkSubdis').getValue()=="") return;
        App.get('TNewTicket combo#tkAgents').setValue("");
		delete App.get('TNewTicket combo#tkAgents').getStore().getProxy().extraParams.kuni;
		App.get('TNewTicket combo#tkAgents').getStore().getProxy().extraParams.kuni=App.get('TNewTicket combo#tkDepartements').getValue();
		App.get('TNewTicket combo#tkAgents').getStore().getProxy().extraParams.ksub=App.get('TNewTicket combo#tkSubdis').getValue();
		App.get('TNewTicket combo#tkAgents').getStore().load();
	},
	tkDepartements_select: function(p)
	{
        if (App.get('TNewTicket combo#tkDepartements').getValue()=="") return;
        App.get('TNewTicket combo#tkSubdis').setValue('');
		App.get('TNewTicket combo#tkSubdis').getStore().getProxy().extraParams.kuni=App.get('TNewTicket combo#tkDepartements').getValue();
		App.get('TNewTicket combo#tkSubdis').getStore().load();	
		App.get('TNewTicket combo#tkAgents').setValue("");
	},
	tkEtablissements_select: function(p)
	{
        if (App.get('TNewTicket combo#tkEtablissements').getValue()=="") return;
		App.get('TNewTicket combo#tkDepartements').setValue('');
        App.get('TNewTicket combo#tkSubdis').setValue('');
        App.get('TNewTicket combo#tkAgents').setValue('');
        App.get('TNewTicket combo#tkDepartements').getStore().getProxy().extraParams.kets=App.get('TNewTicket combo#tkEtablissements').getValue();
		App.get('TNewTicket combo#tkDepartements').getStore().load();
		App.get('TNewTicket combo#tkAgents').setValue("");
	},
	Menu_onClick: function(p)
	{
		if (p.itemId) {
			Ext.Msg.alert('Status', 'Click event on '+p.itemId);
		};			
	},
	TNewTicket_onshow: function(p)
	{
		/*App.info.loading('Veuillez patienter...');
		App.stores(p).on('load',function() {
			App.info.hide();
		});*/
		// Pour le moment il n'y a que le domaine informatique
        App.get('TNewTicket combo#tkDomaine').setValue(1);
		
		if (p.data) {		
			var d=p.data;
			// Mise à jour de la table agents (HUGE!)
			App.get('TNewTicket combo#tkAgents').getStore().getProxy().extraParams.kage=d.agent;
			App.get('TNewTicket combo#tkAgents').getStore().getProxy().extraParams.kuni=d.agent_departement_id;
			App.get('TNewTicket combo#tkAgents').getStore().load();			

			// Si l'état est clos ou sans suite
			App.get('TNewTicket toggleslide#DA').setValue(d.DA);
			if ((d.state==5) || (d.state==-1))
			{
				App.get('TNewTicket button#OK').hide();
				App.get('TNewTicket button#CloseMe').show();
				App.get('TNewTicket switchbuttonsegment#steps').show();
				App.get('TNewTicket datetimefield#tkDate').setValue(new Date(d.date_depot));
				App.get('TNewTicket datetimefield#tkDateAttrib').setValue(new Date(d.date_attrib));
				App.get('TNewTicket datetimefield#tkDateAttrib').show();
				App.get('TNewTicket textfield#titre').setValue(d.titre);			
				App.get('TNewTicket htmleditor#demande').setValue(d.demande);													
				App.get('TNewTicket combo#tkDepartements').setValue(d.agent_departement_id);
				App.get('TNewTicket combo#tkSubdis').setValue(d.agent_service_id);
				App.get('TNewTicket combo#tkAgents').setValue(d.agent);
				App.get('TNewTicket combo#tkEtablissements').setDisabled(true);
				App.get('TNewTicket combo#tkDepartements').setDisabled(true);
				App.get('TNewTicket combo#tkSubdis').setDisabled(true);
				App.get('TNewTicket combo#tkAgents').setDisabled(true);
				App.get('TNewTicket panel#CLIPanel2').hide();
			};
		    
			if (Auth.User.profiles.indexOf('SII')==-1) {
				// si ce n'est pas un agent du SII
				// il ne peut voir que l'état d'avancement
				App.get('TNewTicket button#OK').hide();
				App.get('TNewTicket button#CloseMe').show();
				App.get('TNewTicket button#CancelMe').hide();
				
				// LAST STEP
				// Mais il peut clôturer son ticket !					
				if (d.state==4) {
					if (d.attrib==Auth.User.uid) {
						App.get('TNewTicket button#OK').show();
						App.get('TNewTicket button#CancelMe').show();
						App.get('TNewTicket button#CloseMe').hide();
						App.get('TNewTicket switchbuttonsegment#steps').show();
						App.get('TNewTicket datetimefield#tkDate').setValue(new Date(d.date_depot));
						App.get('TNewTicket datetimefield#tkDateAttrib').setValue(new Date(d.date_attrib));
						App.get('TNewTicket datetimefield#tkDateAttrib').show();
						App.get('TNewTicket textfield#titre').setValue(d.titre);				
						App.get('TNewTicket htmleditor#demande').setValue(d.demande);								
						App.get('TNewTicket textfield#titre').setReadOnly(false);
						App.get('TNewTicket htmleditor#demande').setReadOnly(false);
						App.get('TNewTicket combo#tkDepartements').setValue(d.agent_departement_id);
						App.get('TNewTicket combo#tkSubdis').setValue(d.agent_service_id);
						App.get('TNewTicket combo#tkAgents').setValue(d.agent);
						App.get('TNewTicket combo#tkEtablissements').setDisabled(true);
						App.get('TNewTicket combo#tkDepartements').setDisabled(true);
						App.get('TNewTicket combo#tkSubdis').setDisabled(true);
						App.get('TNewTicket combo#tkAgents').setDisabled(true);	
						App.get('TNewTicket panel#CLIPanel1').hide();
						App.get('TNewTicket panel#CLIPanel2').hide();						
						App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(4);
						App.get('TNewTicket button#OK').show();
					};
				};
				App.get('TNewTicket datetimefield#tkDateAttrib').setValue(new Date(d.date_attrib));
				App.get('TNewTicket datetimefield#tkDateAttrib').show();
				App.get('TNewTicket datetimefield#tkDate').setValue(new Date(d.date_depot));
				App.get('TNewTicket textfield#titre').setValue(d.titre);				
				App.get('TNewTicket htmleditor#demande').setValue(d.demande);
				App.get('TNewTicket switchbuttonsegment#steps').show();
				if (d.state!=-1) App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(d.state-1); else App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(5);
				
			} else {
				// si c'est un agent du SII
				// on modifie l'écran pour attribution
				//App.info.loading("chargement en cours...");				
				App.get('TNewTicket panel#CLIPanel1').show();
				App.get('TNewTicket panel#CLIPanel2').show();
				App.get('TNewTicket textfield#titre').setReadOnly(false);
				App.get('TNewTicket htmleditor#demande').setReadOnly(false);
							
				//App.info.hide();
				// STEP 4 -> Traité -> Clos
				if (d.state==4) {
					App.get('TNewTicket button#OK').hide();
					App.get('TNewTicket button#CloseMe').show();
					App.get('TNewTicket button#CancelMe').hide();
					
					App.get('TNewTicket button#OK').show();
					App.get('TNewTicket button#CancelMe').show();
					App.get('TNewTicket button#CloseMe').hide();
					App.get('TNewTicket switchbuttonsegment#steps').show();
					App.get('TNewTicket datetimefield#tkDate').setValue(new Date(d.date_depot));
					App.get('TNewTicket datetimefield#tkDateAttrib').setValue(new Date(d.date_attrib));
					App.get('TNewTicket datetimefield#tkDateAttrib').show();
					App.get('TNewTicket textfield#titre').setValue(d.titre);				
					App.get('TNewTicket htmleditor#demande').setValue(d.demande);								
					App.get('TNewTicket textfield#titre').setReadOnly(false);
					App.get('TNewTicket htmleditor#demande').setReadOnly(false);
					App.get('TNewTicket combo#tkDepartements').setValue(d.agent_departement_id);
					App.get('TNewTicket combo#tkSubdis').setValue(d.agent_service_id);
					App.get('TNewTicket combo#tkAgents').setValue(d.agent);
					App.get('TNewTicket combo#tkEtablissements').setDisabled(true);
					App.get('TNewTicket combo#tkDepartements').setDisabled(true);
					App.get('TNewTicket combo#tkSubdis').setDisabled(true);
					App.get('TNewTicket combo#tkAgents').setDisabled(true);	
					App.get('TNewTicket panel#CLIPanel2').hide();							
					// Il peut clôturer son ticket !
					if (d.attrib==Auth.User.uid) {
						App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(5);
						App.get('TNewTicket button#OK').show();
					};
					App.get('TNewTicket switchbuttonsegment#steps').show();
					if (d.state!=-1) App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(d.state-1); else App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(5);
										
				};					
				// STEP 1 : à attribuer
				if (d.state==1) {
					App.get('TNewTicket datetimefield#tkDate').setValue(new Date(d.date_depot));
					App.get('TNewTicket textfield#titre').setValue(d.titre);				
					App.get('TNewTicket htmleditor#demande').setValue(d.demande);
					App.get('TNewTicket textfield#titre').setReadOnly(false);
					App.get('TNewTicket htmleditor#demande').setReadOnly(false);
					App.get('TNewTicket switchbuttonsegment#steps').show();
					App.get('TNewTicket combo#tkAttribution').setValue(Auth.User.uid);
					App.get('TNewTicket combo#tkDepartements').setValue(d.agent_departement_id);
					App.get('TNewTicket combo#tkSubdis').setValue(d.agent_service_id);
					App.get('TNewTicket combo#tkAgents').setValue(d.agent);
					App.get('TNewTicket combo#tkEtablissements').setDisabled(true);
					App.get('TNewTicket combo#tkDepartements').setDisabled(true);
					App.get('TNewTicket combo#tkSubdis').setDisabled(true);
					App.get('TNewTicket combo#tkAgents').setDisabled(true);	
					App.get('TNewTicket textfield#titre').setReadOnly(false);
					App.get('TNewTicket htmleditor#demande').setReadOnly(false);					
					return;						
				};
				// STEP 2 : En cours -> Traité ou sans suite
				if ((d.state==2) || (d.state==3)) {
					// si c'est l'agent SII responsable du ticket
					// on met à jour l'enregistrement sur "En cours"
					if (d.attrib==Auth.User.uid) {
						App.DB.post('infocentre://ticket',{
							id: p.data.id,
							state: 3
						},function(e,v) {
							console.log(d);
							App.get('mainform grid#maingrid').getStore().load();
							App.get('TNewTicket button#OK').show();
							App.get('TNewTicket switchbuttonsegment#steps').show();
							App.get('TNewTicket datetimefield#tkDate').setValue(new Date(d.date_depot));
							App.get('TNewTicket datetimefield#tkDateAttrib').setValue(new Date(d.date_attrib));
							App.get('TNewTicket datetimefield#tkDateAttrib').show();
							App.get('TNewTicket textfield#titre').setValue(d.titre);				
							App.get('TNewTicket htmleditor#demande').setValue(d.demande);								
							App.get('TNewTicket textfield#titre').setReadOnly(false);
							App.get('TNewTicket htmleditor#demande').setReadOnly(false);
							App.get('TNewTicket combo#tkDepartements').setValue(d.agent_departement_id);
							App.get('TNewTicket combo#tkSubdis').setValue(d.agent_service_id);
							App.get('TNewTicket combo#tkAgents').setValue(d.agent);
							App.get('TNewTicket combo#tkEtablissements').setDisabled(true);
							App.get('TNewTicket combo#tkDepartements').setDisabled(true);
							App.get('TNewTicket combo#tkSubdis').setDisabled(true);
							App.get('TNewTicket combo#tkAgents').setDisabled(true);	
							App.get('TNewTicket combo#tkAgents').setDisabled(true);	
							App.get('TNewTicket combo#tkCompetences').setValue(d.competence);
							App.get('TNewTicket combo#tkAttribution').setValue(d.attrib);
							//App.get('TNewTicket panel#CLIPanel2').hide();								
						});
					} else {
						// si c'est un agent SII "lambda", on affiche simplement la fiche
							//App.get('TNewTicket button#OK').hide();
							//App.get('TNewTicket button#CloseMe').show();
							App.get('TNewTicket switchbuttonsegment#steps').show();
							App.get('TNewTicket datetimefield#tkDate').setValue(new Date(d.date_depot));
							App.get('TNewTicket datetimefield#tkDateAttrib').setValue(new Date(d.date_attrib));
							App.get('TNewTicket datetimefield#tkDateAttrib').show();
							App.get('TNewTicket textfield#titre').setValue(d.titre);			
							App.get('TNewTicket htmleditor#demande').setValue(d.demande);													
							App.get('TNewTicket combo#tkDepartements').setValue(d.agent_departement_id);
							App.get('TNewTicket combo#tkSubdis').setValue(d.agent_service_id);
							App.get('TNewTicket combo#tkAgents').setValue(d.agent);
							App.get('TNewTicket combo#tkEtablissements').setDisabled(true);
							App.get('TNewTicket combo#tkDepartements').setDisabled(true);
							App.get('TNewTicket combo#tkSubdis').setDisabled(true);
							App.get('TNewTicket combo#tkAgents').setDisabled(true);
							App.get('TNewTicket combo#tkCompetences').setValue(d.competence);
							App.get('TNewTicket combo#tkAttribution').setValue(d.attrib);							
							//App.get('TNewTicket panel#CLIPanel2').hide();
					}
				};
				if (d.state!=-1) App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(d.state-1); else App.get('TNewTicket switchbuttonsegment#steps').setActiveItem(5);			
			}
		} else {
			// Nouveau ticket
			var d=new Date();
			App.get('TNewTicket datetimefield#tkDate').setValue(d);
			App.get('TNewTicket combo#tkAttribution').getStore().getProxy().extraParams.id_domaine=App.get('TNewTicket combo#tkDomaine').getValue();
			App.get('TNewTicket combo#tkAttribution').getStore().load();
			App.get('TNewTicket textfield#titre').setReadOnly(false);
			App.get('TNewTicket htmleditor#demande').setReadOnly(false);
			// Si c'est un agent du SII
			if (Auth.User.profiles.indexOf('SII')>-1) {
				App.get('TNewTicket panel#CLIPanel1').show();
				App.get('TNewTicket panel#CLIPanel2').show();
				App.get('TNewTicket combo#tkAttribution').setValue(Auth.User.uid);
			};
			// Si c'est un CLI
			if (Auth.User.profiles.indexOf('CLI')>-1) {
				App.get('TNewTicket panel#CLIPanel1').show();
				App.get('TNewTicket combo#tkEtablissements').hide();
				App.get('TNewTicket combo#tkDepartements').hide();
				App.get('TNewTicket combo#tkEtablissements').setValue(Auth.User.kets);
				App.get('TNewTicket combo#tkDepartements').setValue(Auth.User.kuni);
				App.get('TNewTicket combo#tkSubdis').getStore().getProxy().extraParams.kuni=App.get('TNewTicket combo#tkDepartements').getValue();
				App.get('TNewTicket combo#tkSubdis').getStore().load();	
				App.get('TNewTicket combo#tkAgents').getStore().getProxy().extraParams.kuni=-1;
				App.get('TNewTicket combo#tkAgents').getStore().load();
			};			
		}
	},
	on_newticket: function()
	{
		App.view.create('VNewTicket',{
			modal: true
		}).show();
	},
	onLoad: function(me)
	{
		
		Auth.login(function(auth) {
			var docked = App.get('mainform grid#maingrid').getDockedItems();
			if (Auth.User.profiles.indexOf('SII')==-1) {
				docked[2].hide();
			};
			if (Auth.User.profiles.indexOf('GEST')==-1) {
				docked[2].hide();
			};
			me.MAJ_Grid();
		});
	}
	
	
});
