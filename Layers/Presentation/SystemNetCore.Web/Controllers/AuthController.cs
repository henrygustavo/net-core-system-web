namespace SystemNetCore.Web.Controllers
{
    using Business.Entity;
    using Core;
    using Core.Email;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.IdentityModel.Tokens;
    using Models;
    using Models.Response;
    using System;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web;

    [Route("api/auth")]
    [Produces("application/json")]
    public class AuthController : Controller

    {
        private readonly SignInManager<User> _signInMgr;
        private readonly UserManager<User> _userInMgr;
        private readonly ILogger<AuthController> _logger;
        private readonly IPasswordHasher<User> _hasher;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _config;

        public AuthController(
            SignInManager<User> signInMgr,
            UserManager<User> userInMgr,
            IPasswordHasher<User> hasher,
            ILogger<AuthController> logger,
            IEmailSender emailSender,
            IConfiguration config)
        {
            _signInMgr = signInMgr;
            _userInMgr = userInMgr;
            _hasher = hasher;
            _logger = logger;
            _emailSender = emailSender;
            _config = config;

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CredentialModel model)
        {
         
            _logger.LogWarning("ini LogIn - process");
            _logger.LogInformation("ini LogIn - process");

            User user = await _userInMgr.FindByEmailAsync(model.Email);

            if (user != null)
            {
                _logger.LogInformation($"LogIn - process for user {user.Email}");

                if (user.Disabled)
                {
                    ModelState.AddModelError("", "Your account is disabled, please contact with the web master");
                    return BadRequest(new ApiBadRequestResponse(ModelState));
                }

                if (!user.EmailConfirmed)
                {
                    ModelState.AddModelError("", "Please confirm your email or contact with the web master");
                    return BadRequest(new ApiBadRequestResponse(ModelState));
                }

                var validCredentials = await _userInMgr.CheckPasswordAsync(user, model.Password);

                // When a user is lockedout, this check is done to ensure that even if the credentials are valid
                // the user can not login until the lockout duration has passed
                if (await _userInMgr.IsLockedOutAsync(user))
                {
                    ModelState.AddModelError("", 
                    $"Your account has been locked out for {_config["Account:DefaultAccountLockoutTimeSpan"]} minutes due to multiple failed login attempts.");
                }
                // if user is subject to lockouts and the credentials are invalid
                // record the failure and check if user is lockedout and display message, otherwise,
                // display the number of attempts remaining before lockout
                else if (await _userInMgr.GetLockoutEnabledAsync(user) && !validCredentials)
                {
                    // Record the failure which also may cause the user to be locked out
                    await _userInMgr.AccessFailedAsync(user);

                    string message;

                    if (await _userInMgr.IsLockedOutAsync(user))
                    {
                        message = string.Format(
                                    "Your account has been locked out for {0} minutes due to multiple failed login attempts.",
                                    _config["Account:DefaultAccountLockoutTimeSpan"]);
                    }
                    else
                    {
                        int accessFailedCount = await _userInMgr.GetAccessFailedCountAsync(user);

                        int attemptsLeft = Convert.ToInt32(_config["Account:MaxFailedAccessAttemptsBeforeLockout"]) - accessFailedCount;

                        message = string.Format(
                                    "Invalid credentials. You have {0} more attempt(s) before your account gets locked out..",
                                    attemptsLeft);

                    }

                    ModelState.AddModelError("", message);
                }
                else if (!validCredentials)
                {
                    ModelState.AddModelError("", "Invalid credentials. Please try again.");
                }
                else
                {
                    await _userInMgr.ResetAccessFailedCountAsync(user);

                    Microsoft.AspNetCore.Identity.SignInResult signInStatus = await _signInMgr.PasswordSignInAsync(
                                                                              user.UserName, model.Password, model.RememberMe, false);

                    if (signInStatus.Succeeded)
                    {
                        _logger.LogInformation("LogIn - Success");
                        _logger.LogInformation($"user LogIn info email:{user.Email}, idUser:{user.Id}");
                        return Ok(ModelFactory.Create(user));
                    }

                    if (signInStatus.IsNotAllowed)
                    {
                        _logger.LogWarning("LogIn - Invalid password");
                        ModelState.AddModelError("", "Invalid credentials. Please try again");

                    }
                }
            }
            else
            {
                _logger.LogWarning("LogIn - invalid email.");
                ModelState.AddModelError("", "Invalid credentials. Please try again");
            }

            _logger.LogWarning("LogIn - BadRequest.");
            return BadRequest(new ApiBadRequestResponse(ModelState));
        }

        [HttpPost("token")]
        public async Task<IActionResult> CreateToken([FromBody] CredentialModel model)
        {
            
            _logger.LogInformation("ini CreateToken - process");

            var user = await _userInMgr.FindByEmailAsync(model.Email);

            if (user != null)
            {
                _logger.LogInformation($"CreateToken - process for user {user.Email}");

                if (_hasher.VerifyHashedPassword(user, user.PasswordHash, model.Password) == PasswordVerificationResult.Success)
                {
                    var userClaims = await _userInMgr.GetClaimsAsync(user);
                    var userRoles = await _userInMgr.GetRolesAsync(user);
                    var claims = new[]
                    {          
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, user.Email),
                        new Claim("role", userRoles.Any()? userRoles[0] : string.Empty)
                    }.Union(userClaims);

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));

                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(

                        _config["Tokens:Issuer"],
                        _config["Tokens:Issuer"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(_config["Tokens:ExpirationTimeTokenInMin"])),
                        signingCredentials: creds

                    );

                    _logger.LogInformation($"Finish CreateToken for user {user.Email} - process");

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo

                    });
                }
            }

            return BadRequest("Failed token");
        }

        [HttpPost("recover_password")]
        public async Task<IActionResult> RecoverPassword([FromBody] ForgotPasswordModel model)
        {
          
            User user = await _userInMgr.FindByEmailAsync(model.Email);

            if (user == null || !(await _userInMgr.IsEmailConfirmedAsync(user)))
            {
                //Don't reveal that the user does not exist
                    return BadRequest("Something is wrong, please try again later");
            }

            string generatedCode = await _userInMgr.GeneratePasswordResetTokenAsync(user);

            var callbackUrl = string.Format(@"{0}/{1}", model.ResetUrl, HttpUtility.UrlEncode(generatedCode));

            string bodyHtmlEmail = Helper.CreateBodyemailForgotPassword(user, callbackUrl);

            await _emailSender.SendEmailAsync(model.Email, "Reset Password", bodyHtmlEmail);

            return Ok("Please check your email to reset your password." );
            
        }

        [HttpPost("reset_password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
 
            User user = await _userInMgr.FindByEmailAsync(model.Email);

            if (user == null)
            {
                // Don't reveal that the user does not exist
                return BadRequest("Error Reset Password.");
            }

            var result = await _userInMgr.ResetPasswordAsync(user, model.Token, model.Password);

            if (result.Succeeded)
            {
                return Ok("Your password has been reset. You can login with your new credentials.");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }

            return BadRequest(new ApiBadRequestResponse(ModelState));
        }

        [HttpPost("change_password")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
             User user = await _userInMgr.GetUserAsync(HttpContext.User);

            _logger.LogInformation($"ini ChangePassword process, idUser:{ user.Id}");

            IdentityResult result = await _userInMgr.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                _logger.LogInformation($"ChangePassword GetErrorResult,idUser:{ user.Id}");

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }

                return BadRequest(new ApiBadRequestResponse(ModelState));
            }

            _logger.LogInformation($"ChangePassword Ok ,idUser:{ user.Id}");

            return Ok("Password was changed, Please login again");
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] VerificationTokenModel model)
        {
            _logger.LogInformation(string.Format("ini ConfirmEmail - process ,idUser:{0}", model.IdUser));

            User user = await _userInMgr.FindByIdAsync(model.IdUser.ToString());

            IdentityResult result = await _userInMgr.ConfirmEmailAsync(user, model.Token);

            if (result.Succeeded)
            {
                _logger.LogInformation(string.Format("ConfirmEmail - idUser:{0}", model.IdUser));
                return Ok("The verification was successful");

            }
 
            _logger.LogInformation(string.Format("ConfirmEmail - status: failed, idUser:{0}", model.IdUser));

            ModelState.AddModelError("","Error, please try later");

            return BadRequest(new ApiBadRequestResponse(ModelState));
        }
    }
}