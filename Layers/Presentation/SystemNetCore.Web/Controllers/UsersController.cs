namespace SystemNetCore.Web.Controllers
{
    using AutoMapper;
    using Business.Entity;
    using Business.Entity.Helpers;
    using Core;
    using Core.Email;
    using DataAccess.Interfaces;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Models;
    using Models.Response;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;

    [Route("api/users")]
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
               Policy = "Administrator")]
    public class UsersController : BaseController
    {

        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersController> _logger;
        private readonly UserManager<User> _userInMgr;
        private readonly RoleManager<Role> _roleInMgr;
        private readonly IEmailSender _emailSender;

        public UsersController(IUserRepository repository, 
                               IMapper mapper,
                               UserManager<User> userInMgr,
                               RoleManager<Role> roleInMgr,
                               IEmailSender emailSender,
                               ILogger<UsersController> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
            _userInMgr = userInMgr;
            _roleInMgr = roleInMgr;
            _emailSender = emailSender;
        }

        [HttpGet]
        public IActionResult Get(string userName, string email, int page = 1,
            int pageSize = 10, string sortBy = "id",
            string sortDirection = "asc")
        {
           
            List<SearchCriteria> criterias = new List<SearchCriteria>();

            if (!string.IsNullOrEmpty(userName))
                criterias.Add(new SearchCriteria
                {
                    Field = "UserName",
                    Value = userName,
                    Operation = WhereOperation.Contains
                });

            if (!string.IsNullOrEmpty(email))
                criterias.Add(new SearchCriteria
                {
                    Field = "Email",
                    Value = email,
                    Operation = WhereOperation.Contains
                });

            var entities = _repository.GetAll(criterias, page, pageSize, sortBy, sortDirection).ToList();

            var pagedRecord = new PaginationResult
            {
                Content = entities.Select(x=> new{ x.Id,
                                                    x.UserName,
                                                    x.Email,
                                                    x.PhoneNumber,
                                                    x.LockoutEnabled,
                                                    x.Disabled }).ToList(),
                TotalRecords = _repository.CountGetAll(criterias, page, pageSize),
                CurrentPage = page,
                PageSize = pageSize
            };
            return Ok(pagedRecord);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            _logger.LogInformation(string.Format("ini  Get- process, id:{0}", id));

            User user = await _userInMgr.FindByIdAsync(id.ToString());

            return Ok(await GetUserModel(user));
        }

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            _logger.LogInformation(string.Format("ini ValidateEmail - process, email:{0}", email));

            User user = await _userInMgr.FindByEmailAsync(email);

            return Ok(await GetUserModel(user));
        }

        [HttpGet("userName/{userName}")]
        public async Task<IActionResult> GetUserByUserName(string userName)
        {
            _logger.LogInformation(string.Format("ini ValidateUserName - process, userName:{0}", userName));

            User user = await _userInMgr.FindByNameAsync(userName);

            return Ok(await GetUserModel(user));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserModel model)
        {
            _logger.LogInformation(string.Format("ini process - Post,idUser:{0}", CurrentIdUser));

            User user = _mapper.Map<User>(model);

            _logger.LogInformation(string.Format("ini create ,idUser:{0}", CurrentIdUser));

            IdentityResult addUserResult = await _userInMgr.CreateAsync(user, model.Password);

            if (!addUserResult.Succeeded)
            {
                _logger.LogInformation(string.Format("ini Post - GetErrorResult,idUser:{0}", CurrentIdUser));

                ModelState.AddModelError("", "Unabled to create user. Please try again");
                return BadRequest(new ApiBadRequestResponse(ModelState));
            }

            _logger.LogInformation(string.Format("user Post info email:{0}, idUser:{1}", user.Email, user.Id));

            Role role = await _roleInMgr.FindByIdAsync(model.IdRole.ToString());

            _logger.LogInformation(string.Format("user Post info role:{0}, idUser:{1}", role.Name, user.Id));

            await _userInMgr.AddToRoleAsync(user, role.Name);

            await _userInMgr.AddClaimAsync(user, new Claim(ClaimTypes.Authentication, "local"));

            string generatedCode = await _userInMgr.GenerateEmailConfirmationTokenAsync(user);

            string callbackUrl = string.Format("{0}/{1}/{2}", model.ConfirmUrl, user.Id, System.Web.HttpUtility.UrlEncode(generatedCode));

            string bodyHtmlEmail = Helper.CreateBodyEmail(user, callbackUrl);

            await _emailSender.SendEmailAsync(model.Email, "Confirm your account", bodyHtmlEmail);
            _logger.LogInformation(string.Format("finish create ,idUser:{0}, newIdUser{1}", CurrentIdUser, user.Id));

            return Ok(user);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]UserModel model)
        {
            if (id != model.Id)
            {
                _logger.LogInformation(string.Format("ini Put - inValid,idUser:{0}", CurrentIdUser));
                ModelState.AddModelError("", "Invalid ID");
                return BadRequest(new ApiBadRequestResponse(ModelState));
            }

            _logger.LogInformation(string.Format("ini process - Put,idUser:{0}", CurrentIdUser));

            User user = await _userInMgr.FindByIdAsync(model.Id.ToString());

            user.PhoneNumber = model.PhoneNumber;
            user.LockoutEnabled = model.LockoutEnabled;
            user.Disabled = model.Disabled;

            _logger.LogInformation(string.Format("ini Put ,idUser:{0},idUser update:{1}", CurrentIdUser, model.Id));

            await _userInMgr.UpdateAsync(user);

            var roles = await _userInMgr.GetRolesAsync(user);

            await _userInMgr.RemoveFromRolesAsync(user, roles);

            Role role = await _roleInMgr.FindByIdAsync(model.IdRole.ToString());

            _logger.LogInformation(string.Format("user update info role:{0}, idUser:{1}", role.Name, user.Id));
            await _userInMgr.AddToRoleAsync(user, role.Name);

            _logger.LogInformation(string.Format("finish update ,idUser:{0}", CurrentIdUser));


            _logger.LogInformation(string.Format("finish Put - success,idUser:{0}", CurrentIdUser));

            return Ok(user);

        }

        private async Task<UserModel> GetUserModel(User user)
        {
            if (user == null)
            {
                _logger.LogInformation("GetUserModel - OK No found");

                return new UserModel();
            }

            _logger.LogInformation(string.Format("GetUserModel - OK, user id:{0}", user.Id));

            var roles = await _userInMgr.GetRolesAsync(user);
            Role role = await _roleInMgr.FindByNameAsync(roles[0]);

            UserModel userModel = _mapper.Map<UserModel>(user);

            userModel.IdRole = role.Id;
            userModel.Password = user.Id == 0 ? string.Empty : "xxxxxx";
            userModel.ConfirmPassword = userModel.Password;
            userModel.Role = role.Name;

            return userModel;
        }

    }
}