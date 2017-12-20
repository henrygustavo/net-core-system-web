namespace SystemNetCore.UnitTest
{
    using Business.Entity;
    using DataAccess.Interfaces;
    using Moq;
    using System.Linq;
    using Xunit;
    using Helpers;

    public class MockTest : BaseTest
    {
        [Fact]
        public void CanMock()
        {
            //Arrange
            var data = new[] {
                new User { Id = 1, Email = "test@test.com", UserName = "test" },
                new User { Id = 2, Email = "test2@test.com", UserName = "test2" }
            }.ToList();
            var mock = new Mock<IDbContext>();
            mock.Setup(x => x.Set<User>()).Returns(Helper.ToDbSet(data));
            //Act
            var context = mock.Object;
            var users = context.Set<User>().ToList();
            //Assert
            Assert.Equal(data, users);
        }
    }
}
