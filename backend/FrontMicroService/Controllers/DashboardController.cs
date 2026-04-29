using FrontMicroService.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelService.Model.Translation;

namespace FrontMicroService.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly IRecruitmentService _recruitmentService;
        private readonly ISchemeService _schemeService;

        public DashboardController(IDashboardService dashboardService, IRecruitmentService recruitmentService, ISchemeService schemeService)
        {
            _dashboardService = dashboardService;
            _recruitmentService = recruitmentService;
            _schemeService = schemeService;
        }

        [HttpGet]
        public object GetDashboardRecentAndPopularPostList(int pageSize)
        {
            return _dashboardService.GetDashboardRecentAndPopularPostList(pageSize);
        }

        [HttpPost]
        public async Task<object> GetFrontDashboardList(DashboradFilterModel filterModel)
        {
            return  await _dashboardService.GetFrontDashboardList(filterModel);
        }

        [HttpPost]
        public object GetDashboardSearchFilter(DashboradSearchFilterModel filterModel)
        {
            return _dashboardService.GetDashboardSearchFilter(filterModel);
        }

        [HttpGet]
        public object GetModuleWiseDataByIdAndSlug(int? id, string? slugUrl, bool isRecruitment = false)
        {
            return _recruitmentService.GetModuleWiseDataByIdAndSlug(id, slugUrl, isRecruitment);
        }

        [HttpGet]
        public object GetDepartmentDataByIdAndSlug(int? id, string? slugUrl)
        {
            return _recruitmentService.GetDepartmentDataByIdAndSlug(id, slugUrl);
        }

        [HttpGet]
        public async Task<object> GetDashboardData(int pageSize)
        {
            return await _dashboardService.GetDashboardData(pageSize);
            //return Ok();
        }
        [HttpGet]
        public ActionResult GetPopularBySearchText(int numberOfRecord = 10, string? SearchText = "")
        {
            return Ok(_dashboardService.GetPopularBySearchText(numberOfRecord, SearchText));
        }
        [HttpGet]
        public ActionResult GetBanners(int numberOfRecord = 5)
        {
            return Ok(_dashboardService.GetBannersByPageSize(numberOfRecord));
        }

        [HttpGet("{langCode}")]
        public IActionResult GetSiteMap([FromRoute] string langCode)
        {
            if (langCode == "hi")
            {
                return new ContentResult
                {
                    ContentType = "application/xml",
                    Content = _dashboardService.GetSiteMap(langCode).Data,
                    StatusCode = 200
                };
            }
            else
            {
                return new ContentResult
                {
                    ContentType = "text/html",
                    Content = "invalid language",
                    StatusCode = 400
                };
            }
        }
        [HttpGet]
        public IActionResult GetSiteMap()
        {
            return new ContentResult
            {
                ContentType = "application/xml",
                Content = _dashboardService.GetSiteMap().Data,
                StatusCode = 200
            };
        }
    }
}
