namespace SystemNetCore.UnitTest
{
    using Microsoft.Extensions.Configuration;
    using Moq;
    using Xunit;

    public class DatabaseTest : BaseTest
    {
        [Fact]
        public void CanReadFromConfiguration()
        {
            var connectionString = Configuration["Data:ConnectionString"];
            Assert.NotNull(connectionString);
            Assert.NotEmpty(connectionString);
        }
        [Fact]
        public void CanMock()
        {
            var mock = new Mock<IConfiguration>();
            mock.Setup(x => x[It.IsNotNull<string>()]).Returns("Dummy Value");
            var configuration = mock.Object;
            var value = configuration["Dummy Key"];
            Assert.NotNull(value);
            Assert.NotEmpty(value);
        }
    }
}
