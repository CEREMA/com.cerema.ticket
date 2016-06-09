Officer = {
	login : function(profile,auth_type,cb)
	{
		if (auth_type=="cas") {
			if (!profile.username) cb({});
			var mail=profile.username.toLowerCase();
			Officer.using('db').store('bpclight','select agents.kage,agents.kuni,agents.ksub,nom,prenom,unites.libunic,unites.kets,subdis.libsubc from agents join unites on unites.kuni=agents.kuni join subdis on subdis.ksub=agents.ksub where agents.kage in (select kage from mela where libmela="'+mail+'")',function(err,result){
				if (!err) {
					var response={
						lastname: result.data[0].nom,
						firstname: result.data[0].prenom,
						uid: result.data[0].kage,
						mail: mail,
						kets: result.data[0].kets,
						kuni: result.data[0].kuni,
						ksub: result.data[0].ksub,
						libunic: result.data[0].libunic,
						libsubc: result.data[0].libsubc,
						profiles: Officer.getProfile(mail.split('@')[0])
					};
					cb(response);			
				} else cb(err);
			});
		};
		
	}
};

module.exports = Officer;