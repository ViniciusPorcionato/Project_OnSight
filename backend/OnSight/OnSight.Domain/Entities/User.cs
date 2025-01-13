using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("users")]
[Index(nameof(Email), IsUnique = true)]
public class User
{
    [NotMapped]
    private const string DEFAULT_USER_PHOTO_URL = "https://blobvitalhubg15.blob.core.windows.net/containervitalhubpedro/imagemPadrao.jpg";

    [Key]
    [Column("id")]
    public Guid Id { get; private set; }

    // User Type Enum

    [Column("user_type_id")]
    public virtual int UserTypeId { get; private set; }

    [NotMapped]
    [EnumDataType(typeof(UserTypes))]
    public UserTypes UserType
    {
        get
        {
            return (UserTypes)this.UserTypeId;
        }
        set
        {
            this.UserTypeId = (int)value;
        }
    }

    // Properties

    [Required]
    [Column("email")]
    public string? Email { get; private set; }

    [Required]
    [Column("phone_number", TypeName = "char(11)")]
    public string? PhoneNumber { get; private set; }

    [Required]
    [Column("password_hash")]
    public byte[]? PasswordHash { get; private set; }

    [Required]
    [Column("password_salt")]
    public byte[]? PasswordSalt { get; private set; }

    [Column("password_recover_code", TypeName = "char(4)")]
    public string? PasswordRecoverCode { get; private set; }

    [Required]
    [Column("profile_image_url")]
    public string? ProfileImageUrl { get; private set; }

    protected User()
    {
    }

    public User(UserTypes userType, string email, string phoneNumber, byte[] passwordHash, byte[] passwordSalt, string? profileImageUrl)
    {
        Id = Guid.NewGuid();

        UserType = userType;
        Email = email;
        PhoneNumber = phoneNumber;
        PasswordHash = passwordHash;
        PasswordSalt = passwordSalt;

        ProfileImageUrl = profileImageUrl != null ? profileImageUrl : DEFAULT_USER_PHOTO_URL;
    }
}

public enum UserTypes
{
    Administrator = 0,
    Attendant = 1,
    Technician = 2,
    Client = 3
}
