using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Domain.Entities;

using Moq;

namespace CleanArchFramework.Application.UnitTests.Application.Mocks
{
    internal class RepositoryMocks
    {

        //public static Mock<ICategoryRepository> GetCategoryRepository()
        //{

            //var cats = new List<Category>
            //{
            //    new()
            //    {
            //       Id = 1,
            //        Description = "Test Category",
            //        Name = "Category 1"
            //    },
            //    new()
            //    {
            //        Id = 2,
            //        Description = "Test Category",
            //        Name = "Category 2",

            //    },
            //    new()
            //    {
            //        Id = 3,
            //        Description = "Test Category",
            //        Name = "Category 3"
            //    },

            //};
            //var updatedCategory = new Category

            //{ Id = 1, Name = "Test 1 Edited", Description = "Edited Description", ModifiedOn = DateTime.Now };

            //var mockCategoryRepository = new Mock<ICategoryRepository>();
            //mockCategoryRepository.Setup(repo => repo.GetAllAsync(x => true)).ReturnsAsync(cats);


            //mockCategoryRepository.Setup(repo => repo.AddAsync(It.IsAny<Category>())).ReturnsAsync(
            //    (Category cat) =>
            //    {
            //        cats.Add(cat);
            //        return cat;
            //    });
            //mockCategoryRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Category>())).ReturnsAsync(updatedCategory);
            //return mockCategoryRepository;

      //  }
    }
}
