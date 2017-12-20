namespace SystemNetCore.DataAccess.Implementations
{
    using Business.Entity;
    using Interfaces;

    public class RoleRepository : BaseRepository<Role>, IRoleRepository
    {
        public RoleRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
