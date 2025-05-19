using CleanArchFramework.Application.Contracts;
using CleanArchFramework.Domain.Entities;
using CleanArchFramework.Infrastructure.Persistence;
using CleanArchFramework.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shouldly;

namespace CleanArchFramework.Persistence.IntegrationTests
{
    public class CleanArchFrameworkDbContextTests
    {
        private readonly PersistenceDbContext _dbContext;
        private readonly Mock<ILoggedInUserService> _loggedInUserServiceMock;
        private readonly string _loggedInUserId;
        private readonly UnitOfWork _unitOfWork;

        public CleanArchFrameworkDbContextTests()
        {
            var dbContextOptions = new DbContextOptionsBuilder<PersistenceDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;

            _loggedInUserId = "00000000-0000-0000-0000-000000000000";
            _loggedInUserServiceMock = new Mock<ILoggedInUserService>();
            _loggedInUserServiceMock.Setup(m => m.UserId).Returns(_loggedInUserId);
            _dbContext = new PersistenceDbContext(dbContextOptions);
            _unitOfWork = new UnitOfWork(_dbContext,  _loggedInUserServiceMock.Object);
        }

        //[Fact]
        //public async void Save_SetCreatedByProperty()
        //{
        //    var ev = new Post
        //    {
        //        Id = Guid.NewGuid(),
        //        Name = new Localization{Value = "Simple",CultureId = 1} "Test event for GUID",
        //        Content = "Test Content!"
        //    };

        //    _dbContext.Post.Add(ev);
        //    await _unitOfWork.SaveAsync(new CancellationToken());
        //    ev.CreatedBy.ShouldBe(_loggedInUserId);
        //}
    }
}