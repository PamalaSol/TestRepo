using CleanArchFramework.Application.Features.Faq.Commands.CreateFaq;
using CleanArchFramework.Application.Features.Faq.Commands.UpdateFaq;
using CleanArchFramework.Application.Features.Faq.Query.GetAllFaq;
using CleanArchFramework.Application.Features.Faq.Query.GetFaq;
using CleanArchFramework.Domain.Entities;
using Mapster;

namespace CleanArchFramework.Application.Profiles
{
    internal class FaqMapping : IRegister
    {
        void IRegister.Register(TypeAdapterConfig config)
        {
            var helper = new SharedMappingHelper();

            config.NewConfig<Faq, GetFaqDto>()
                .Map(dest => dest.Answer, src => helper.MapFromTranslation(src.Answer))
                .Map(dest => dest.Question, src => helper.MapFromTranslation(src.Question));

            config.NewConfig<Faq, GetAllFaqDto>()
                .Map(dest => dest.Answer, src => helper.MapFromTranslation(src.Answer))
                .Map(dest => dest.Question, src => helper.MapFromTranslation(src.Question));

            config.NewConfig<Faq, CreateFaqDto>()
                .Map(dest => dest.Answer, src => helper.MapFromTranslation(src.Answer))
                .Map(dest => dest.Question, src => helper.MapFromTranslation(src.Question));
            config.NewConfig<Faq, UpdateFaqDto>()
                .Map(dest => dest.Answer, src => helper.MapFromTranslation(src.Answer))
                .Map(dest => dest.Question, src => helper.MapFromTranslation(src.Question));

            config.NewConfig<CreateFaqCommand, Faq>()
                .Map(dest => dest.Answer, src => helper.MapToTranslation(src.Answer))
                .Map(dest => dest.Question, src => helper.MapToTranslation(src.Question));

            config.NewConfig<UpdateFaqCommand, Faq>()
                .Ignore(dest => dest.Answer, src => src.Answer)
                .Ignore(dest => dest.Question, src => src.Question)

                .AfterMapping((src, dest) => // This is the AfterMap part
                {
                    // Perform actions after the mapping is done
                    dest.Answer.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value =
                        src.Answer;
                    dest.Question.Localizations.FirstOrDefault(x => x.LanguageId == helper.GetLocalizaion()).Value =
                        src.Question;

                });
        }
    }
}
