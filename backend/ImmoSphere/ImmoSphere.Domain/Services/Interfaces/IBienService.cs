using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Domain.Services.Interfaces;

public interface IBienService
{
    public Task<Bien> GetBienByIdAsync(int id, CancellationToken cancellationToken);

    public Task<Bien> GetPublishedBienByIdAsync(int id, CancellationToken cancellationToken);
}