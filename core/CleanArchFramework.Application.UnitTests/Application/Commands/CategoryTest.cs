using CleanArchFramework.Application.Contracts.Infrastructure.FileService;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Features.Category.Command.CreateCategory;
using CleanArchFramework.Application.Features.Category.Command.UpdateCategory;
using CleanArchFramework.Application.Shared.FileHelper;
using MapsterMapper;
using Moq;
using Shouldly;
using CleanArchFramework.Application.UnitTests.Application.Mocks;

namespace CleanArchFramework.Application.UnitTests.Application.Commands
{
    public class MenuTest
    {
        private readonly IMapper _mapper;
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IFileService> _mockFileService;
        private readonly Mock<FileHelper> _mockFileHelper;
        public MenuTest()
        {

            _mapper = new Mapper();
            _mockFileService = new Mock<IFileService>();
            _mockFileHelper = new Mock<FileHelper>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUnitOfWork.Setup(uow => uow.SaveAsync(CancellationToken.None)).Returns(Task.CompletedTask);
            //  _mockCategoryRepository = RepositoryMocks.GetCategoryRepository();
        }

        //[Fact]
        //public async Task Handle_ValidCategory_AddedToCategoriesRepo()
        //{
        //    var handler = new CreateCategoryCommandHandler(_mockCategoryRepository.Object, _mapper, _mockUnitOfWork.Object, _mockFileService.Object, _mockFileHelper.Object);

        //    var beforeTest = await _mockCategoryRepository.Object.GetAllAsync(x => true);
        //    await handler.Handle(new CreateCategoryCommand() { Name = "Test 4", Description = "Test 4" }, CancellationToken.None);
        //    var allCategories = await _mockCategoryRepository.Object.GetAllAsync(x => true);
        //    allCategories.Count.ShouldBe(4);
        //}
        //[Fact] //May Not work as intended
        //public async Task Handle_ValidCategory_UpdateCategoriesRepo()
        //{
        //    var handler = new UpdateCategoryCommandHandler(_mapper, _mockCategoryRepository.Object, _mockUnitOfWork.Object, _mockFileService.Object, _mockFileHelper.Object);
        //    var updatedCat = await handler.Handle(new UpdateCategoryCommand() { Id = 1, Name = "Test 1 Edited", Description = "Edited Description" }, CancellationToken.None);
        //    var afterAllCats = await _mockCategoryRepository.Object.GetAllAsync(x => true);
        //    var selectedCat = afterAllCats.FirstOrDefault(x => x.Id == 1); ;
        //    updatedCat.Data.Name.ShouldBe("Test 1 Edited");
        //    updatedCat.Data.Description.ShouldBe("Edited Description");
        //    updatedCat.Data.ModifiedOn.ShouldNotBeNull();
        //}
        //[Fact]
        //public async Task Handle_ValidCategory_DeleteCategoriesRepo()
        //{
        //    var handler = new De(_mockCategoryRepository.Object, _mapper, _mockUnitOfWork.Object);

        //    var beforeTest = await _mockCategoryRepository.Object.GetAllAsync(x => true);
        //    await handler.Handle(new CreateCategoryCommand() { Name = "Test 4", Description = "Test 4" }, CancellationToken.None);
        //    var allCategories = await _mockCategoryRepository.Object.GetAllAsync(x => true);
        //    allCategories.Count.ShouldBe(4);
        //}
    }
}

