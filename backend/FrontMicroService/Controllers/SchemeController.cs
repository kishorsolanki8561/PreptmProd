using FrontMicroService.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FrontMicroService.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SchemeController : ControllerBase
    {
        private readonly ISchemeService _schemeService;
        public SchemeController(ISchemeService schemeService)
        {
            _schemeService = schemeService;
        }

        [HttpGet]
        public object GetSchemeDataByIdAndSlug(int? id, string? slugUrl)
        {
            return _schemeService.GetModuleWiseDataByIdAndSlug(id, slugUrl);
        }
    }
}
