/*
<config>

  icon: '%icon-set%/EjdExplorer16.png',
  text: ' ',
  tooltip: 'Aktiverer EjdExplorer vha. tegnet geografisk objekt.', 
  gst_username: 'DitUsernameTilGST',
  gst_password: 'DitPasswordTilGST',
  exportmode: 'single',
  displayExportModes: true,
  selectmode: 'LifaPolygon',
  displaySelectModes: true,
  serviceurl: '/lifa/LifaService.asmx/GetLIFAticket'

</config>

<extra>

  <widgetdescription>LIFA EjdExplorer v. 0.3.05 07.01.2016</widgetdescription>
  
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
    name="displayExportModes"
    displayName="Vis alle eksportmetoder"
    type="boolean"
    description="Angiver om alle tilgængelige eksportmetoder skal vises" />
    
  <item 
    name="exportmode"
    displayName="Metode til aktivering af EjdExplorer"
    type="enum"
    description="Angiver standard aktiveringsmetode for EjdExplorer" >
    <option value="single" display="Enkeltsøgning" />
    <option value="bulk" display="Forespørgsel" />
    <option value="merge" display="Adresseudtræk" />
  </item>  
  
  <item 
    name="displaySelectModes"
    displayName="Vis alle selekteringsmetoder"
    type="boolean"
    description="Angiver om alle tilgængelige selekteringsmetoder skal vises" />
	
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

  function activateselect() {
    Tools.setTooltipStatus(false);
    ExtMapApp.SelectControl = selectmode;
	ExtMapApp.OpenLayersMap.MapControls.ActivateControl(null, ExtMapApp.SelectControl);
  };
 
  var gst_username = config.gst_username;
  var gst_password = config.gst_password;
  var displayExportModes = parseBool(config.displayExportModes);
  var displaySelectModes = parseBool(config.displaySelectModes);
  var selectmode = config.selectmode;
  var exportmode = config.exportmode;
  var serviceurl = config.serviceurl;

  delete config.selectmode;
  delete config.gst_username;
  delete config.gst_password;
  delete config.exportmode;
  delete config.displayExportModes;
  delete config.displaySelectModes;
  delete config.serviceurl;

  config.handler = function () {
    activateselect();
  };

  if (displaySelectModes || displayExportModes) // Brug split-button
  {
    var menuconfig = {
      id: 'LifaButton',
      autoCreate: true,
      items: []
    };
  
    if (displaySelectModes) {
      menuconfig.items.push({ group: 'LifaButton_SelectMode', checked: selectmode == 'LifaPoint',   text: 'Vælg med punkt',   handler: function () {selectmode = 'LifaPoint'  ; activateselect();}});
      menuconfig.items.push({ group: 'LifaButton_SelectMode', checked: selectmode == 'LifaLine',    text: 'Vælg med linie',   handler: function () {selectmode = 'LifaLine'   ; activateselect();}});
      menuconfig.items.push({ group: 'LifaButton_SelectMode', checked: selectmode == 'LifaPolygon', text: 'Vælg med flade',   handler: function () {selectmode = 'LifaPolygon'; activateselect();}});
    }
  
    if (displayExportModes) {
      if (displaySelectModes) menuconfig.items.push('-'); 
      menuconfig.items.push({ group: 'LifaButton_ExportMode', checked: exportmode == 'single',  text: 'Aktivér Enkeltsøgning'      , handler: function () { exportmode = 'single'; }});
      menuconfig.items.push({ group: 'LifaButton_ExportMode', checked: exportmode == 'bulk'  ,  text: 'Aktivér Forespørgselsbygger', handler: function () { exportmode = 'bulk'  ; }});
      menuconfig.items.push({ group: 'LifaButton_ExportMode', checked: exportmode == 'merge' ,  text: 'Aktivér Adresseudtræk'      , handler: function () { exportmode = 'merge' ; }});
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
  else // Brug alm button
  {
    var btn = new Ext.Button(config);
  
    ExtMapApp.Events.on('maploaded', function () {
        ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, selectmode.replace("Lifa", "").toLowerCase()), selectmode);
        ExtMapApp.OpenLayersMap.events.register('aftertoolchanged', this, function (evt) {btn.toggle(evt.current == selectmode, true);});
      }, 
      this);
  
    return btn;
  }

}


