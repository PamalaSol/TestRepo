
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Engines;
using CleanArchFramework.Application.Contracts.Persistence;
using CleanArchFramework.Application.Shared.Options;
using CleanArchFramework.Application.Shared.Result;
using CleanArchFramework.Domain.Entities;
using CleanArchFramework.Infrastructure.Persistence;
using CleanArchFramework.Infrastructure.Persistence.Repositories;

namespace CleanArchFramework.Benchmark
{
    public interface IDependencyContainer
    {
        void Register<TService, TImplementation>() where TImplementation : TService;
        TService Resolve<TService>();
        void Dispose();
    }

    public class SimpleDependencyContainer : IDependencyContainer
    {
        private readonly Dictionary<Type, Type> _registeredTypes = new Dictionary<Type, Type>();
        private readonly Dictionary<Type, object> _resolvedInstances = new Dictionary<Type, object>();

        public void Register<TService, TImplementation>() where TImplementation : TService
        {
            _registeredTypes[typeof(TService)] = typeof(TImplementation);
        }

        public TService Resolve<TService>()
        {
            if (_resolvedInstances.TryGetValue(typeof(TService), out var instance))
            {
                return (TService)instance;
            }

            if (_registeredTypes.TryGetValue(typeof(TService), out var implementationType))
            {
                var instanceToResolve = CreateInstance(implementationType);
                _resolvedInstances[typeof(TService)] = instanceToResolve;
                return (TService)instanceToResolve;
            }

            throw new InvalidOperationException($"Type {typeof(TService)} not registered.");
        }

        private object CreateInstance(Type type)
        {
            var constructor = type.GetConstructors().SingleOrDefault();
            if (constructor == null)
            {
                throw new InvalidOperationException($"Type {type} does not have a public constructor.");
            }

            var parameters = constructor.GetParameters()
                .Select(parameter => Resolve<IProductRepository>())
                .ToArray();

            return Activator.CreateInstance(type, parameters);
        }

        public void Dispose()
        {
            foreach (var instance in _resolvedInstances.Values)
            {
                (instance as IDisposable)?.Dispose();
            }
        }
    }
 
    [SimpleJob(RunStrategy.ColdStart, launchCount: 1, warmupCount: 5, id: "FastAndDirtyJob")]
    [MemoryDiagnoser]
    public class BenchmarkProductHandlers
    {
        private IProductRepository _productRepository;
        private IDependencyContainer _container;

        //public BenchmarkProductHandlers()
        //{
        //    _container = new SimpleDependencyContainer();
        //    _container.Register<IProductRepository, ProductRepository>();
        //    _container.Register<PersistenceDbContext, PersistenceDbContext>();
        //    _productRepository = _container.Resolve<IProductRepository>();
        //}

        //[GlobalSetup]
        //public void Setup()
        //{
        //    _container = new SimpleDependencyContainer();
        //    _container.Register<IProductRepository, ProductRepository>();
        //    _container.Register<PersistenceDbContext, PersistenceDbContext>();
        //    _productRepository = _container.Resolve<IProductRepository>();

        //}

        //[Benchmark]
        //public async Task<PagedResult<Product>> GetPagedProductAndOrderResponseAsync()
        //{

        //    QueryOptions queryOptions = new QueryOptions();
        //    var allProduct = await _productRepository.GetPagedProductAndOrderResponseAsync(
        //        x => string.IsNullOrEmpty(queryOptions.SearchTerm) || x.Heading.Localizations.Any(z =>
        //            z.Value.Contains(queryOptions.SearchTerm
        //            )),
        //        queryOptions, x => x.Id,
        //        x => x.CreatedDate);
        //    return allProduct;
        //}

        [Benchmark]
        public  char[] CharArray()
        {

            return "asda".ToCharArray();
        }
        //[Benchmark]
        //public async Task<PagedResult<Product>> GetPagedProductAndOrderResponseManualAsync()
        //{

        //    QueryOptions queryOptions = new QueryOptions();
        //    var allProduct = await _productRepository.GetPagedProductAndOrderResponseManualAsync(
        //        x => string.IsNullOrEmpty(queryOptions.SearchTerm) || x.Heading.Localizations.Any(z =>
        //            z.Value.Contains(queryOptions.SearchTerm
        //            )),
        //        queryOptions, x => x.Id,
        //        x => x.CreatedDate);
        //    return allProduct;
        //}
    }
}
