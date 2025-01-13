using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("technicians")]
public class Technician
{
    [Key]
    [Column("id")]
    public Guid Id { get; private set; }

    // Technician Status Enum

    [Required]
    [Column("technician_status_id")]
    public virtual int StatusId { get; private set; }

    [NotMapped]
    [EnumDataType(typeof(TechnicianStatus))]
    public TechnicianStatus Status
    {
        get
        {
            return (TechnicianStatus)this.StatusId;
        }
        set
        {
            this.StatusId = (int)value;
        }
    }

    // Individual Person Reference

    [Required]
    [Column("individual_person_id")]
    public Guid IndividualPersonId { get; private set; }

    [ForeignKey(nameof(IndividualPersonId))]
    public IndividualPerson? IndividualPerson { get; private set; }

    protected Technician()
    {
    }

    public Technician(TechnicianStatus technicianStatus, Guid individualPersonId)
    {
        Id = Guid.NewGuid();
        Status = technicianStatus;
        IndividualPersonId = individualPersonId;
    }

    public void MakeUnnavaliable()
    {
        Status = TechnicianStatus.Unavaliable;
    }

    public void MakeAvaliable()
    {
        Status = TechnicianStatus.Available;
    }

    public void TurnStatusToWorking()
    {
        Status = TechnicianStatus.Working;
    }
}

public enum TechnicianStatus
{
    Offline = 0,
    Unavaliable = 1,
    Available = 2,
    Working = 3,
}
