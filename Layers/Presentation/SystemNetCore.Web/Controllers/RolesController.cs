namespace SystemNetCore.Web.Controllers
{
    using AutoMapper;
    using Business.Entity;
    using Business.Entity.Helpers;
    using Core;
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
    using System.Threading.Tasks;

    [Route("api/roles")]
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
               Policy = "Administrator")]
    public class RolesController : BaseController
    {

        private readonly IRoleRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<RolesController> _logger;
        private readonly RoleManager<Role> _roleInMgr;

        public RolesController(IRoleRepository repository,
            IMapper mapper,
            ILogger<RolesController> logger,
            RoleManager<Role> roleInMgr)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
            _roleInMgr = roleInMgr;
        }

        [HttpGet]
        public IActionResult Get(string name, int page = 1,
            int pageSize = 10, string sortBy = "id",
            string sortDirection = "asc")
        {
   
            List<SearchCriteria> criterias = new List<SearchCriteria>();

            if (!string.IsNullOrEmpty(name))
                criterias.Add(new SearchCriteria
                {
                    Field = "Name",
                    Value = name,
                    Operation = WhereOperation.Contains
                });

            var entities = _repository.GetAll(criterias, page, pageSize, sortBy, sortDirection).ToList();

            var pagedRecord = new PaginationResult
            {
                Content = entities,
                TotalRecords = _repository.CountGetAll(criterias, page, pageSize),
                CurrentPage = page,
                PageSize = pageSize
            };

            return Ok(pagedRecord);
        }

        [HttpGet("enabled")]
        public IActionResult GetAllRoles()
        {
            List<Role> roleList = _repository.GetAll().ToList();
            _logger.LogInformation("ini process - RolesList");

            return Ok(Helper.ConvertToListItem(roleList, "Id", "Name"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            _logger.LogInformation(string.Format("ini  Get- process, id:{0}", id));

            Role role = await _roleInMgr.FindByIdAsync(id.ToString());

            _logger.LogInformation(string.Format("finish  Get- process, id:{0}", id));

            return Ok(GetRoleModel(role));
        }


        [HttpGet("name/{name}")]
        public async Task<IActionResult> GetRoleByName(string name)
        {
            _logger.LogInformation(string.Format("ini  GetRoleByName- process, name:{0}", name));

            Role role = await _roleInMgr.FindByNameAsync(name);

            _logger.LogInformation(string.Format("finish  GetRoleByName- process, name:{0}", name));

            return Ok(GetRoleModel(role));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]RoleModel model)
        {
            _logger.LogInformation(string.Format("ini  Post- process, id:{0}, idUser: {1}", model.Id, CurrentIdUser));

            Role role = _mapper.Map<Role>(model);

            IdentityResult addRoleResult =  await _roleInMgr.CreateAsync(role);

            if (!addRoleResult.Succeeded)
            {
                _logger.LogInformation(string.Format("ini Post - GetErrorResult, idUser:{0}", CurrentIdUser));

                ModelState.AddModelError("", "Unabled to create role. Please try again");

                return BadRequest(new ApiBadRequestResponse(ModelState));
            }

            _logger.LogInformation(string.Format("finish  Post- process, id:{0}, idUser: {1}", model.Id, CurrentIdUser));

            return Ok(role);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]RoleModel model)
        {
            _logger.LogInformation(string.Format("ini  Put- process, id:{0}, idUser: {1}", model.Id, CurrentIdUser));

            if (id != model.Id)
            {
                _logger.LogInformation(string.Format("ini Put - inValid, idUser:{0}", CurrentIdUser));
                ModelState.AddModelError("", "Invalid ID");

                return BadRequest(new ApiBadRequestResponse(ModelState));
 
            }

            Role role = await _roleInMgr.FindByIdAsync(id.ToString());

            role.Name = model.Name;

            IdentityResult updateRoleResult = await _roleInMgr.UpdateAsync(role);

            if (!updateRoleResult.Succeeded)
            {
                _logger.LogInformation(string.Format("ini Put - GetErrorResult, idUser:{0}", CurrentIdUser));

                ModelState.AddModelError("", "Unabled to create role. Please try again");

                return BadRequest(new ApiBadRequestResponse(ModelState));
            }

            _logger.LogInformation(string.Format("finish  Put- process, id:{0}, idUser: {1}", model.Id, CurrentIdUser));

            return Ok(role);
        }

        private RoleModel GetRoleModel(Role role)
        {
            if (role == null)
            {
                _logger.LogInformation("GetRoleModel - OK No found");

                return new RoleModel();
            }

            _logger.LogInformation(string.Format("Validate GetRoleModel - OK, role id:{0}", role.Id));

            RoleModel roleModel = _mapper.Map<RoleModel>(role);

            return roleModel;
        }
    }
}