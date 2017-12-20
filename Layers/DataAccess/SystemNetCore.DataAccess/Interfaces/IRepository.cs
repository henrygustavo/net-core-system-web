namespace SystemNetCore.DataAccess.Interfaces
{
    using Business.Entity.Helpers;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public interface IRepository<TEntity> where TEntity : class
	{
		IEnumerable<TEntity> GetAll();

	    IEnumerable<TEntity> GetAll(List<SearchCriteria> criterias, int pageNumber,
									int pageSize, string sortBy, string sortDirection);

	    TEntity Get(int id);

        int CountGetAll(List<SearchCriteria> criterias, int pageNumber, int pageSize);

		TEntity SingleOrDefault(Func<TEntity, bool> predicate);

		void Insert(TEntity entity);

		void Update(TEntity entity);

		void Delete(TEntity entity);
		void RollbackChanges();
		void SaveChanges();
	}
}
