using CleanArchFramework.Application.Models.Infrastructure;

namespace CleanArchFramework.Application.Contracts.Identity
{
    public interface IGoogleRecaptchaV3Service
    {
        HttpClient _httpClient { get; set; }
        GRequestModel Request { get; set; }
        GResponseModel Response { get; set; }
        void InitializeRequest(GRequestModel request);
        Task<bool> Execute();
    }
}
