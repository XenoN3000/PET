using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) 
        : base(options)
    {
    }

    public DbSet<QcProtocol> QcProtocols => Set<QcProtocol>();
    public DbSet<PhantomSpec> PhantomSpecs => Set<PhantomSpec>();
    public DbSet<TestStep> TestSteps => Set<TestStep>();
    public DbSet<AcceptanceCriterion> AcceptanceCriteria => Set<AcceptanceCriterion>();
    public DbSet<QcProtocolTranslation> QcProtocolTranslations => Set<QcProtocolTranslation>();
    public DbSet<TestStepTranslation> TestStepTranslations => Set<TestStepTranslation>();
    public DbSet<PhantomSpecTranslation> PhantomSpecTranslations => Set<PhantomSpecTranslation>();
    public DbSet<AcceptanceCriterionTranslation> AcceptanceCriterionTranslations => Set<AcceptanceCriterionTranslation>();

    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<QuizOption> QuizOptions => Set<QuizOption>();
    public DbSet<QuizTranslation> QuizTranslations => Set<QuizTranslation>();
    public DbSet<QuizQuestionTranslation> QuizQuestionTranslations => Set<QuizQuestionTranslation>();
    public DbSet<QuizOptionTranslation> QuizOptionTranslations => Set<QuizOptionTranslation>();

    public DbSet<LabExperiment> LabExperiments => Set<LabExperiment>();
    public DbSet<LabExperimentTranslation> LabExperimentTranslations => Set<LabExperimentTranslation>();
    public DbSet<AiScenario> AiScenarios => Set<AiScenario>();
    public DbSet<AiScenarioTranslation> AiScenarioTranslations => Set<AiScenarioTranslation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Quiz
        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);

            entity.HasMany(e => e.Questions)
                .WithOne()
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.QuizId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.DifficultyLevel).HasMaxLength(50);
        });

        // QuizQuestion
        modelBuilder.Entity<QuizQuestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.QuestionText).IsRequired().HasMaxLength(1000);

            entity.HasMany(e => e.Options)
                .WithOne()
                .HasForeignKey(o => o.QuizQuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.QuizQuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizQuestionTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.QuestionText).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.ReferenceProtocol).HasMaxLength(200);
        });

        // QuizOption
        modelBuilder.Entity<QuizOption>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OptionText).IsRequired().HasMaxLength(500);
            entity.Property(e => e.ClinicalRationale).IsRequired().HasMaxLength(1000);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.QuizOptionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizOptionTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.OptionText).IsRequired().HasMaxLength(500);
            entity.Property(e => e.ClinicalRationale).HasMaxLength(1000);
        });

        // QcProtocol
        modelBuilder.Entity<QcProtocol>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Standard).HasMaxLength(100);

            entity.HasOne(e => e.Phantom)
                .WithOne()
                .HasForeignKey<PhantomSpec>(p => p.QcProtocolId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Steps)
                .WithOne()
                .HasForeignKey(s => s.QcProtocolId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.AcceptanceCriteria)
                .WithOne()
                .HasForeignKey(a => a.QcProtocolId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.QcProtocolId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QcProtocolTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
        });

        // TestStep
        modelBuilder.Entity<TestStep>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.TestStepId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TestStepTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CautionNote).HasMaxLength(500);
        });

        // PhantomSpec
        modelBuilder.Entity<PhantomSpec>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.PhantomSpecId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PhantomSpecTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).HasMaxLength(100);
        });

        // AcceptanceCriterion
        modelBuilder.Entity<AcceptanceCriterion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ParameterName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ComparisonOperator).HasMaxLength(10);
            entity.Property(e => e.Unit).HasMaxLength(20);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.AcceptanceCriterionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AcceptanceCriterionTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.ParameterName).IsRequired().HasMaxLength(100);
        });

        // LabExperiment
        modelBuilder.Entity<LabExperiment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Standard).HasMaxLength(100);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.LabExperimentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<LabExperimentTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
        });

        // AiScenario
        modelBuilder.Entity<AiScenario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(100);

            entity.HasMany(e => e.Translations)
                .WithOne()
                .HasForeignKey(t => t.AiScenarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AiScenarioTranslation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Language).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
        });
    }
}
