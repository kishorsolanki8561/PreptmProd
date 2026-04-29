using CommonService.JWT;
using CommonService.Other;
using FrontMicroService.IService;
using ModelService.Model.Front.ArticleDTO;
using ModelService.Model.Translation;
using Serilog;
using static CommonService.Other.UtilityManager;

namespace FrontMicroService.Service
{
    public class ArticleService : UtilityManager, IArticleService
    {
        private readonly HelperService _helperService;
        private readonly JWTAuthManager _jWTAuthManager;
        public ArticleService(HelperService helperService, JWTAuthManager jWTAuthManager)
        {
            _helperService = helperService;
            _jWTAuthManager = jWTAuthManager;
        }

        public ServiceResponse<ArticlesDTO> GetArticles(ArticleFilterDTO filterModel)
        {
            try
            {
                ArticlesDTO articles = new ArticlesDTO();
                ServiceResponse<ArticlesDTO> response = new ServiceResponse<ArticlesDTO>();
                filterModel.LanguageCode = _jWTAuthManager.LanguageCode ?? "en";
                var result = QueryMultiple(@"Sp_FrontArticles @Page,@PageSize,@OrderBy,@OrderByAsc,@Title,@ArticleTypeSlug,@TagTypeSlug,@Search,@LanguageCode", _helperService.AddDynamicParameters(filterModel));
                if (result.Data != null && result.Data.Count() > 0)
                {
                    articles.Articles = SPResultHandler.GetList<ArticleListDTO>(result.Data[0]) ?? null;
                    if (articles.Articles is not null && articles.Articles.Count() > 0)
                    {
                        if (result.Data is not null && SPResultHandler.GetCount(result.Data[1]) > 0)
                            articles.LatestArticle = SPResultHandler.GetList<ArticleListDTO>(result.Data[1]) ?? null;
                        if (result.Data is not null && SPResultHandler.GetCount(result.Data[2]) > 0)
                            response.OtherData = new Dictionary<string, object>()
                                {
                                    {"moduleText",SPResultHandler.GetObject<FrontModuleModel>(result.Data[2]).ModuleText }
                                };
                        return SetResultStatus<ArticlesDTO>(articles, MessageStatus.Success, true, "", "", (int)articles.Articles[0].TotalRows, otherData: response.OtherData);
                    }
                    else
                    {
                        if (result.Data is not null && SPResultHandler.GetCount(result.Data[2]) > 0)
                            response.OtherData = new Dictionary<string, object>()
                                {
                                    {"moduleText",SPResultHandler.GetObject<FrontModuleModel>(result.Data[2]).ModuleText }
                                };

                        return SetResultStatus<ArticlesDTO>(articles, MessageStatus.NoRecord, true, "", "", 0, otherData: response.OtherData);
                    }

                }
                else
                {
                    return SetResultStatus<ArticlesDTO>(null, MessageStatus.NoRecord, true);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, CommonFunction.Errorstring("ArticleService.cs", "GetArticles"));
                return SetResultStatus<ArticlesDTO>(null, MessageStatus.Error, false);
            }
        }

        public ServiceResponse<object> GetArticleDetails(int? id, string? slugUrl, bool IsAdminView = false)
        {
            ArticleDTO resultModel = new ArticleDTO();
            try
            {
                IsAdminView = _jWTAuthManager.RequestUrl == "admin.preptm.com" ? true : false;
                var _articleResult = QueryMultiple(@"Sp_FrontArticleDetails @Id,@SlugUrl,@LanguageCode,@IsAdminView", new { Id = id, SlugUrl = slugUrl, LanguageCode = _jWTAuthManager.LanguageCode ?? "en", IsAdminView = IsAdminView });

                if (_articleResult.Data is not null && SPResultHandler.GetCount(_articleResult.Data[0]) > 0)
                {
                    resultModel = SPResultHandler.GetObject<ArticleDTO>(_articleResult.Data[0]) ?? null;
                    if (resultModel is not null && SPResultHandler.GetCount(_articleResult.Data[1]) > 0)
                        resultModel.Tags = SPResultHandler.GetList<ArticleTagsDTO>(_articleResult.Data[1]).ToList();
                    if (resultModel is not null && SPResultHandler.GetCount(_articleResult.Data[2]) > 0)
                        resultModel.ArticleFaqs = SPResultHandler.GetList<ArticleFaqDTO>(_articleResult.Data[2]).ToList();
                    if (resultModel is not null && SPResultHandler.GetCount(_articleResult.Data[3]) > 0)
                        resultModel.Recruitments = SPResultHandler.GetList<TagsWiseRecruitmentDTO>(_articleResult.Data[3]).ToList();
                    if (resultModel is not null && SPResultHandler.GetCount(_articleResult.Data[4]) > 0)
                        resultModel.BlockContents = SPResultHandler.GetList<TagsWiseBlockContentsDTO>(_articleResult.Data[4]).ToList();
                    if (resultModel is not null && SPResultHandler.GetCount(_articleResult.Data[5]) > 0)
                        _articleResult.OtherData = new Dictionary<string, object>()
                                {
                                    {"moduleText",SPResultHandler.GetObject<FrontModuleModel>(_articleResult.Data[5]).ModuleText }
                                };
                    return SetResultStatus<object>(resultModel, MessageStatus.Success, true, otherData: _articleResult.OtherData);
                }
                else
                {
                    return SetResultStatus<object>(null, MessageStatus.NoRecord, true);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, CommonFunction.Errorstring("ArticleService.cs", "GetArticleDetails"));
                return SetResultStatus<object>(null, MessageStatus.Error, false, ex.Message);
            }
        }
    }
}
