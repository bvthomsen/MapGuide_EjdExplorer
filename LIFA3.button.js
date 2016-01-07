/*

<config>

  icon: '%icon-set%/EjdExplorer16.png',
  text: ' ',
  tooltip: 'Aktiverer EjdExplorer vha. tegnet geografisk objekt.', 
  gst_username: 'Kommune217',
  gst_password: 'Tyuiopa10',
  exportmode: 'single',
  displayAvalibleModes: true,
  selectmode: 'LifaPolygon',
  serviceurl: '/lifa/LifaService.asmx/GetLIFAticket'

</config>

<extra>

  <widgetdescription>LIFA EjdExplorer v. 0.3.04 04.01.2016</widgetdescription>
  
  <item
    name="text"
    displayName="Tekst"
    type="html"
    description="Angiver teksten på knappen" />
  
  <item
    name="tooltip"
    displayName="Tooltip"
    type="html"
    description="Angiver tooltip der vises når musen hviler over knappen" />
  
  <item
    name="gst_username"
    displayName="GST username"
    type="html"
    description="Angiver username til GST service" />
  
  <item
    name="gst_password"
    displayName="GST password"
    type="html"
    description="Angiver password til GST service" />
  
  <item 
    name="exportmode"
    displayName="Metode til aktivering af EjdExplorer"
    type="enum"
    description="Angiver aktiveringsmetode for EjdExplorer" >
    <option value="single" display="Enkeltsøgning" />
    <option value="bulk" display="Forespørgsel" />
    <option value="merge" display="Adresseudtræk" />
  </item>  
  
  <item 
    name="displayAvalibleModes"
    displayName="Vis alle eksportmetoder"
    type="boolean"
    description="Angiver om alle tilgængelige eksportmetoder skal vises" />
    
  <item 
    name="selectmode"
    displayName="Default metode til selektering"
    type="enum"
    description="Angiver standard valgmetode for EjdExplorer" >
    <option value="LifaPoint"   display="Punkt valg" />
    <option value="LifaLine"    display="Linie valg" />
    <option value="LifaPolygon" display="Flade valg" />
  </item>  

  <item
    name="serviceurl"
    displayName="URL for LIFA service"
    type="html"
    description="Angiver URL for LIFA service" />

</extra>

*/

function (config) {
  
  function SendRequestToServer(wktdata) {
	
    ExtMapApp.GlobalProgressShow('Aktiverer EjdExplorer...', true);
    Ext.Ajax.request({
      url: serviceurl,
      method: 'POST',
      params: { KMSuser: gst_username, KMSpwd: gst_password, wkt: wktdata },
      success: function (result) {
        var node = Ext.DomQuery.selectValue('string', result.responseXML);
		var iframe = document.createElement("iframe");
        iframe.src = "ejdexpl://?mode=" + exportmode + "&LIFAExternalIntegrationServiceID=" + node;
        iframe.onload = function() {
            this.parentNode.removeChild(this);    
        };
        document.body.appendChild(iframe);
        setTimeout(function(){ ExtMapApp.GlobalProgressHide();}, 2000);           
      },
      failure: function(response, opts) {
        ExtMapApp.GlobalProgressHide();           
        alert('Fejl i LIFA integrationsservice ' + response.status); 
	  }
    });
  }

  function toggleselectstate(newstate) {
    exportmode = newstate;
    Ext.getCmp('LifaButton_single').setChecked(exportmode == 'single');
    Ext.getCmp('LifaButton_bulk'  ).setChecked(exportmode == 'bulk'  );
    Ext.getCmp('LifaButton_merge' ).setChecked(exportmode == 'merge' );
  };

  function activateselect(controlid) {
    selectmode = controlid;
    Tools.setTooltipStatus(false);
    ExtMapApp.SelectControl = controlid;
	ExtMapApp.OpenLayersMap.MapControls.ActivateControl(null, ExtMapApp.SelectControl);
  };
  
  var gst_username = config.gst_username;
  var gst_password = config.gst_password;
  var exportmode = config.exportmode;
  var displayAvalibleModes = parseBool(config.displayAvalibleModes);
  var selectmode = config.selectmode;
  var serviceurl = config.serviceurl;

  delete config.selectmode;
  delete config.gst_username;
  delete config.gst_password;
  delete config.exportmode;
  delete config.displayAvalibleModes;
  delete config.serviceurl;

  config.handler = function () {
    activateselect(selectmode);
  };

  var menuconfig = {
    id: 'LifaButton',
    autoCreate: true,
    items: [
		{ group: 'LifaButton_SelectType', checked: selectmode == 'LifaPoint',   text: 'Vælg med punkt',   handler: function () {activateselect('LifaPoint');} },
		{ group: 'LifaButton_SelectType', checked: selectmode == 'LifaLine',    text: 'Vælg med linie',   handler: function () {activateselect('LifaLine'); } },
		{ group: 'LifaButton_SelectType', checked: selectmode == 'LifaPolygon', text: 'Vælg med flade',   handler: function () {activateselect('LifaPolygon'); } }]
  };

  if (displayAvalibleModes) {
    menuconfig.items.push('-');
    menuconfig.items.push({ id: 'LifaButton_single', text: 'Aktivér EjdExplorer - Enkeltsøgning'       , group: 'LifaButton_ExportMode', checked: exportmode == 'single', handler: function () { toggleselectstate('single'); } });
    menuconfig.items.push({ id: 'LifaButton_bulk',   text: 'Aktivér EjdExplorer - Forespørgselsbygger' , group: 'LifaButton_ExportMode', checked: exportmode == 'bulk',   handler: function () { toggleselectstate('bulk'  ); } });
    menuconfig.items.push({ id: 'LifaButton_merge',  text: 'Aktivér EjdExplorer - Adresseudtræk'       , group: 'LifaButton_ExportMode', checked: exportmode == 'merge',  handler: function () { toggleselectstate('merge' ); } });
  }

  config.menu = new Ext.menu.Menu(menuconfig);
  var splitbtn = new Ext.SplitButton(config);

  ExtMapApp.Events.on('maploaded', function () {
      ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, 'point'),   'LifaPoint'  );
      ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, 'line'),    'LifaLine'   );
      ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, 'polygon'), 'LifaPolygon');
      ExtMapApp.OpenLayersMap.events.register('aftertoolchanged', this, function (evt) {splitbtn.toggle(evt.current == 'LifaPoint' || evt.current == 'LifaLine' || evt.current == 'LifaPolygon', true);});
    }, 
	this);

	return splitbtn;
}


