using System.ComponentModel.DataAnnotations;

namespace CleanArchFramework.Domain.Common
{
    public abstract class BaseEntity<T> 
    {
        [Key]
        public T Id { get; set; }
        protected BaseEntity()
        {

        }
        protected BaseEntity(T id)
        {
            Id = id;
        }
    }
}
