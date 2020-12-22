using System.Web.Services;
using System.Net;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;

[WebService(Namespace = "http://lifaservice.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class LifaService : System.Web.Services.WebService {

    public LifaService () {
    }

    [WebMethod]
    public string GetLIFAticket_org(string KMSuser, string KMSpwd, string wkt)
    {
        WebClient wclient = new WebClient();
        // old address:  string KMSuri = "http://kortforsyningen.kms.dk/service?request=GetTicket&login={0}&password={1}";
        string KMSuri = "https://api.dataforsyningen.dk/service?request=GetTicket&login={0}&password={1}";
        string kmsticket = wclient.DownloadString(string.Format(KMSuri, KMSuser, KMSpwd));

        string LIFAuri = "http://www.kortviser.dk/UsersPublic/Handlers/LIFAExternalIntegrationServiceREST.ashx";
        LIFAuri += "?data={'function': 'ConvertToCadastralDistrictsAndRealProperties', wkt:'{0}', ticket: '{1}'}";
        string LIFAticket = wclient.DownloadString(System.Net.WebUtility.HtmlEncode(string.Format(LIFAuri, wkt, kmsticket)));

        return LIFAticket;
    }

    [WebMethod]
    public string GetLIFAticket(string KMSuser, string KMSpwd, string wkt)
    {
        
        WebClient wclient = new WebClient();

        // old address:  string KMSuri = "http://kortforsyningen.kms.dk/service?request=GetTicket&login={0}&password={1}";
        string KMSuri = "https://api.dataforsyningen.dk/service?request=GetTicket&login={0}&password={1}";
        string ticket = wclient.DownloadString(string.Format(KMSuri, KMSuser, KMSpwd));

        string url = "http://www.kortviser.dk/UsersPublic/Handlers/LIFAExternalIntegrationServiceREST.ashx?callback=";
        string function = "ConvertToCadastralDistrictsAndRealProperties";

        string dataEksempel = string.Format("{{\"function\":\"{0}\",\"wkt\":\"{1}\",\"ticket\":\"{2}\"}}",function,wkt,ticket);
        dataEksempel = this.Server.UrlEncode(dataEksempel);

        System.Net.HttpWebRequest myReq = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);

        byte[] dataEksempelByteArray = Encoding.UTF8.GetBytes(dataEksempel);

        myReq.Method = "POST";
        myReq.ContentType = "application/x-www-form-urlencoded";
        myReq.ContentLength = dataEksempelByteArray.Length;

        using (Stream dataStream = myReq.GetRequestStream())
        {
            dataStream.Write(dataEksempelByteArray, 0, dataEksempelByteArray.Length);
        }
        System.Net.HttpWebResponse resp = (System.Net.HttpWebResponse)myReq.GetResponse();
        System.IO.Stream responseStream = resp.GetResponseStream();
        System.IO.StreamReader rd = new System.IO.StreamReader(responseStream);

        string returnValue = rd.ReadToEnd();

        returnValue = Regex.Replace(returnValue, "[^0-9]", "");
        
        return returnValue;
    }

    [WebMethod]
    public string GetLIFAticket_exp(string KMSuser, string KMSpwd, string wkt)
    {
        
        WebClient wclient = new WebClient();

        //string KMSuri = "https://api.dataforsyningen.dk/service?request=GetTicket&login={0}&password={1}";
        //string ticket = wclient.DownloadString(string.Format(KMSuri, KMSuser, KMSpwd));
        string ticket =    "7686d17ccf142c489825874ebf362440";

        string url = "http://www.kortviser.dk/UsersPublic/Handlers/LIFAExternalIntegrationServiceREST.ashx?callback=";
        string function = "ConvertToCadastralDistrictsAndRealProperties";

        string dataEksempel = string.Format("{{\"function\":\"{0}\",\"wkt\":\"{1}\",\"ticket\":\"{2}\"}}",function,wkt,ticket);
        dataEksempel = this.Server.UrlEncode(dataEksempel);

        System.Net.HttpWebRequest myReq = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);

        byte[] dataEksempelByteArray = Encoding.UTF8.GetBytes(dataEksempel);

        myReq.Method = "POST";
        myReq.ContentType = "application/x-www-form-urlencoded";
        myReq.ContentLength = dataEksempelByteArray.Length;

        using (Stream dataStream = myReq.GetRequestStream())
        {
            dataStream.Write(dataEksempelByteArray, 0, dataEksempelByteArray.Length);
        }
        System.Net.HttpWebResponse resp = (System.Net.HttpWebResponse)myReq.GetResponse();
        System.IO.Stream responseStream = resp.GetResponseStream();
        System.IO.StreamReader rd = new System.IO.StreamReader(responseStream);

        string returnValue = rd.ReadToEnd();

        returnValue = Regex.Replace(returnValue, "[^0-9]", "");
        
        return returnValue;
    }
    
}
