/*

<config>

  icon: '%icon-set%/lifa.png',
  text: '',
  tooltip: 'Aktiverer LIFA system.', 
  gst_username: 'qgisdk',
  gst_password: 'qgisdk',

</config>

<extra>

<widgetdescription>LIFA EjdExplorer v. 0.1.02 29.01.2015</widgetdescription>

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

</extra>

*/

function (config) {

  var gst_username = config.gst_username;
  delete config.gst_username;
  var gst_password = config.gst_password;
  delete config.gst_password;

  var selectLayer = null;
  
  function SendRequestToServer(wktdata) {
    Ext.Ajax.request({
      url: '/lifa/LifaService.asmx/GetLIFAticket',
      method: 'POST',
      params: { KMSuser: gst_username, KMSpwd: gst_password, wkt: wktdata },
      success: function (result) {
        var node = Ext.DomQuery.selectValue('string', result.responseXML);
        //alert ("ejdexpl://?mode=single&LIFAExternalIntegrationServiceID=" + node);
        var mw = window.open("ejdexpl://?mode=single&LIFAExternalIntegrationServiceID=" + node);
		setTimeout(function(){ mw.close(); }, 4000);
      },
      failure: function(response, opts) {
        alert('Fejl i LIFA integrationsservice ' + response.status); 
	  }
    });
  }

  function DigitizeCallback(feature) {

    // convert feature to wkt for debug purposes
  
    // make certain, that polygon is closed
    var points = feature.geometry.getVertices();
    var ring = new OpenLayers.Geometry.LinearRing(points);
    var polygon = new OpenLayers.Geometry.Polygon([ring]);
    feature.geometry = polygon;

    // convert final feature to wkt
    wktdata = new OpenLayers.Format.WKT().write(feature);
	
    SendRequestToServer(wktdata);

    // Empty drawing layer
    selectLayer.destroyFeatures();
	
  }

  config.handler = function () {
    ExtMapApp.OpenLayersMap.MapControls.ActivateControl(selectLayer, 'DigitizeLifaSelect');
  };

  var btn = new Ext.Button(config);

  ExtMapApp.Events.on('maploaded', function () {
    ExtMapApp.OpenLayersMap.events.register(
            'aftertoolchanged',
            this,
            function (evt) {
              btn.toggle(evt.current == selectLayer.id + '_DigitizeLifaSelect', true);
            }
        );
    selectLayer = ExtMapApp.OpenLayersMap.AddVectorLayer('lifa-select-layer', true);
    ExtMapApp.OpenLayersMap.MapControls.AddControl(new OpenLayers.Control.DrawFeature(selectLayer, OpenLayers.Handler.Polygon, { featureAdded: DigitizeCallback, cursorClass: 'olDigitizePolygonCursor', handlerOptions: { persist: false} }), selectLayer.id + '_DigitizeLifaSelect');
  });

  return btn;

}
