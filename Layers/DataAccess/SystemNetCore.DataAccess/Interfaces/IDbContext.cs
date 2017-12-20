using Microsoft.EntityFrameworkCore;

namespace SystemNetCore.DataAccess.Interfaces
{
    using Microsoft.EntityFrameworkCore.ChangeTracking;
    using System.Linq;

    public interface IDbContext
    {
        DbSet<T> Set<T>() where T : class;
        EntityEntry<T> Entry<T>(T entity) where T : class;
        int SaveChanges();
        void Rollback();

     
    }
}
