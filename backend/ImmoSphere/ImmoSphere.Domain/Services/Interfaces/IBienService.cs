using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Domain.Services.Interfaces;

public interface IBienService
{
    public Bien getBienById(int id);
}