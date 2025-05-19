using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CleanArchFramework.Application.Contracts.Identity;
using CleanArchFramework.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace CleanArchFramework.Infrastructure.Identity.Jwt
{
    public class JwtProvider : IJwtProvider
    {
        private readonly JwtOptions _jwtOptions;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler;
        private readonly UserManager<ApplicationUser> _userManager;
        private const string CLAIMS_IDENTIFIER_CLAIM = "api_access";
        private const string CLAIMS_IDENTIFIER_TYPE = "endpoint";
        private const string CLAIMS_IDENTIFIER_ID = "id";

        /// <summary>
        /// Initializes a new instance of the <see cref="JwtProvider"/> class.
        /// </summary>
        /// <param name="options">The JWT options.</param>

        public JwtProvider(IOptions<JwtOptions> jwtOptions, UserManager<ApplicationUser> userManager)
        {
            _jwtOptions = jwtOptions.Value;
            _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            _userManager = userManager;
        }

        private async Task<ClaimsIdentity> GenerateClaimsIdentity(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(CLAIMS_IDENTIFIER_TYPE, CLAIMS_IDENTIFIER_CLAIM),
                new Claim(ClaimTypes.Name, user.UserName)
                
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var claimsIdentity = new ClaimsIdentity(claims, "Token");

            return claimsIdentity;
        }

        /// <summary>
        /// Creates a JWT Token
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="minutesValid"></param>
        /// <returns></returns>
        public async Task<string> CreateJwtAsync(string userId, double? minutesValid = null)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var tokenHandler = new JwtSecurityTokenHandler();
            var claimsIdentity = await GenerateClaimsIdentity(user);

            // Create JWToken
            var token = tokenHandler.CreateJwtSecurityToken(issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                subject: claimsIdentity,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(minutesValid ?? _jwtOptions.ValidFor.TotalMinutes),
                signingCredentials:
                new SigningCredentials(
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(_jwtOptions.Key)),
                    SecurityAlgorithms.HmacSha256Signature));

            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Validates and reads a JWT token created previously by this service and returns the underlying payload
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="jwt"></param>
        /// <returns></returns>
        public T ReadJwt<T>(string jwt)
        {
            if (ValidateJwt(jwt))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.ReadJwtToken(jwt);
                return JsonSerializer.Deserialize<T>(token.Claims.First(c => c.Type == CLAIMS_IDENTIFIER_TYPE).Value);
            }

            return default;
        }

        private bool ValidateJwt(string jwt)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = GetValidationParameters();

                tokenHandler.ValidateToken(jwt, validationParameters,
                    out SecurityToken securityToken); //throws if not valid
                return true;
            }
            catch
            {
                // _logger.LogError($"Invalid JWT token");
                return false;
            }
        }

        private TokenValidationParameters GetValidationParameters()
        {
            return new TokenValidationParameters()
            {
                ValidateLifetime = true,
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidIssuer = _jwtOptions.Issuer,
                ValidAudience = _jwtOptions.Audience,
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(_jwtOptions
                            .Key)) // The same key as the one that generate the token
            };
        }
    }
}

