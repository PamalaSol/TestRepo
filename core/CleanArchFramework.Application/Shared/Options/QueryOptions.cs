using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace CleanArchFramework.Application.Shared.Options
{
    public class QueryOptions
    {


        private int? _pageNo = 1;
        private int? _pageSize = 10;
        private int _orderBy = 1;
        private int _maxPageSize = 2500;
        [MaxLength(50)]
        public string? SearchTerm { get; set; }
        public enum OrderEnum
        {
            _dsc = 1,
            _asc = 2,
            _date_asc = 3,
            _date_dsc = 4
        }

        public QueryOptions()
        {
            this._pageNo = 1;
            this.PageSize = 25;
            this._maxPageSize = 2500;
            _orderBy = (int)OrderEnum._dsc;
        }
        public int PageSize
        {
            get => _pageSize.Value;
            set => _pageSize = value;
        }
        public IQueryable<TEntity> ApplyOrderBy<TEntity>(
            IQueryable<TEntity> query,
            Expression<Func<TEntity, object>> defaultOrderExpression,
            Expression<Func<TEntity, object>> customDateOrderExpression)
        {
            return OrderBy switch
            {
                (int)OrderEnum._dsc => query.OrderByDescending(defaultOrderExpression),
                (int)OrderEnum._asc => query.OrderBy(defaultOrderExpression),
                (int)OrderEnum._date_asc => query.OrderBy(customDateOrderExpression), // Change to your date property
                (int)OrderEnum._date_dsc => query.OrderByDescending(customDateOrderExpression), // Change to your date property
                _ => query
            };
        }
        public int PageNo
        {
            get
            {
                return _pageNo.GetValueOrDefault(0) <= 1
                    ? 1
                    : _pageNo.Value;
            }
            set => _pageNo = value;
        }

        public int OrderBy
        {
            get => (int)(OrderEnum)_orderBy;
            set => _orderBy = value;
        }
        public int Skip => (PageNo - 1) * PageSize;
    }

}
