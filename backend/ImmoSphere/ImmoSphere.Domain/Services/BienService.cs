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

    public Bien getBienById(int id)
    {
        return _repository.getBienById(id);
    }
}