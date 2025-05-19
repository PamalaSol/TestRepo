cd    CleanArchFramework.Infrastructure
Cd persistence folder run commands for migrations:
dotnet ef migrations add Init --context PersistenceDbContext -s ../CleanArchFramework.API -o Persistence/Migrations
dotnet ef database update --context PersistenceDbContext -s ../CleanArchFramework.API 

dotnet ef migrations add Init --context IdentityDbContext -s ../CleanArchFramework.API -o Identity/Migrations
dotnet ef database update --context IdentityDbContext -s ../CleanArchFramework.API 

dotnet ef migrations remove --context PersistenceDbContext -s ../CleanArchFramework.API 

dotnet ef migrations remove --context PersistenceDbContext -s ../CleanArchFramework.API 


