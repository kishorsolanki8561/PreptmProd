using CommonService.JWT;
using CommonService.Other;
using FrontMicroService.IService;
using Microsoft.IdentityModel.Tokens;
using ModelService.Model.Front;
using Serilog;

namespace FrontMicroService.Service
{
    public class SchemeService : UtilityManager, ISchemeService
    {
        private readonly HelperService _helperService;
        private readonly JWTAuthManager _jWTAuthManager;
        public SchemeService(HelperService helperService, JWTAuthManager jWTAuthManager)
        {
            _helperService = helperService;
            _jWTAuthManager = jWTAuthManager;
        }
        public ServiceResponse<SchemeFrontModel> GetModuleWiseDataByIdAndSlug(int? id, string slugUrl, bool IsAdminView = false)
        {
            SchemeFrontModel returnModel = new SchemeFrontModel();
            try
            {
                IsAdminView = _jWTAuthManager.RequestUrl =="admin.preptm.com" ? true : false;
                var user = _jWTAuthManager.FrontUser is null ? null : _jWTAuthManager.FrontUser;
                var result = QueryMultiple(@"Sp_SchemeDetailsOfIdAndSlug @slugUrl,@Id,@UserId,@LanguageCode,@IsAdminView", new { SlugUrl = !string.IsNullOrEmpty(slugUrl) ? slugUrl : string.Empty, Id = id, UserId = user?.Id, LanguageCode = _jWTAuthManager.LanguageCode ?? "en", IsAdminView= IsAdminView });
                if (result.Data is not null && SPResultHandler.GetCount(result.Data[0]) > 0)
                {
                    returnModel = SPResultHandler.GetObject<SchemeFrontModel>(result.Data[0]) ?? null;
                    // Document list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[1]) > 0)
                        returnModel.Documents = SPResultHandler.GetList<SchemeDocumentFrontModel>(result.Data[1]).Select(s => s.Document).ToList();

                    // Aatachment list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[2]) > 0)
                        returnModel.Attachments = SPResultHandler.GetList<SchemeAttachmentFrontLookupModel>(result.Data[2]).ToList();

                    // eligibility list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[3]) > 0)
                        returnModel.Eligibilitys = SPResultHandler.GetList<SchemeEligibilityFrontModel>(result.Data[3]).Select(x => x.Eligibility).ToList();

                    // content list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[4]) > 0)
                        returnModel.ContactDetails = SPResultHandler.GetList<SchemeContactDetailFrontModel>(result.Data[4]).ToList();

                    // how to apply list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[5]) > 0)
                        returnModel.HowToApplys = SPResultHandler.GetList<HowToApplyFrontModel>(result.Data[5]).ToList();

                    // Quick link list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[6]) > 0)
                        returnModel.QuickLinks = SPResultHandler.GetList<QuickLinkFrontModel>(result.Data[6]).ToList();

                    // other Scheme list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[7]) > 0)
                        returnModel.OtherSchemes = SPResultHandler.GetList<OtherSchemeFrontModel>(result.Data[7]).ToList();

                    // FAQ list
                    if (returnModel is not null && SPResultHandler.GetCount(result.Data[8]) > 0)
                        returnModel.FAQs = SPResultHandler.GetList<FAQLookupFrontModel>(result.Data[8]).ToList();
                    return SetResultStatus<SchemeFrontModel>(returnModel, MessageStatus.Success, result.IsSuccess, "", "", 0, StatusCodes.Status200OK, null);
                }
                else
                {
                    return SetResultStatus<SchemeFrontModel>(null, MessageStatus.NoRecord, result.IsSuccess, "", "", 0, StatusCodes.Status200OK, null);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex, CommonFunction.Errorstring("SchemeService.cs", "GetModuleWiseDataByIdAndSlug"));
                return SetResultStatus<SchemeFrontModel>(null, MessageStatus.Error, false, ex.Message, ex.InnerException.Message, 0, StatusCodes.Status500InternalServerError, null);
            }


        }
    }


}
