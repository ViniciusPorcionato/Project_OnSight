using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("metrics_categories")]
public class MetricCategory
{
    [Key]
    [Column("id")]
    public Guid Id { get; private set; }

    [Required]
    [Column("name")]
    public string? Name { get; private set; }

    [Required]
    [Column("metric_description")]
    public string? MetricDescription { get; private set; }

    [Column("metric_unit")]
    public string? MetricUnit { get; private set; }

    protected MetricCategory() { }

    public MetricCategory(string name, string metricDescription, string? metricUnit)
    {
        Id = Guid.NewGuid();

        Name = name;
        MetricDescription = metricDescription;
        MetricUnit = metricUnit!;
    }
}
