namespace SystemNetCore.Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using System.Collections.Generic;
    using DataAccess.Interfaces;

    [Produces("application/json")]
    [Route("api/test")]
    public class TestController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IUserRepository _repository;
        public TestController(IConfiguration configuration, IUserRepository repository)
        {
            _config = configuration;
            _repository = repository;
        }
        // GET: api/Test
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[]
            {
                _config.GetSection("Enviroment").Value,
                _config.GetSection("Tokens:Key").Value
            };
        }

        // GET: api/Test/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/Test
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }
        
        // PUT: api/Test/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
