
Demandes = {
	toutes: function(o,cb) {
		var db=Demandes.using('db');
		if (o.profil.length==0) {
			// profil de "base"
			// ne voit que son service
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and ksub in (select ksub from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r) {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and state>0 and state<5 order by date_depot desc',cb);	
			});
			return;
		};
		if (o.profil.indexOf("SII")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where state>0 and state<5 order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("GEST")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where state>0 and state<5 order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("CLI")>-1) {
			// profil CLI ne voit que les agents de son département
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r)             {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and state>0 and state<5 order by date_depot desc',cb);			
			});
			return;
		}
	},
	toutes_archives: function(o,cb) {
		var db=Demandes.using('db');
        
		if (o.profil.length==0) {
			// profil de "base"
			// ne voit que son service
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and ksub in (select ksub from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r) {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and (state=-1 or state>=5) order by date_depot desc',cb);	
			});
			return;
		};
		if (o.profil.indexOf("SII")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where (state=-1 or state>=5) order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("GEST")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where (state=-1 or state>=5) order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("CLI")>-1) {
			// profil CLI ne voit que les agents de son département
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r)             {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and (state=-1 or state>=5) order by date_depot desc',cb);			
			});
			return;
		}
	},
	news: function(o,cb) {
		var db=Demandes.using('db');
        
		if (o.profil.length==0) {
			// profil de "base"
			// ne voit que son service
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and ksub in (select ksub from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r) {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and state=1 order by date_depot desc',cb);	
			});
			return;
		};
		if (o.profil.indexOf("SII")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where state=1 order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("GEST")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where state=1 order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("CLI")>-1) {
			// profil CLI ne voit que les agents de son département
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r)             {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and state=1 order by date_depot desc',cb);			
			});
			return;
		}
	},
	mytickets: function(o,cb) {
		var db=Demandes.using('db');
        
		if (o.profil.length==0) {
			// profil de "base"
			// ne voit que son service
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and ksub in (select ksub from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r) {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and state<>-1 and state<5 and attrib='+o.id+' order by date_depot desc',cb);	
			});
			return;
		};
		if (o.profil.indexOf("SII")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where attrib='+o.id+' and state<>-1 and state<5 order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("GEST")>-1) {
			// profil SII, voit tout le monde
			db.model('infocentre','select * from ticket where attrib='+o.id+' and state<>-1 and state<5 order by date_depot desc',cb);
			return;
		};
		if (o.profil.indexOf("CLI")>-1) {
			// profil CLI ne voit que les agents de son département
			db.query('bpclight',"select kage from agents where kuni in (select kuni from agents where kage='"+o.uid+"') and agents.actif=1", function(e,r) {
				var KAGE=[];
				for (var i=0;i<r.length;i++) {
					KAGE.push(r[i].kage);
				};
				db.model('infocentre','select * from ticket where agent in ('+KAGE.join(',')+') and state<>-1 and state<5 and attrib='+o.id+' order by date_depot desc',cb);
			});
			return;
		}
	}
}

module.exports = Demandes;
