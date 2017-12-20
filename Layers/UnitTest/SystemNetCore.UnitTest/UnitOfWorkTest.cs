namespace SystemNetCore.UnitTest
{
    using Business.Entity;
    using DataAccess.Implementations;
    using DataAccess.Interfaces;
    using Moq;
    using System;
    using System.Linq;
    using Xunit;
    using Helpers;

    public class UnitOfWorkTest : BaseTest
	{
		[Fact]
		public void ShouldReadToDatabaseOnRead()
		{
			//Arrange
			var findCalled = false;
			var mock = new Mock<IDbContext>();
			mock.Setup(x => x.Set<User>()).Callback(() => findCalled =
			true);
			var context = mock.Object;
			var unitOfWork = new UnitOfWork(context);
			var repository = new UserRepository(unitOfWork);
			//Act
			var users = repository.GetAll();
			//Assert
			Assert.True(findCalled);
		}

		[Fact]
		public void ShouldNotCommitToDatabaseOnDataChange()
		{
			//Arrange
			var saveChangesCalled = false;
			var data = new[] { new User { Id = 1, Email = "test@test.com", UserName = "test" }
			}.ToList();
			var mock = new Mock<IDbContext>();
			mock.Setup(x => x.Set<User>()).Returns(Helper.ToDbSet(data));
			mock.Setup(x => x.SaveChanges()).Callback(() =>
			saveChangesCalled = true);
			var context = mock.Object;
			var unitOfWork = new UnitOfWork(context);
			var repository = new UserRepository(unitOfWork);
			//Act
			var users = repository.GetAll();
			users.First().Email = "test@test.com";
			//Assert
			Assert.False(saveChangesCalled);
		}

		[Fact]
		public void ShouldPullDatabaseValuesOnARollBack()
		{
			//Arrange
			var saveChangesCalled = false;
			var rollbackCalled = false;
		    var data = new[]
		    {
		        new User {Id = 1, Email = "test@test.com", UserName = "test"}
		    }.ToList();

			var mock = new Mock<IDbContext>();
			mock.Setup(x => x.Set<User>()).Returns(Helper.ToDbSet(data));
			mock.Setup(x => x.SaveChanges()).Callback(() =>
			saveChangesCalled = true);
			mock.Setup(x => x.Rollback()).Callback(() => rollbackCalled =
			true);
			var context = mock.Object;
			var unitOfWork = new UnitOfWork(context);
			var repository = new UserRepository(unitOfWork);
			//Act
			var users = repository.GetAll();
			users.First().Email = "test@test.com";
			repository.RollbackChanges();
			//Assert
			Assert.False(saveChangesCalled);
			Assert.True(rollbackCalled);
		}

		[Fact]
		public void ShouldCommitToDatabaseOnSaveCall()
		{
			//Arrange
			var saveChangesCalled = false;
			var data = new[] { new User { Id = 1, Email = "test@test.com", UserName = "test" }
			}.ToList();
			var mock = new Mock<IDbContext>();
			mock.Setup(x => x.Set<User>()).Returns(Helper.ToDbSet(data));
			mock.Setup(x => x.SaveChanges()).Callback(() =>
			saveChangesCalled = true);
			var context = mock.Object;
			var unitOfWork = new UnitOfWork(context);
			var repository = new UserRepository(unitOfWork);
			//Act
			var users = repository.GetAll();
			users.First().Email = "test@test.com";
			repository.SaveChanges();
			//Assert
			Assert.True(saveChangesCalled);
		}

		[Fact]
		public void ShouldNotCommitOnError()
		{
			//Arrange
			var rollbackCalled = false;
			var data = new[] { new User { Id = 1, Email = "test@test.com", UserName = "test" }
			}.ToList();
            var mock = new Mock<IDbContext>();
			mock.Setup(x => x.Set<User>()).Returns(Helper.ToDbSet(data));
			mock.Setup(x => x.SaveChanges()).Throws(new Exception());
			mock.Setup(x => x.Rollback()).Callback(() => rollbackCalled = true);
			var context = mock.Object;
			var unitOfWork = new UnitOfWork(context);
			var repository = new UserRepository(unitOfWork);
			//Act
			var users = repository.GetAll();
			users.First().Email = "test@test.com";

			try
			{
				repository.SaveChanges();
			}
			catch
			{
				repository.RollbackChanges();

			}
			//Assert
			Assert.True(rollbackCalled);
		}
	}
}
