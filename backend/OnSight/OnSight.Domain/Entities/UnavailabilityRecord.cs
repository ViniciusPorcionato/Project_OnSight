using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities
{
    [Table("unavailability_records")]
    public class UnavailabilityRecord
    {
        [Key]
        [Column("id")]
        public Guid Id { get; private set; }

        // Technician Reference

        [Required]
        [Column("technician_id")]
        public Guid TechnicianId { get; private set; }

        [ForeignKey(nameof(TechnicianId))]
        public Technician? Technician { get; private set; }

        // Properties

        [Required]
        [Column("reason_description")]
        public string? ReasonDescription { get; private set; }

        [Required]
        [Column("estimated_duration_time")]
        public TimeOnly EstimatedDurationTime { get; private set; }

        [Required]
        [Column("created_on")]
        public DateTime CreatedOn { get; private set; }

        protected UnavailabilityRecord()
        {
        }

        public UnavailabilityRecord(Guid technicianId, string reasonDescription, TimeOnly estimatedDurationTime)
        {
            Id = Guid.NewGuid();

            TechnicianId = technicianId;
            ReasonDescription = reasonDescription;
            EstimatedDurationTime = estimatedDurationTime;

            CreatedOn = DateTime.UtcNow;
        }
    }
}
