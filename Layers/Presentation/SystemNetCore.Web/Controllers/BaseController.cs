namespace SystemNetCore.Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Core;
    public abstract class BaseController : Controller
    {
        protected int CurrentIdUser => User?.getUserId() ?? 0;

    }
}