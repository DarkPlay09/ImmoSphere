namespace ImmoSphere.Domain.Core.Bien;

public class Disponibilite
{
    public int DisponibiliteId { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }
    public string State { get; set; }
}