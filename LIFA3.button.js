/*
<config>

  icon:               '%icon-set%/EjdExplorer16.png',
  text:               ' ',
  tooltip:            'Aktiverer EjdExplorer vha. tegnet geografisk objekt.', 
  gst_username:       'DitUsernameTilGST',
  gst_password:       'DitPasswordTilGST',
  exportmode:         'merge',
  displayExportModes: true,
  selectmode:         'LifaPolygon',
  displaySelectModes: true,
  serviceurl:         '/lifa/LifaService.asmx/GetLIFAticket',
  labelSingle:        'Aktivér Ejendomssøgning',
  labelBulk:          'Aktivér Forespørgselsbygger',
  labelMerge:         'Aktivér Adresseudtræk'
  
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
    <option value="single" display="Ejendomssøgning" />
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

  <item
    name="labelSingle"
    displayName="Ledetekst for single"
    type="html"
    description="Angiver faneblads tekst i drop-down for single-mode" />

  <item
    name="labelBulk"
    displayName="Ledetekst for bulk"
    type="html"
    description="Angiver faneblads tekst i drop-down for bulk-mode" />
	
  <item
    name="labelMerge"
    displayName="Ledetekst for merge"
    type="html"
    description="Angiver faneblads tekst i drop-down for merge-mode" />
	
</extra>

*/

function (config) {
  
  function SendRequestToServer(wktdata) { // Funktion til kommunikation med LIFA service
    
	ExtMapApp.GlobalProgressShow('Aktiverer EjdExplorer...', true);
    
	Ext.Ajax.request({
      url: serviceurl,
      method: 'POST',
      params: { KMSuser: gst_username, KMSpwd: gst_password, wkt: wktdata },
      success: function (result) {
        var node = Ext.DomQuery.selectValue('string', result.responseXML); // Udtræk af node id. (not pretty!!)
		var iframe = document.createElement("iframe");  // Generer iframe
        iframe.src = "ejdexpl://?mode=" + exportmode + "&LIFAExternalIntegrationServiceID=" + node;  // EjdExplorer aktivering
        iframe.onload = function() {
            this.parentNode.removeChild(this); // Efter load, luk iframe med det samme    
        };
        document.body.appendChild(iframe);  // Tilføj iframe (dvs. aktiver EjdExplorer)        
        setTimeout(function(){ ExtMapApp.GlobalProgressHide();}, 2000);           
      },
      failure: function(response, opts) {
        ExtMapApp.GlobalProgressHide();           
        alert('Fejl i LIFA integrationsservice ' + response.status); 
	  }
    });
  }

  function activateselect() { // Funktion til aktivering af dig. værktøj
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
  var labelSingle = config.labelSingle;
  var labelMerge = config.labelMerge;
  var labelBulk = config.labelBulk;

  delete config.selectmode;
  delete config.gst_username;
  delete config.gst_password;
  delete config.exportmode;
  delete config.displayExportModes;
  delete config.displaySelectModes;
  delete config.serviceurl;
  delete config.labelSingle;
  delete config.labelMerge;
  delete config.labelBulk;

  config.handler = function () {
    activateselect();
  };

  if (displaySelectModes || displayExportModes) // Valggrupper aktiveret, brug split-button
  {
    var menuconfig = { // Opret menukonfiguration for split-button
      id: 'LifaButton',
      autoCreate: true,
      items: []
    };
  
    if (displaySelectModes) { // Opsætning af menu afsnit med selektion af dig. værktøj
      menuconfig.items.push({ group: 'LifaButton_SelectMode', checked: selectmode == 'LifaPoint',   text: 'Vælg med punkt',   handler: function () {selectmode = 'LifaPoint'  ; activateselect();}});
      menuconfig.items.push({ group: 'LifaButton_SelectMode', checked: selectmode == 'LifaLine',    text: 'Vælg med linie',   handler: function () {selectmode = 'LifaLine'   ; activateselect();}});
      menuconfig.items.push({ group: 'LifaButton_SelectMode', checked: selectmode == 'LifaPolygon', text: 'Vælg med flade',   handler: function () {selectmode = 'LifaPolygon'; activateselect();}});
    }
  
    if (displayExportModes) { // Opsætning af menu afsnit med valg af faneblad i EjdExplorer
      if (displaySelectModes) menuconfig.items.push('-'); 
      menuconfig.items.push({ group: 'LifaButton_ExportMode', checked: exportmode == 'merge' ,  text: labelMerge , handler: function () { exportmode = 'merge' ; }});
      menuconfig.items.push({ group: 'LifaButton_ExportMode', checked: exportmode == 'single',  text: labelSingle, handler: function () { exportmode = 'single'; }});
      menuconfig.items.push({ group: 'LifaButton_ExportMode', checked: exportmode == 'bulk'  ,  text: labelBulk  , handler: function () { exportmode = 'bulk'  ; }});
    }
  
    config.menu = new Ext.menu.Menu(menuconfig);
    var splitbtn = new Ext.SplitButton(config);
  
    ExtMapApp.Events.on('maploaded', function () { // Tilføj værtøjer til digitalisering af hhv. pkt, linie, pol.
        ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, 'point'),   'LifaPoint'  );
        ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, 'line'),    'LifaLine'   );
        ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, 'polygon'), 'LifaPolygon');
        ExtMapApp.OpenLayersMap.events.register('aftertoolchanged', this, function (evt) {splitbtn.toggle(evt.current == 'LifaPoint' || evt.current == 'LifaLine' || evt.current == 'LifaPolygon', true);});
      }, 
      this);
  
    return splitbtn;
  }
  else // Ingen valggruper aktiveret, brug alm. button
  {
    var btn = new Ext.Button(config);
  
    ExtMapApp.Events.on('maploaded', function () { // Tilføj relevant værktøj afgh. af selectmode.
        ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DigitizeControl(SendRequestToServer, selectmode.replace("Lifa", "").toLowerCase()), selectmode);
        ExtMapApp.OpenLayersMap.events.register('aftertoolchanged', this, function (evt) {btn.toggle(evt.current == selectmode, true);});
      }, 
      this);
  
    return btn;
  }

}
