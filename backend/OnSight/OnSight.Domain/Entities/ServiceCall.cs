using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("service_calls")]
public class ServiceCall
{
    [Key]
    [Column("id")]
    public Guid Id { get; private set; }

    // Technician Reference

    [Column("technician_id")]
    public Guid? TechnicianId { get; private set; }

    [ForeignKey(nameof(TechnicianId))]
    public Technician? Technician { get; private set; }

    // Responsible Attendant Reference

    [Column("responsible_attendant_id")]
    public Guid? ResponsibleAttendantId { get; private set; }

    [ForeignKey(nameof(ResponsibleAttendantId))]
    public IndividualPerson? IndividualPerson { get; private set; }

    // Client Reference

    [Required]
    [Column("client_id")]
    public Guid ClientId { get; private set; }

    [ForeignKey(nameof(ClientId))]
    public Client? Client { get; private set; }

    // Service Type Enum

    [Required]
    [Column("service_type_id")]
    public virtual int ServiceTypeId { get; private set; }

    [NotMapped]
    [EnumDataType(typeof(ServiceTypes))]
    public ServiceTypes ServiceType
    {
        get
        {
            return (ServiceTypes)this.ServiceTypeId;
        }
        set
        {
            this.ServiceTypeId = (int)value;
        }
    }

    // Call Status Enum

    [Column("call_status_id")]
    public virtual int CallStatusId { get; private set; }

    [NotMapped]
    [EnumDataType(typeof(CallStatuses))]
    public CallStatuses CallStatus
    {
        get
        {
            return (CallStatuses)this.CallStatusId;
        }
        set
        {
            this.CallStatusId = (int)value;
        }
    }

    // Urgency Status Enum

    [Column("urgency_status_id")]
    public virtual int? UrgencyStatusId { get; private set; }

    [NotMapped]
    [EnumDataType(typeof(UrgencyStatuses))]
    public UrgencyStatuses UrgencyStatus
    {
        get
        {
            return (UrgencyStatuses)this.UrgencyStatusId!;
        }
        set
        {
            this.UrgencyStatusId = (int)value;
        }
    }

    // Address Reference

    [Required]
    [Column("address_id")]
    public Guid AddressId { get; private set; }

    [ForeignKey(nameof(AddressId))]
    public Address? Address { get; private set; }

    // Properties

    [StringLength(11, MinimumLength = 11)]
    [Column("call_code", TypeName = "char(11)")]
    public string CallCode { get; private set; }

    [Required]
    [Column("contact_email")]
    public string ContactEmail { get; private set; }

    [Required]
    [StringLength(11, MinimumLength = 11)]
    [Column("contact_phone_number", TypeName = "char(11)")]
    public string ContactPhoneNumber { get; private set; }

    [Required]
    [Column("description")]
    public string Description { get; private set; }

    [Column("deadline")]
    public DateOnly? Deadline { get; private set; }

    [Column("creation_date_time")]
    public DateTime? CreationDateTime { get; private set; }

    [Column("attribution_date_time")]
    public DateTime? AttributionDateTime { get; private set; }

    [Column("arrival_date_time")]
    public DateTime? ArrivalDateTime { get; private set; }

    [Column("conclusion_date_time")]
    public DateTime? ConclusionDateTime { get; private set; }

    [Required]
    [Column("is_recurring_call")]
    public bool IsRecurringCall { get; private set; }

    [Column("instant_solution_description")]
    public string? InstantSolutionDescription { get; set; }

    protected ServiceCall(string callCode, string contactEmail, string contactPhoneNumber, string description)
    {
        CallCode = callCode;
        ContactEmail = contactEmail;
        ContactPhoneNumber = contactPhoneNumber;
        Description = description;
    }


    public ServiceCall(Guid clientId, ServiceTypes serviceType, Guid addressId, string contactEmail, string contactPhoneNumber, string description, bool isRecurringCall)
    {
        Id = Guid.NewGuid();

        Random random = new Random();
        string callCode = random.NextInt64(10000000000, 99999999999).ToString();
        CallCode = callCode!;

        ClientId = clientId;
        ServiceType = serviceType;
        AddressId = addressId;
        ContactEmail = contactEmail;
        ContactPhoneNumber = contactPhoneNumber;
        Description = description;
        IsRecurringCall = isRecurringCall;

        CallStatus = CallStatuses.Opened;

        CreationDateTime = DateTime.UtcNow;
    }

    public void AttendantUpdate(Guid responsibleAttendentId, DateOnly deadline, string? description, ServiceTypes? serviceType, UrgencyStatuses urgencyStatus, string? instantSolutionDescription, bool isCallApproved)
    {
        if (CallStatus != CallStatuses.Opened)
            throw new ArgumentException("This service call is in progress, finished or canceled, so you can not update your data");

        if (!isCallApproved && (instantSolutionDescription == null || instantSolutionDescription == ""))
            throw new ArgumentException("For disapprove a service call you should give a instant solution description");

        ResponsibleAttendantId = responsibleAttendentId;
        Deadline = deadline;
        UrgencyStatus = urgencyStatus;

        if (description != null)
        {
            Description = description;
        }

        if (serviceType != null)
        {
            ServiceType = (ServiceTypes)serviceType;
        }

        if (instantSolutionDescription != null && instantSolutionDescription != "")
        {
            InstantSolutionDescription = instantSolutionDescription;

            if (isCallApproved)
            {
                CallStatus = CallStatuses.Finished;
                ConclusionDateTime = DateTime.UtcNow;
            }
            else
            {
                CallStatus = CallStatuses.Canceled;
            }

            return;
        }

        CallStatus = CallStatuses.InProgress;
    }

    public void AssignCallToTechnician(Guid technicianId)
    {
        TechnicianId = technicianId;

        AttributionDateTime = DateTime.UtcNow;
    }

    public void FinishServiceCall()
    {
        ConclusionDateTime = DateTime.UtcNow;
        CallStatus = CallStatuses.Finished;
    }
}

public enum CallStatuses
{
    Opened = 0,
    InProgress = 1,
    Finished = 2,
    Canceled = 3
}

public enum UrgencyStatuses
{
    NotUrgent = 0,
    LessUrgent = 1,
    Urgent = 2
}

public enum ServiceTypes
{
    Installation = 0,
    Maintenance = 1
}
