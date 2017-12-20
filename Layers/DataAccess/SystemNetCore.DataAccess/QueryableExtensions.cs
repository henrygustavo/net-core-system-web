namespace SystemNetCore.DataAccess
{
    using Business.Entity.Helpers;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    public static class QueryableExtensions
    {
        public static IQueryable<T> OrderBy<T>(this IQueryable<T> source, string orderBy, string orderDirection)
        {
            var expression = source.Expression;

            var parameter = Expression.Parameter(typeof(T), "x");
            var selector = Expression.PropertyOrField(parameter, orderBy);
            var method = string.Equals(orderDirection, "desc", StringComparison.OrdinalIgnoreCase)
                ? "OrderByDescending"
                : "OrderBy";
            expression = Expression.Call(typeof(Queryable), method,
                new[] {source.ElementType, selector.Type},
                expression, Expression.Quote(Expression.Lambda(selector, parameter)));

            return source.Provider.CreateQuery<T>(expression);
        }

        public static IQueryable<T> Where<T>(this IQueryable<T> source, List<SearchCriteria> criterias, Operator operatorValue)
        {
            if (criterias.Count == 0)
                return source;

            Expression resultCondition = null;

            // Create a member expression pointing to given column
            ParameterExpression parameter = Expression.Parameter(source.ElementType, string.Empty);

            foreach (var searchCriteria in criterias)
            {
                if (string.IsNullOrEmpty(searchCriteria.Field) || string.IsNullOrEmpty(searchCriteria.Value))
                    continue;

                Expression condition = GetCondition(searchCriteria, parameter);

                switch (operatorValue)
                {
                    case Operator.And:
                        resultCondition = resultCondition != null ? Expression.And(resultCondition, condition) : condition;
                        break;

                    case Operator.Or:
                        resultCondition = resultCondition != null ? Expression.Or(resultCondition, condition) : condition;
                        break;
                }
               
            }

            Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(resultCondition, parameter);

            return source.Where(lambda);
        }

        public static IQueryable<T> WhereAnd<T>(this IQueryable<T> source, List<SearchCriteria> criterias)
        {

            return source.Where(criterias,Operator.And);
        }

        public static IQueryable<T> WhereOr<T>(this IQueryable<T> source, List<SearchCriteria> criterias)
        {
            return source.Where(criterias, Operator.Or);

        }

        private static Expression GetCondition(SearchCriteria searchCriteria, ParameterExpression parameter)
        {
            Expression memberAccess = Expression.Property(parameter, searchCriteria.Field);
            Expression filter = Expression.Constant(searchCriteria.Value);
            //switch operation
            Expression condition = null;
            switch (searchCriteria.Operation)
            {
                //equal ==
                case WhereOperation.Equal:
                    condition = Expression.Equal(memberAccess, filter);
                    break;
                //not equal !=
                case WhereOperation.NotEqual:
                    condition = Expression.NotEqual(memberAccess, filter);
                    break;
                // Greater
                case WhereOperation.Greater:
                    condition = Expression.GreaterThan(memberAccess, filter);
                    break;
                // Greater or equal
                case WhereOperation.GreaterOrEqual:
                    condition = Expression.GreaterThanOrEqual(memberAccess, filter);
                    break;
                // Less
                case WhereOperation.Less:
                    condition = Expression.LessThan(memberAccess, filter);
                    break;
                // Less or equal
                case WhereOperation.LessEqual:
                    condition = Expression.LessThanOrEqual(memberAccess, filter);
                    break;
                //string.Contains()
                case WhereOperation.Contains:
                    condition = Expression.Call(memberAccess,
                        typeof(string).GetMethod("Contains"),
                        Expression.Constant(searchCriteria.Value));
                    break;

            }

            return condition;
        }
    }
}