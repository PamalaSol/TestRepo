using System.Runtime.Serialization;

namespace CleanArchFramework.Application.Models.Infrastructure
{
    //Google's response property naming is 
    //embarrassingly inconsistent, that's why we have to 
    //use DataContract and DataMember attributes,
    //so we can bind the class from properties that have 
    //naming where a C# variable by that name would be
    //against the language specifications... (i.e., '-').
    [DataContract]
    public class GResponseModel
    {
        [DataMember]
        public bool success { get; set; }
        [DataMember]
        public string challenge_ts { get; set; }
        [DataMember]
        public string hostname { get; set; }

        //Could create a child object for 
        //error-codes
        [DataMember(Name = "error-codes")]
        public string[] error_codes { get; set; }
    }
}
