namespace SystemNetCore.DataAccess.Implementations
{
    using Business.Entity.Helpers;
    using Interfaces;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public abstract class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly IUnitOfWork _unitOfWork;

        protected BaseRepository(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _unitOfWork.Context.Set<TEntity>();
        }

        public IEnumerable<TEntity> GetAll(List<SearchCriteria> criterias, int pageNumber, 
                                        int pageSize, string orderBy, string orderDirection)
        {

            var skip = (pageNumber - 1) * pageSize;
            return _unitOfWork.Context.Set<TEntity>().WhereAnd(criterias)
                                                     .OrderBy(orderBy, orderDirection)
                                                     .Skip(skip)
                                                     .Take(pageSize);
        }

        public int CountGetAll(List<SearchCriteria> criterias, int pageNumber, int pageSize)
        {
            return _unitOfWork.Context.Set<TEntity>().WhereAnd(criterias).Count();
        }


        public TEntity Get(int id)
        {
            return _unitOfWork.Context.Set<TEntity>().Find(id);
        }

        public TEntity SingleOrDefault(Func<TEntity, bool> predicate)
        {
            return _unitOfWork.Context.Set<TEntity>().SingleOrDefault(predicate);
        }

        
        public void Insert(TEntity entity)
        {
            try
            {
                _unitOfWork.RegisterNew(entity);

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

      
        public void Update(TEntity entity)
        {
            _unitOfWork.RegisterChanged(entity);
        }

      
        public void Delete(TEntity entity)
        {
            _unitOfWork.RegisterDeleted(entity);
        }

        public void SaveChanges()
        {
            try
            {
                _unitOfWork.Commit();
            }
            catch (Exception ex)
            {

                _unitOfWork.Refresh();
                throw new Exception(ex.Message);

            }
        }

        public void RollbackChanges()
        {
            _unitOfWork.Refresh();
        }
    }

    
}