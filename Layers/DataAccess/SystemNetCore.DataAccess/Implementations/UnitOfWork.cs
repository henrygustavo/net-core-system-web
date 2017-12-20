namespace SystemNetCore.DataAccess.Implementations
{
    using Interfaces;
    using Microsoft.EntityFrameworkCore;

    public class UnitOfWork : IUnitOfWork
	{
		public IDbContext Context { get; }

		public UnitOfWork(IDbContext context)
		{
			Context = context;
		}

		public void RegisterNew<TEntity>(TEntity entity) where TEntity : class
		{
			Context.Entry(entity).State = EntityState.Added;
		}

		public void RegisterUnchanged<TEntity>(TEntity entity) where TEntity : class
		{
			Context.Entry(entity).State = EntityState.Unchanged;
		}

		public void RegisterChanged<TEntity>(TEntity entity) where TEntity : class
		{
			Context.Entry(entity).State = EntityState.Modified;
		}

		public void RegisterDeleted<TEntity>(TEntity entity) where TEntity : class
		{
			Context.Entry(entity).State = EntityState.Deleted;
		}

		public void Refresh()
		{
			Context.Rollback();
		}

		public void Commit()
		{
			Context.SaveChanges();
		}
	}
}
