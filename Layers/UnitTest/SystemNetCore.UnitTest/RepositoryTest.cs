namespace SystemNetCore.UnitTest
{
    using Business.Entity;
    using DataAccess.Implementations;
    using DataAccess.Interfaces;
    using Moq;
    using System.Linq;
    using Xunit;
    using Helpers;

    public class RepositoryTest : BaseTest
	{
		[Fact]
		public void ShouldAllowGettingASetOfObjectsGenerically()
		{
			//Arrange
			var data = new[] 
			{
				new User { Id = 1, Email = "test@test.com", UserName = "test" },
				new User { Id = 2, Email = "test2@test.com", UserName = "test2" }

			}.ToList();

			var mock = new Mock<IDbContext>();
			mock.Setup(x => x.Set<User>()).Returns(Helper.ToDbSet(data));
			var context = mock.Object;
			var unitOfWork = new UnitOfWork(context);
			var repository = new UserRepository(unitOfWork);
			//Act
			var users = repository.GetAll();
			//Assert
			Assert.Equal(data, users.ToList());
		}
	}
}
