using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services;

public class BienService : IBienService
{
    private IBienRepository _repository;

    public BienService(IBienRepository repository)
    {
        _repository = repository;
    }

    public Task<Bien> GetBienByIdAsync(int id, CancellationToken cancellationToken)
    {
        return _repository.GetBienByIdAsync(id,  cancellationToken);
    }
}