using FrontMicroService.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FrontMicroService.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdmissionController : ControllerBase
    {
        private readonly IRecruitmentService _recruitmentService;
        public AdmissionController(IRecruitmentService recruitmentService)
        {
            _recruitmentService = recruitmentService;
        }
        [HttpGet]
        public async Task<object> GetAdmissionDetailsOfIdAndSlug(int? id, string? slugUrl)
        {
            return await _recruitmentService.GetRecruitmentDetailsOfIdAndSlug(id, slugUrl);
        }
    }

}
