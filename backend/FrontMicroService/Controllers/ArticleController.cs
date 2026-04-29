using FrontMicroService.IService;
using Microsoft.AspNetCore.Mvc;
using ModelService.Model.Front.ArticleDTO;

namespace FrontMicroService.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;
        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpPost]
        public object GetArticles(ArticleFilterDTO filterModel)
        {
            return _articleService.GetArticles(filterModel);
        }

        [HttpGet]
        public object GetArticleDetails(int? id, string slugUrl)
        {
            return _articleService.GetArticleDetails(id, slugUrl);
        }
    }
}
