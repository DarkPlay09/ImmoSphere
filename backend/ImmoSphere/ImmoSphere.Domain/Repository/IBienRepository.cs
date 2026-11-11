using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Domain.Repository;

public interface IBienRepository
{
    public Bien getBienById(int id);
}