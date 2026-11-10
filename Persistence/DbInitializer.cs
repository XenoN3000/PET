using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public static class DbInitializer
{
    public static async Task SeedDataAsync(DatabaseContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.QcProtocols.AnyAsync())
        {
            var protocols = new List<QcProtocol>
        {
            // 1. Daily Uniformity & Blank Scan
            new()
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Code = "QC-DAILY-01",
                Title = "Daily Uniformity and Blank Scan",
                Standard = "IAEA Human Health Series No. 1 / AAPM Report 108",
                Frequency = QcFrequency.Daily,
                Description = "A fundamental daily quality check to verify detector stability, crystal photomultiplier response, and identify dead detector blocks or calibration drift.",
                ClinicalPurpose = "Ensures scanner response is spatially uniform, preventing ring artifacts, false positive hot spots, or missed lesions in patient diagnostic images.",
                AcquisitionParameters = "Energy Window: 435-650 keV | Coincidence Window: 4.5 ns | Acquisition Duration: 600s | Matrix: 256x256",
                Phantom = new PhantomSpec
                {
                    Id = Guid.NewGuid(),
                    QcProtocolId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Ge-68/Ga-68 Uniform Cylindrical Phantom",
                    Type = "Cylinder",
                    RecommendedIsotope = "Ge-68 (Germanium-68)",
                    ActivityLevel = "37 - 74 MBq (1 - 2 mCi)",
                    Dimensions = "20 cm diameter x 30 cm length",
                    PreparationInstructions = "Mount securely along scanner central axis using alignment lasers. Ensure no air bubbles in fluid."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        StepNumber = 1,
                        Title = "Perform Morning Blank Scan",
                        Instruction = "Execute scan without any phantom or object in the field of view (FOV) to calibrate detector coincidence baseline.",
                        IsCritical = true,
                        CautionNote = "Verify patient bed is completely empty and retracted."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        StepNumber = 2,
                        Title = "Mount and Center Uniform Cylinder",
                        Instruction = "Mount the Ge-68 cylinder on the table head holder. Align axial and coronal alignment lasers with the phantom fiducial marks.",
                        IsCritical = false
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        StepNumber = 3,
                        Title = "Initiate Acquisition and Slices Reconstruction",
                        Instruction = "Collect at least 20 million coincidence events using standard clinical 3D emission protocol.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        StepNumber = 4,
                        Title = "Compute Uniformity Indices",
                        Instruction = "Place circular Region of Interest (ROI) covering 75% of active phantom diameter across central 50% slices. Calculate Integral Uniformity (IU) and Differential Uniformity (DU).",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        ParameterName = "Integral Uniformity (IU)",
                        ComparisonOperator = "<=",
                        TargetValue = 5.0,
                        Unit = "%",
                        ToleranceDescription = "IU must be <= 5.0% across all evaluated slices.",
                        RemedialAction = "Perform full detector normalization calibration. If persistent, check for hardware SiPM/PMT failures."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        ParameterName = "Differential Uniformity (DU)",
                        ComparisonOperator = "<=",
                        TargetValue = 3.5,
                        Unit = "%",
                        ToleranceDescription = "DU must be <= 3.5% between adjacent pixel blocks.",
                        RemedialAction = "Inspect sinogram for single crystal streak artifacts or synchronization losses."
                    }
                }
            },

            // 2. Spatial Resolution (NEMA NU 2)
            new()
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Code = "NEMA-NU2-SR",
                Title = "Spatial Resolution",
                Standard = "NEMA NU 2-2018 Section 3",
                Frequency = QcFrequency.Periodic,
                Description = "Measures the system's ability to distinguish between two closely spaced radioactive point sources in three orthogonal dimensions (Radial, Tangential, Axial).",
                ClinicalPurpose = "Directly determines the smallest anatomical lesion or lymph node identifiable without severe partial volume blurring.",
                AcquisitionParameters = "Reconstruction: Filtered Back Projection (FBP) with ramp filter (no apodization) | Slice thickness: <= 1/3 of expected FWHM",
                Phantom = new PhantomSpec
                {
                    Id = Guid.NewGuid(),
                    QcProtocolId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Point Source Holder / Capillary Tube",
                    Type = "PointSource",
                    RecommendedIsotope = "F-18 or Na-22",
                    ActivityLevel = "Small concentrated droplet (< 1 mm active diameter), activity <= 10 MBq",
                    Dimensions = "< 1.0 mm internal diameter capillary tube",
                    PreparationInstructions = "Suspend point source in air at specific radial positions: (x=0, y=1 cm), (x=0, y=10 cm), (x=0, y=20 cm) at center of axial FOV."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        StepNumber = 1,
                        Title = "Position Point Source at 1 cm off-center",
                        Instruction = "Place point source at y=1 cm from transverse FOV center. Acquire at least 500,000 prompt counts.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        StepNumber = 2,
                        Title = "Repeat at 10 cm and 20 cm Radially",
                        Instruction = "Shift point source position radially to test degradation of resolution due to detector crystal depth-of-interaction (DOI) effect.",
                        IsCritical = false
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        StepNumber = 3,
                        Title = "Determine FWHM and FWTM",
                        Instruction = "Extract orthogonal 1D response profiles through point maximum. Measure Full Width at Half Maximum (FWHM) and Full Width at Tenth Maximum (FWTM).",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        ParameterName = "Radial FWHM @ 1 cm",
                        ComparisonOperator = "<=",
                        TargetValue = 4.5,
                        Unit = "mm",
                        ToleranceDescription = "Radial FWHM at 1 cm radius must be <= 4.5 mm (or within 10% of manufacturer baseline).",
                        RemedialAction = "Re-check reconstruction filter settings, crystal mapping lookup tables, and gantry positioning calibrations."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        ParameterName = "Axial FWHM @ 1 cm",
                        ComparisonOperator = "<=",
                        TargetValue = 4.8,
                        Unit = "mm",
                        ToleranceDescription = "Axial FWHM at 1 cm radius must be <= 4.8 mm.",
                        RemedialAction = "Verify bed motion encoder synchronization and inter-ring alignment calibration."
                    }
                }
            },

            // 3. Sensitivity (NEMA NU 2)
            new()
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Code = "NEMA-NU2-SENS",
                Title = "System Sensitivity",
                Standard = "NEMA NU 2-2018 Section 5",
                Frequency = QcFrequency.Annual,
                Description = "Measures true coincidence count rate detected per unit of radioactivity present in the scanner field of view.",
                ClinicalPurpose = "High sensitivity allows lower injected tracer doses to patients and shorter acquisition durations while maintaining image diagnostic quality.",
                AcquisitionParameters = "Consecutive acquisitions with 1 to 5 concentric aluminum sleeves to extrapolate count rate with zero attenuation.",
                Phantom = new PhantomSpec
                {
                    Id = Guid.NewGuid(),
                    QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Name = "NEMA Sensitivity Phantom (70 cm Line Source + 5 Aluminum Sleeves)",
                    Type = "LineSource",
                    RecommendedIsotope = "F-18 (Fluorodeoxyglucose or aqueous fluoride)",
                    ActivityLevel = "Low activity to avoid dead-time losses (< 5 MBq at start of scan)",
                    Dimensions = "700 mm active length plastic tube, wall thickness 1 mm",
                    PreparationInstructions = "Uniformly fill line source with calibrated activity. Insert into successive aluminum attenuation sleeves."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        StepNumber = 1,
                        Title = "Position Line Source Centered in Gantry",
                        Instruction = "Suspend line source along scanner central axis (R=0 cm) covering full axial length.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        StepNumber = 2,
                        Title = "Sequential Sleeve Acquisitions",
                        Instruction = "Acquire prompt and delay coincidence counts for each combination of the 5 metal sleeves.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        StepNumber = 3,
                        Title = "Extrapolate to Zero-Attenuation Sensitivity",
                        Instruction = "Perform regression analysis of log(rate) versus sleeve thickness to extrapolate sensitivity at zero attenuation.",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        ParameterName = "Total 3D Sensitivity @ Center",
                        ComparisonOperator = ">=",
                        TargetValue = 7.0,
                        Unit = "cps/kBq",
                        ToleranceDescription = "Total sensitivity at central axis must be >= 7.0 cps/kBq (or within manufacturer specifications).",
                        RemedialAction = "Check energy window lower threshold (typically 435 keV) and crystal detection efficiency maps."
                    }
                }
            },

            // 4. Scatter Fraction & Count Losses
            new()
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Code = "NEMA-NU2-SF",
                Title = "Scatter Fraction, Count Losses and Randoms",
                Standard = "NEMA NU 2-2018 Section 4",
                Frequency = QcFrequency.Annual,
                Description = "Evaluates the scanner's count rate capabilities, dead-time behavior, and scatter fraction over a wide range of radioactive activity concentrations.",
                ClinicalPurpose = "Ensures the scanner does not suffer pulse pile-up or count saturation immediately following high patient injection doses.",
                AcquisitionParameters = "Dynamic series of acquisitions as activity decays over multiple half-lives (e.g., 14-18 hours for F-18).",
                Phantom = new PhantomSpec
                {
                    Id = Guid.NewGuid(),
                    QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Name = "NEMA Scatter Phantom (Solid Polyethylene Cylinder)",
                    Type = "Cylinder",
                    RecommendedIsotope = "F-18",
                    ActivityLevel = "Starting activity ~ 800 - 1000 MBq",
                    Dimensions = "200 mm diameter x 700 mm length, line source inserted in 45 mm offset hole",
                    PreparationInstructions = "Insert line source containing high activity into the eccentric hole (45 mm off-axis) simulating human body torso."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        StepNumber = 1,
                        Title = "Initial High-Activity Scan",
                        Instruction = "Place phantom on bed with line source positioned closest to the table top. Start acquisition at peak activity.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        StepNumber = 2,
                        Title = "Decay Follow-up Acquisition",
                        Instruction = "Automate repeated scans every 15 minutes as activity decays over 14 hours until true coincidence rate is linear with activity.",
                        IsCritical = false
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        StepNumber = 3,
                        Title = "Sinogram Analysis and Scatter Profile Fit",
                        Instruction = "Extract projections, evaluate tails outside 24 mm central strip, and calculate scatter fraction (SF) and Peak NECR (Noise Equivalent Count Rate).",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        ParameterName = "System Scatter Fraction (SF)",
                        ComparisonOperator = "<=",
                        TargetValue = 38.0,
                        Unit = "%",
                        ToleranceDescription = "Scatter fraction must be <= 38.0% for 3D acquisition mode.",
                        RemedialAction = "Inspect lower energy discriminator threshold setting and coincidence time window."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        ParameterName = "Peak NECR",
                        ComparisonOperator = ">=",
                        TargetValue = 80.0,
                        Unit = "kcps",
                        ToleranceDescription = "Peak Noise Equivalent Count Rate must exceed 80 kcps.",
                        RemedialAction = "Check dead-time compensation calibration and electronic processing bandwidth."
                    }
                }
            },

            // 5. Image Quality & Recovery Coefficients
            new()
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Code = "NEMA-NU2-IQ",
                Title = "Image Quality and Partial Volume Effect",
                Standard = "NEMA NU 2-2018 Section 7",
                Frequency = QcFrequency.Periodic,
                Description = "Simulates clinical torso scanning with hot and cold lesions in a warm background to assess contrast recovery, background variability, and lung residual error.",
                ClinicalPurpose = "Directly validates clinical oncology performance: measuring SUV accuracy, small lesion detectability, and Partial Volume Effect (PVE) impact.",
                AcquisitionParameters = "Reconstruction: Clinical TOF-OSEM protocol with attenuation, scatter, and random corrections applied.",
                Phantom = new PhantomSpec
                {
                    Id = Guid.NewGuid(),
                    QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Name = "NEMA IEC Body Phantom with Lung Insert",
                    Type = "IECBody",
                    RecommendedIsotope = "F-18",
                    ActivityLevel = "Background: ~5.3 kBq/mL; Hot Spheres (10, 13, 17, 28 mm): 4:1 or 8:1 contrast ratio; Cold Spheres (22, 37 mm): 0 kBq/mL",
                    Dimensions = "D-shaped body torso cavity, 6 hollow spheres + low-density lung cylinder insert",
                    PreparationInstructions = "Fill spheres first using precision syringe. Fill torso background. Insert cold water/lung insert without bubbles."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        StepNumber = 1,
                        Title = "Position NEMA IEC Body Phantom",
                        Instruction = "Place phantom with spheres centered in axial FOV. Center phantom horizontally and vertically using lasers.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        StepNumber = 2,
                        Title = "Clinical Protocol Acquisition",
                        Instruction = "Acquire scan using clinical oncological time-per-bed (e.g., 2 minutes per bed position) with CT attenuation scan.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        StepNumber = 3,
                        Title = "Calculate Contrast Recovery Coefficients (CRC)",
                        Instruction = "Draw ROIs on the 6 spheres and twelve 37 mm background ROIs across adjacent slices. Calculate percent contrast recovery and lung error.",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        ParameterName = "CRC (28 mm Hot Sphere)",
                        ComparisonOperator = ">=",
                        TargetValue = 65.0,
                        Unit = "%",
                        ToleranceDescription = "Percent contrast recovery for 28 mm sphere must be >= 65.0%.",
                        RemedialAction = "Check OSEM iteration/subset convergence and point spread function (PSF) reconstruction settings."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        ParameterName = "Lung Insert Residual Relative Error",
                        ComparisonOperator = "<=",
                        TargetValue = 18.0,
                        Unit = "%",
                        ToleranceDescription = "Residual activity in cold lung insert must be <= 18.0% (tests scatter and attenuation correction accuracy).",
                        RemedialAction = "Verify CT-to-PET spatial registration and HU-to-attenuation linear coefficient conversion curves."
                    }
                }
            }
        };

            context.QcProtocols.AddRange(protocols);
            await context.SaveChangesAsync();
        }

        if (!await context.Quizzes.AnyAsync())
        {
            var quizzes = new List<Quiz>
            {
                // Quiz 1: Daily Quality Control & Detector Stability
                new()
                {
                    Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                    Title = "Daily QC & Detector Stability",
                    Description = "Assess your clinical knowledge of morning blank scans, daily uniformity checks, and detector failure troubleshooting.",
                    Category = "Daily Routine",
                    DifficultyLevel = "Beginner",
                    EstimatedMinutes = 8,
                    Questions = new List<QuizQuestion>
                    {
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                            Order = 1,
                            QuestionText = "What is the primary purpose of performing a daily morning blank scan before patient acquisitions?",
                            ReferenceProtocol = "IAEA Human Health Series No. 1 / AAPM Report 108",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Calibrate detector coincidence baseline and detect failed PMTs or crystal block drift.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! The blank scan measures unattenuated coincidence events across all detector pairs to detect faulty channels, gain shifts, or bad PMTs before injecting patients."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Measure the spatial resolution at 20 cm radial offset.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Spatial resolution requires point sources placed at specific off-axis coordinates according to NEMA NU 2 Section 3."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Calculate the absolute scatter fraction of the patient population.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Scatter fraction is measured using a 70 cm line source inside a solid polyethylene cylinder (NEMA NU 2 Section 5)."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Sterilize the detector ring gantry electronically.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Electronic sterilization is not a physical PET acquisition procedure."
                                }
                            }
                        },
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                            Order = 2,
                            QuestionText = "What is the standard IAEA acceptance threshold for Daily Integral Uniformity (IU) in a uniform cylindrical phantom?",
                            ReferenceProtocol = "IAEA HHS No. 1 Section 3.2",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "IU <= 5.0%",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! IAEA guidelines specify that Integral Uniformity across the central reconstructed slice must not exceed 5.0%."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "IU <= 1.0%",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. While higher uniformity is desirable, Poisson statistical noise in standard 10-minute scans typically keeps IU around 3-4%."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "IU <= 15.0%",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. An IU of 15% indicates severe non-uniformity that would cause unacceptable diagnostic misinterpretation."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "IU has no upper tolerance limit.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Daily uniformity has strict clinical upper tolerance limits to ensure quantitative SUV accuracy."
                                }
                            }
                        },
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                            Order = 3,
                            QuestionText = "If a sharp concentric circular ring artifact appears in reconstructed cylinder images, what is the most likely root cause?",
                            ReferenceProtocol = "IAEA HHS No. 1 Section 3.3 (Troubleshooting)",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "A malfunctioning detector block or crystal PMT channel causing a sinogram zero-count strip.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! When filtered backprojection or OSEM reconstructs a sinogram with a dead or corrupted crystal strip, it manifests as a circular ring artifact."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Patient bed elevation motor calibration error.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Bed motor errors cause axial slice shifts or registration mismatches, not concentric rings."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Normal radioactive decay of the Ge-68 isotope.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Ge-68 has a 271-day half-life; steady physical decay is corrected by software and does not cause ring artifacts."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Excessive ambient room humidity.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. While HVAC stability is required for electronics, humidity does not produce localized ring artifacts."
                                }
                            }
                        }
                    }
                },
                // Quiz 2: Spatial Resolution & NEMA NU 2
                new()
                {
                    Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                    Title = "Spatial Resolution (NEMA NU 2)",
                    Description = "Master the principles of Point Spread Function (PSF), FWHM/FWTM calculation, and parallax effect.",
                    Category = "NEMA Standards",
                    DifficultyLevel = "Intermediate",
                    EstimatedMinutes = 10,
                    Questions = new List<QuizQuestion>
                    {
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                            Order = 1,
                            QuestionText = "According to NEMA NU 2-2018 Section 3, what source geometry and radionuclide are specified for spatial resolution testing?",
                            ReferenceProtocol = "NEMA NU 2-2018 Section 3",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "A point source with active dimensions < 1.0 mm suspended in air with F-18.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! NEMA NU 2 stipulates sub-millimeter point sources suspended in air to minimize photon scattering while assessing intrinsic scanner resolution."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "A 20 cm diameter uniform water cylinder with Ga-68.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Uniform cylinders are used for daily uniformity or sensitivity, not point-spread resolution."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "A solid aluminum bar with Co-57 transmission source.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Co-57 single-photon transmission was used in legacy scanners, not modern coincidence PET resolution testing."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "An anthropomorphic lung torso phantom.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Anthropomorphic phantoms assess image quality, contrast recovery, and attenuation correction."
                                }
                            }
                        },
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                            Order = 2,
                            QuestionText = "How is Full Width at Half Maximum (FWHM) calculated from an experimental line profile?",
                            ReferenceProtocol = "NEMA NU 2-2018 Section 3.4",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Distance between profile coordinates where net intensity equals 50% of peak height via linear interpolation.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! NEMA NU 2 requires linear interpolation between adjacent samples spanning 50% of the maximum peak value above background."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Physical width of a single detector crystal face in millimeters.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Crystal size influences resolution, but FWHM is measured from reconstructed image profile data."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Distance between points where profile drops to 10% of maximum.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. 10% of maximum defines the Full Width at Tenth Maximum (FWTM), measuring the profile tails."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Total area under the Gaussian curve divided by scan time.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Profile area reflects total counts or sensitivity, not spatial resolution width."
                                }
                            }
                        },
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                            Order = 3,
                            QuestionText = "Why does radial spatial resolution degrade significantly as a point source moves from the scanner center to 10 cm or 20 cm off-axis?",
                            ReferenceProtocol = "NEMA NU 2-2018 & Cherry Physics",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Parallax effect (Depth of Interaction ambiguity) causing oblique crystal penetration.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! Photons striking off-center crystals enter obliquely and can deposit energy in adjacent crystals before interacting, widening the radial point spread function."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Increased positron range of Fluorine-18 at the detector edges.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Positron kinetic energy and range depend on isotope physics, not location in the scanner bore."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Slowing down of the electronic coincidence clock at radial edges.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Electronic clock frequency is uniform across all ASIC processing channels."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Earth's gravitational force on the 511 keV annihilation photons.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Gravitational deflection on gamma photons over 1 meter is completely negligible."
                                }
                            }
                        }
                    }
                },
                // Quiz 3: Deep Learning & Partial Volume Correction
                new()
                {
                    Id = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                    Title = "AI Denoising & Partial Volume Effect",
                    Description = "Evaluate your understanding of convolutional networks, U-Net skip connections, low-dose restoration, and SUV recovery.",
                    Category = "AI & Processing",
                    DifficultyLevel = "Advanced",
                    EstimatedMinutes = 12,
                    Questions = new List<QuizQuestion>
                    {
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                            Order = 1,
                            QuestionText = "What essential function do skip connections perform in a U-Net architecture for low-dose PET denoising?",
                            ReferenceProtocol = "Ronneberger et al. / Academic Thesis Proposal",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Transfer high-resolution spatial feature maps and lesion edges directly from encoder to decoder.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! Max-pooling in the contracting path abstracts semantic features but loses fine spatial location; skip connections bypass downsampling to preserve sharp lesion boundaries."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Eliminate the need for backpropagation training.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Skip connections still require standard gradient backpropagation during deep network optimization."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Reduce the total number of convolutional layers to zero.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Skip connections connect convolutional layers; they do not replace them."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Automatically segment CT bones into Hounsfield units.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. CT segmentation is a separate pre-processing task; skip connections facilitate multi-scale feature propagation."
                                }
                            }
                        },
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                            Order = 2,
                            QuestionText = "What is the primary physical cause of the Partial Volume Effect (PVE) in small lesions (< 2x scanner FWHM)?",
                            ReferenceProtocol = "NEMA NU 2 Section 7 (Image Quality) / IAEA HHS No. 1",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Finite scanner spatial resolution causing spill-out of lesion counts into surrounding lower-activity tissue.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! When a structure is smaller than roughly twice the system FWHM, blurring causes counts to 'spill out', leading to significant underestimation of true SUV."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Biological resistance of tumor cells against F-18 FDG uptake.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. PVE is an imaging physics artifact caused by finite resolution, not biological uptake resistance."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Detector dead-time saturation inside the lesion area.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Dead-time affects high total event rates across entire detector blocks, not localized micro-lesions."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "Failure to apply physical decay correction for Carbon-11.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Decay correction adjusts for elapsed time, not geometric resolution blurring."
                                }
                            }
                        },
                        new()
                        {
                            Id = Guid.NewGuid(),
                            QuizId = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                            Order = 3,
                            QuestionText = "Why is Structural Similarity Index (SSIM) clinically superior to Mean Squared Error (MSE) when assessing restored PET images?",
                            ReferenceProtocol = "Wang et al. SSIM / Medical Physics Literature",
                            Options = new List<QuizOption>
                            {
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "SSIM models human visual perception by independently comparing luminance, contrast, and structural texture.",
                                    IsCorrect = true,
                                    ClinicalRationale = "Correct! MSE equally penalizes smooth low-frequency shifts and high-frequency structural edges, whereas SSIM specifically gauges diagnostic texture and anatomical fidelity."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "SSIM values can only be negative decibel values.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. SSIM ranges between 0.0 and 1.0, where 1.0 represents perfect structural congruence."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "SSIM does not require a ground-truth reference image.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. SSIM is a full-reference objective quality metric that compares target against gold standard."
                                },
                                new()
                                {
                                    Id = Guid.NewGuid(),
                                    OptionText = "SSIM only evaluates binary segmentation masks.",
                                    IsCorrect = false,
                                    ClinicalRationale = "Incorrect. Binary segmentation masks are evaluated by Dice coefficient; SSIM evaluates continuous grayscale image textures."
                                }
                            }
                        }
                    }
                }
            };

            context.Quizzes.AddRange(quizzes);
            await context.SaveChangesAsync();
        }
    }
}
