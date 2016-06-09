Mails = {
	config: {
		port: 25,
		host: "smtp.melanie2.i2",
		requireTLS: true,
		secure: false,
		debug: true
    },
    depot_demande: function(o,cb) {
        var nodemailer = Mails.using('nodemailer');
        var smtpTransport = Mails.using('nodemailer-smtp-transport');
        var transporter = nodemailer.createTransport(smtpTransport(Mails.config));
        var d0=o.date_depot.split('T')[0];
        d0=d0.split('-')[2]+'/'+d0.split('-')[1]+'/'+d0.split('-')[0];
        var t0=o.date_depot.split('T')[1];
		var texto=[
			"Un nouveau ticket a été déposé par "+o.agent_nom+" ("+o.agent_departement+"/"+o.agent_service+") le "+d0+" à "+t0+".",
			"Pour le consulter, veuillez cliquer sur le lien suivant :",
			o.location.split('#')[0]+"#ticket/"+o.id
		];
        transporter.sendMail({
            from: "robot-aix.sii.sg.dtermed@cete-mediterranee.i2",
            to: "SII.SG.DTerMed@cerema.fr",
            subject: "Dépôt d'une nouvelle demande "+o.agent_departement+"/"+o.agent_service+"/"+o.agent_nom,
            text: texto.join('\n')
        }, function(err, result) {
            cb(err, result);
        });        
    },
	attribuer: function(o,cb) {
        var nodemailer = Mails.using('nodemailer');
        var smtpTransport = Mails.using('nodemailer-smtp-transport');
        var transporter = nodemailer.createTransport(smtpTransport(Mails.config));
		Mails.DB.get('bpclight://mela{libmela}?kage='+o.attrib,function(e,r) {
			var texto=[
				"Un ticket d'intervention vient de vous être attribué par "+o.person.firstname+" "+o.person.lastname,
				"Pour le consulter, veuillez cliquer sur le lien suivant :",
				o.location.split('#')[0]+"#ticket/"+o.id
			];
			transporter.sendMail({
				from: "robot-aix.sii.sg.dtermed@cete-mediterranee.i2",
				to: r.data[0].libmela,
				subject: "Un ticket d'intervention #"+o.id+" vient de vous être attribué.",
				text: texto.join('\n')
			}, function(err, result) {
				cb(err, result);
			});
		});		
	},
	fin_attribuer: function(o,cb) {
        var nodemailer = Mails.using('nodemailer');
        var smtpTransport = Mails.using('nodemailer-smtp-transport');
        var transporter = nodemailer.createTransport(smtpTransport(Mails.config));		
		Mails.DB.get('bpclight://mela{libmela}?kage='+o.old,function(e,r) {
			if (r.data.length==0) {
				cb("","");
				return;
			};
			var texto=[
				"Le ticket d'intervention vient de vous être retiré par "+o.person.firstname+" "+o.person.lastname
			];
			transporter.sendMail({
				from: "robot-aix.sii.sg.dtermed@cete-mediterranee.i2",
				to: r.data[0].libmela,
				subject: "Le ticket d'intervention #"+o.id+" ne vous est plus attribué.",
				text: texto.join('\n')
			}, function(err, result) {
				cb(err, result);
			});
		});		
	},
	traiter: function(o,cb)
	{		
        /*var nodemailer = Mails.using('nodemailer');
        var smtpTransport = Mails.using('nodemailer-smtp-transport');
        var transporter = nodemailer.createTransport(smtpTransport(Mails.config));		
		Mails.DB.get('infocentre://ticket?id='+o.id,function(e,r) {
			var texto=[
				"Le ticket #"+o.id+" a été traité par "+r.data[0].attrib_nom+".",
				" Pour clôturer votre ticket d'intervention, veuillez cliquer ici :",
				o.location.split('#')[0]+"#ticket/"+o.id
			];
			Mails.DB.get('bpclight://mela{libmela}?kage='+r.data[0].agent,function(e2,r2) {
				transporter.sendMail({
				from: "robot-aix.sii.sg.dtermed@cete-mediterranee.i2",
				to: r.data[0].libmela,
				subject: "Votre ticket d'intervention #"+o.id+" a été traité.",
				text: texto.join('\n')
				}, function(err, result) {
					cb(err, result);
				});
			});
		});*/
		cb("","");
	}
};

module.exports = Mails;