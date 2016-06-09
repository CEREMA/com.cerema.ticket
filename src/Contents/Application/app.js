APP_NAMESPACE = Settings.NAMESPACE;
LANGS = Settings.LANGS;

Ext.Loader.setConfig({
    enabled: true,
	paths: Settings.PATHS
});

Manifest = function()
{

	Ext.application({

		name: APP_NAMESPACE,
		
		appFolder: Ext.Loader.getPath('Contents'),	
		autoCreateViewport: false,
        
        routes: {
            'ticket/:id': 'CMain#display'
        },
        
		controllers: Settings.CONTROLLERS,
		
		launch: function () 
		{

		}
		
	});
	
};

Ext.require(Settings.MODULES, function()
{
	for (var i=0;i<Settings.API.length;i++)
	{
		App.using(Settings.API[i]);
	};
	App.load();
});
