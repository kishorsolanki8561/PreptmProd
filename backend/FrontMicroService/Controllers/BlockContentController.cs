using FrontMicroService.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FrontMicroService.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BlockContentController : ControllerBase
    {
        private readonly IBlockContentService _blockContentService;
        public BlockContentController(IBlockContentService blockContentService)
        {
            _blockContentService = blockContentService;
        }
        [HttpGet]
        public object GetBlockContentDetailsOfIdAndSlug(int? id, string? slugUrl)
        {
            return _blockContentService.GetBlockContentDetailsOfIdAndSlug(id, slugUrl);
        }
    }
}
