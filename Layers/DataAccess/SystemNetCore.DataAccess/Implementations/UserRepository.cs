namespace SystemNetCore.DataAccess.Implementations
{
    using Business.Entity;
    using Interfaces;

    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
