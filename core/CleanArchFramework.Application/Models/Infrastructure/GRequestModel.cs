using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace CleanArchFramework.Application.Models.Infrastructure
{
    public class GRequestModel
    {
        public string path { get; set; }
        public string secret { get; set; }
        public string response { get; set; }
        public string remoteip { get; set; }
        private IConfiguration _configuration { get; }

     //   public readonly GoogleCaptchaOptions _googleCaptchaOptions;

        public GRequestModel(string res, string remip,string secret,string path )
        {
          
            response = res;
            remoteip = remip;
            this.secret = secret;
            this.path = path;
            //if (String.IsNullOrWhiteSpace(secret) || String.IsNullOrWhiteSpace(path))
            //{
            //    //Invoke logger
            //    throw new Exception("Invalid 'Secret' or 'Path' properties in appsettings.json. Parent: GoogleRecaptchaV3.");
            //}
        }
    }
}
