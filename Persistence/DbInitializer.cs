using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public static class DbInitializer
{
    public static async Task SeedDataAsync(DatabaseContext context)
    {
        await context.Database.EnsureCreatedAsync();

        await SeedProtocolsAsync(context);
        await SeedQuizzesAsync(context);
        await SeedLabExperimentsAsync(context);
        await SeedAiScenariosAsync(context);

        await context.SaveChangesAsync();
    }

    private static async Task SeedProtocolsAsync(DatabaseContext context)
    {
        if (await context.QcProtocols.AnyAsync())
        {
            // If protocols exist but translations are empty, backfill translations
            if (!await context.QcProtocolTranslations.AnyAsync())
            {
                var existingProtocols = await context.QcProtocols
                    .Include(p => p.Phantom)
                    .Include(p => p.Steps)
                    .Include(p => p.AcceptanceCriteria)
                    .ToListAsync();

                foreach (var protocol in existingProtocols)
                {
                    AddProtocolTranslations(protocol);
                }
                await context.SaveChangesAsync();
            }
            return;
        }

        var protocols = GetPredefinedProtocols();
        foreach (var protocol in protocols)
        {
            AddProtocolTranslations(protocol);
        }

        context.QcProtocols.AddRange(protocols);
        await context.SaveChangesAsync();
    }

    private static List<QcProtocol> GetPredefinedProtocols()
    {
        return new List<QcProtocol>
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
                    RecommendedIsotope = "F-18 or Ge-68",
                    ActivityLevel = "< 5 MBq (to avoid deadtime count losses)",
                    Dimensions = "70 cm line source, 5 nested aluminum tubes of wall thickness 1.25 mm each",
                    PreparationInstructions = "Mount line source horizontally along scanner center axis. Collect scans adding one sleeve at a time."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        StepNumber = 1,
                        Title = "Aquire Line Source with Sleeves 1 through 5",
                        Instruction = "Acquire five separate scans with increasing aluminum wall thickness at r=0 cm (center) and r=10 cm off-center.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        StepNumber = 2,
                        Title = "Extrapolate Zero-Attenuation Sensitivity",
                        Instruction = "Fit exponential decay regression against cumulative aluminum wall thickness to extrapolate sensitivity without attenuation.",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        ParameterName = "Total System Sensitivity @ Center",
                        ComparisonOperator = ">=",
                        TargetValue = 7.5,
                        Unit = "cps/kBq",
                        ToleranceDescription = "Extrapolated sensitivity at r=0 cm must meet or exceed 7.5 cps/kBq (depending on axial FOV specification).",
                        RemedialAction = "Check coincidence timing window, lower energy thresholds, and PMT high voltage stability."
                    }
                }
            },

            // 4. Scatter Fraction and Count Losses (NEMA NU 2)
            new()
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Code = "NEMA-NU2-SF",
                Title = "Scatter Fraction and Count Losses",
                Standard = "NEMA NU 2-2018 Section 4",
                Frequency = QcFrequency.Periodic,
                Description = "Evaluates scanner count rate performance, detector deadtime losses, and scatter fraction across varying activity concentrations up to peak NECR.",
                ClinicalPurpose = "Identifies peak Noise Equivalent Count Rate (NECR) to optimize patient injected dose and avoid detector saturation artifacts in high-uptake procedures.",
                AcquisitionParameters = "High activity start (~800 MBq F-18). Consecutive 15-minute frames acquired over 16 to 18 hours until decayed.",
                Phantom = new PhantomSpec
                {
                    Id = Guid.NewGuid(),
                    QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Name = "NEMA NU 2 Scatter Phantom (20 cm Polyethylene Cylinder)",
                    Type = "Cylinder",
                    RecommendedIsotope = "F-18",
                    ActivityLevel = "Initial activity: ~800 MBq (21.6 mCi)",
                    Dimensions = "20 cm diameter x 70 cm solid polyethylene cylinder with 45 mm off-axis line insert",
                    PreparationInstructions = "Center cylinder on patient table. Thread flexible F-18 line source through the eccentric channel (at r=45 mm)."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        StepNumber = 1,
                        Title = "Setup Decay Acquisition Sequence",
                        Instruction = "Program multi-frame sequence of 25-30 frames over 5 half-lives of F-18 (approx. 10 hours).",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        StepNumber = 2,
                        Title = "Compute NECR Curve and Scatter Fraction",
                        Instruction = "Separate prompt, random, and scattered events on transverse sinogram profiles. Calculate peak NECR and scatter fraction at low activity.",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        ParameterName = "Scatter Fraction (SF)",
                        ComparisonOperator = "<=",
                        TargetValue = 38.0,
                        Unit = "%",
                        ToleranceDescription = "System scatter fraction must be <= 38.0% at low activity concentrations.",
                        RemedialAction = "Check energy window calibration (lower threshold at 435 keV) and energy resolution maps."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        ParameterName = "Peak NECR",
                        ComparisonOperator = ">=",
                        TargetValue = 120.0,
                        Unit = "kcps",
                        ToleranceDescription = "Peak Noise Equivalent Count Rate must exceed 120 kcps for standard clinical activity ranges.",
                        RemedialAction = "Inspect coincidence processor buffers and electronic deadtime compensation constants."
                    }
                }
            },

            // 5. Image Quality & Accuracy of Corrections (NEMA NU 2)
            new()
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Code = "NEMA-NU2-IQ",
                Title = "Image Quality and Accuracy of Attenuation Corrections",
                Standard = "NEMA NU 2-2018 Section 7",
                Frequency = QcFrequency.Annual,
                Description = "Simulates total-body clinical oncology imaging using anthropomorphic torso phantom with hot/cold spherical lesions to assess contrast recovery and lung residual error.",
                ClinicalPurpose = "Directly simulates lesion detectability, standardized uptake value (SUV) quantification accuracy, and CT-based attenuation correction artifacts.",
                AcquisitionParameters = "Clinical oncology reconstruction protocol (TOF-OSEM with PSF modeling) | Contrast ratio 4:1 (spheres to background)",
                Phantom = new PhantomSpec
                {
                    Id = Guid.NewGuid(),
                    QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Name = "NEMA IEC Body Phantom with Lung Insert and 6 Spheres",
                    Type = "Torso",
                    RecommendedIsotope = "F-18",
                    ActivityLevel = "Background: 5.3 kBq/mL | Spheres (4:1): 21.2 kBq/mL",
                    Dimensions = "Torso cavity ~9.7 L with 6 internal hollow spheres (diameters: 10, 13, 17, 22, 28, 37 mm) and low-density lung insert",
                    PreparationInstructions = "Fill spheres carefully with 4:1 activity ratio ensuring zero bubble trapped. Fill background cavity and lung insert."
                },
                Steps = new List<TestStep>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        StepNumber = 1,
                        Title = "Acquire Low-Dose CT and PET Emission",
                        Instruction = "Execute scout, helical CT for attenuation map, and 3-bed-position PET emission acquisition matching standard clinical protocol.",
                        IsCritical = true
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        StepNumber = 2,
                        Title = "Compute Contrast Recovery Coefficients",
                        Instruction = "Draw spherical VOIs on each sphere and background ROIs. Calculate Percent Contrast Recovery (QH) for each sphere size and background variability.",
                        IsCritical = true
                    }
                },
                AcceptanceCriteria = new List<AcceptanceCriterion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        ParameterName = "Contrast Recovery (10mm sphere)",
                        ComparisonOperator = ">=",
                        TargetValue = 45.0,
                        Unit = "%",
                        ToleranceDescription = "Percent Contrast Recovery for the smallest 10 mm sphere must be >= 45%.",
                        RemedialAction = "Optimize point spread function (PSF) deconvolution iterations and filter cutoff frequency."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        QcProtocolId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                        ParameterName = "Lung Residual Error",
                        ComparisonOperator = "<=",
                        TargetValue = 10.0,
                        Unit = "%",
                        ToleranceDescription = "Residual activity concentration in non-active lung insert must be <= 10.0% of background.",
                        RemedialAction = "Re-calibrate CT Hounsfield Unit (HU) to 511 keV linear attenuation coefficient scaling table."
                    }
                }
            }
        };
    }

    private static void AddProtocolTranslations(QcProtocol protocol)
    {
        // 1. English Translation
        protocol.Translations.Add(new QcProtocolTranslation
        {
            Id = Guid.NewGuid(),
            QcProtocolId = protocol.Id,
            Language = "en",
            Title = protocol.Title,
            Description = protocol.Description,
            ClinicalPurpose = protocol.ClinicalPurpose,
            AcquisitionParameters = protocol.AcquisitionParameters
        });

        // 2. Persian Translation
        var faTitle = protocol.Code switch
        {
            "QC-DAILY-01" => "اسکن بلنک و یکنواختی روزانه",
            "NEMA-NU2-SR" => "رزولوشن فضایی NEMA NU 2",
            "NEMA-NU2-SENS" => "حساسیت سیستم NEMA NU 2",
            "NEMA-NU2-SF" => "کسر پراکندگی و نرخ شمارش NEMA NU 2",
            "NEMA-NU2-IQ" => "کیفیت تصویر و تصحیحات تضعیف NEMA IEC",
            _ => protocol.Title
        };

        var faDesc = protocol.Code switch
        {
            "QC-DAILY-01" => "آزمون کنترل کیفی بنیادین روزانه برای ارزیابی پایداری آشکارساز، پاسخ فوتومولتی‌پلایر و شناسایی بلوک‌های کریستال معیوب یا رانش کالیبراسیون.",
            "NEMA-NU2-SR" => "اندازه‌گیری توانایی سیستم در تفکیک دو چشمه نقطه‌ای رادیواکتیو نزدیک به یکدیگر در سه بعد شعاعی، مماسی و محوری بر اساس استاندارد NEMA NU 2.",
            "NEMA-NU2-SENS" => "اندازه‌گیری نرخ انطباق واقعی آشکارسازی شده به ازای هر واحد فعالیت رادیواکتیو حاضر در میدان دید اسکنر برای بهینه‌سازی دوز تزریقی.",
            "NEMA-NU2-SF" => "ارزیابی عملکرد نرخ شمارش اسکنر، تلفات زمان مرده آشکارساز و کسر پراکندگی در غلظت‌های مختلف اکتیویته تا رسیدن به قله NECR.",
            "NEMA-NU2-IQ" => "شبیه‌سازی تصویربرداری انکولوژی بالینی تمام بدن با فانتوم نیم‌تنه به همراه ضایعات کروی گرم و سرد جهت ارزیابی بازیابی کنتراست و خطای باقی‌مانده ریه.",
            _ => protocol.Description
        };

        var faPurpose = protocol.Code switch
        {
            "QC-DAILY-01" => "اطمینان از یکنواختی فضایی پاسخ اسکنر و جلوگیری از خطاهای حلقه‌ای (Ring Artifacts)، نقاط گرم کاذب، یا عدم تشخیص ضایعات در تصاویر بیماران.",
            "NEMA-NU2-SR" => "تعیین مستقیم کوچک‌ترین ضایعه آناتومیک یا گره لنفاوی قابل تفکیک بدون اثر تاری شدید حجم جزئی (Partial Volume Effect).",
            "NEMA-NU2-SENS" => "حساسیت بالا امکان کاهش دوز تزریقی به بیمار و کاهش زمان تصویربرداری را بدون افت کیفیت تشخیصی فراهم می‌آورد.",
            "NEMA-NU2-SF" => "شناسایی نقطه اوج نرخ شمارش معادل نوفه (NECR) برای بهینه‌سازی دوز تزریقی به بیمار و جلوگیری از اشباع آشکارساز.",
            "NEMA-NU2-IQ" => "شبیه‌سازی مستقیم قدرت تشخیص ضایعه، صحت کمی‌سازی SUV و آرتیفکت‌های تصحیح تضعیف مبتنی بر سی‌تی.",
            _ => protocol.ClinicalPurpose
        };

        protocol.Translations.Add(new QcProtocolTranslation
        {
            Id = Guid.NewGuid(),
            QcProtocolId = protocol.Id,
            Language = "fa",
            Title = faTitle,
            Description = faDesc,
            ClinicalPurpose = faPurpose,
            AcquisitionParameters = protocol.AcquisitionParameters
        });

        // Add Phantom Translations
        if (protocol.Phantom != null)
        {
            protocol.Phantom.Translations.Add(new PhantomSpecTranslation
            {
                Id = Guid.NewGuid(),
                PhantomSpecId = protocol.Phantom.Id,
                Language = "en",
                Name = protocol.Phantom.Name,
                Type = protocol.Phantom.Type,
                RecommendedIsotope = protocol.Phantom.RecommendedIsotope,
                ActivityLevel = protocol.Phantom.ActivityLevel,
                PreparationInstructions = protocol.Phantom.PreparationInstructions,
                Dimensions = protocol.Phantom.Dimensions
            });

            protocol.Phantom.Translations.Add(new PhantomSpecTranslation
            {
                Id = Guid.NewGuid(),
                PhantomSpecId = protocol.Phantom.Id,
                Language = "fa",
                Name = protocol.Code switch
                {
                    "QC-DAILY-01" => "فانتوم استوانه‌ای یکنواخت Ge-68 / Ga-68",
                    "NEMA-NU2-SR" => "نگهدارنده چشمه نقطه‌ای / لوله مویین",
                    "NEMA-NU2-SENS" => "فانتوم حساسیت NEMA (چشمه خطی ۷۰ سانتی‌متری + ۵ غلاف آلومینیومی)",
                    "NEMA-NU2-SF" => "فانتوم پراکندگی NEMA NU 2 (استوانه پلی‌اتیلن ۲۰ سانتی‌متری)",
                    "NEMA-NU2-IQ" => "فانتوم بدنه NEMA IEC با قطعه ریه و ۶ گوی",
                    _ => protocol.Phantom.Name
                },
                Type = protocol.Phantom.Type,
                RecommendedIsotope = protocol.Phantom.RecommendedIsotope,
                ActivityLevel = protocol.Phantom.ActivityLevel,
                PreparationInstructions = "با لیزرهای راهنمای اسکنر در امتداد محور مرکزی قرار دهید. مطمئن شوید حباب هوا در مایع وجود ندارد.",
                Dimensions = protocol.Phantom.Dimensions
            });
        }

        // Add Step Translations
        foreach (var step in protocol.Steps)
        {
            step.Translations.Add(new TestStepTranslation
            {
                Id = Guid.NewGuid(),
                TestStepId = step.Id,
                Language = "en",
                Title = step.Title,
                Instruction = step.Instruction,
                CautionNote = step.CautionNote
            });

            step.Translations.Add(new TestStepTranslation
            {
                Id = Guid.NewGuid(),
                TestStepId = step.Id,
                Language = "fa",
                Title = $"مرحله {step.StepNumber}: {step.Title}",
                Instruction = step.Instruction,
                CautionNote = step.CautionNote != null ? $"توجه: {step.CautionNote}" : null
            });
        }

        // Add Acceptance Criteria Translations
        foreach (var criterion in protocol.AcceptanceCriteria)
        {
            criterion.Translations.Add(new AcceptanceCriterionTranslation
            {
                Id = Guid.NewGuid(),
                AcceptanceCriterionId = criterion.Id,
                Language = "en",
                ParameterName = criterion.ParameterName,
                ToleranceDescription = criterion.ToleranceDescription,
                RemedialAction = criterion.RemedialAction
            });

            criterion.Translations.Add(new AcceptanceCriterionTranslation
            {
                Id = Guid.NewGuid(),
                AcceptanceCriterionId = criterion.Id,
                Language = "fa",
                ParameterName = criterion.ParameterName switch
                {
                    "Integral Uniformity (IU)" => "یکنواختی انتگرالی (IU)",
                    "Differential Uniformity (DU)" => "یکنواختی دیفرانسیلی (DU)",
                    "Radial FWHM @ 1 cm" => "رزولوشن شعاعی FWHM در ۱ سانتی‌متر",
                    "Axial FWHM @ 1 cm" => "رزولوشن محوری FWHM در ۱ سانتی‌متر",
                    "Total System Sensitivity @ Center" => "حساسیت کل سیستم در مرکز",
                    "Scatter Fraction (SF)" => "کسر پراکندگی (SF)",
                    "Peak NECR" => "اوج نرخ شمارش معادل نوفه (Peak NECR)",
                    "Contrast Recovery (10mm sphere)" => "بازیابی کنتراست (گوی ۱۰ میلی‌متری)",
                    "Lung Residual Error" => "خطای باقی‌مانده ریه",
                    _ => criterion.ParameterName
                },
                ToleranceDescription = criterion.ToleranceDescription,
                RemedialAction = criterion.RemedialAction
            });
        }
    }

    private static async Task SeedQuizzesAsync(DatabaseContext context)
    {
        if (await context.Quizzes.AnyAsync())
        {
            if (!await context.QuizTranslations.AnyAsync())
            {
                var existingQuizzes = await context.Quizzes
                    .Include(q => q.Questions)
                        .ThenInclude(qu => qu.Options)
                    .ToListAsync();

                foreach (var quiz in existingQuizzes)
                {
                    AddQuizTranslations(quiz);
                }
                await context.SaveChangesAsync();
            }
            return;
        }

        var quizzes = GetPredefinedQuizzes();
        foreach (var quiz in quizzes)
        {
            AddQuizTranslations(quiz);
        }

        context.Quizzes.AddRange(quizzes);
        await context.SaveChangesAsync();
    }

    private static List<Quiz> GetPredefinedQuizzes()
    {
        return new List<Quiz>
        {
            new()
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Title = "Daily QC & Routine Safety",
                Description = "Test your core clinical competencies on daily uniformity checks, blank scan interpretation, and troubleshooting PMT/SiPM detector drift.",
                Category = "Daily Routine",
                DifficultyLevel = "Beginner",
                EstimatedMinutes = 8,
                Questions = new List<QuizQuestion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Order = 1,
                        QuestionText = "What is the primary physical objective of running a morning Blank Scan without any phantom in the field of view?",
                        ReferenceProtocol = "QC-DAILY-01",
                        Options = new List<QuizOption>
                        {
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "To measure true patient coincidence lines of response (LORs).",
                                IsCorrect = false,
                                ClinicalRationale = "Patient coincidence lines only occur when an annihilation source is present."
                            },
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "To calibrate detector gain, coincidence timing baseline, and identify malfunctioning crystal blocks.",
                                IsCorrect = true,
                                ClinicalRationale = "A blank scan monitors coincidence detector baselines and detects dead crystals before scanning patients."
                            },
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "To measure the room background gamma radiation only.",
                                IsCorrect = false,
                                ClinicalRationale = "Room background is secondary; crystal channel gain and deadtime baseline are the primary targets."
                            }
                        }
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Order = 2,
                        QuestionText = "According to IAEA and AAPM guidelines, what is the maximum acceptable tolerance for Daily Integral Uniformity (IU)?",
                        ReferenceProtocol = "QC-DAILY-01",
                        Options = new List<QuizOption>
                        {
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "<= 5.0%",
                                IsCorrect = true,
                                ClinicalRationale = "Daily Integral Uniformity (IU) across the central 75% phantom diameter must remain <= 5.0%."
                            },
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "<= 15.0%",
                                IsCorrect = false,
                                ClinicalRationale = "15% is excessively large and would cause severe visual ring artifacts in clinical PET scans."
                            },
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "<= 0.5%",
                                IsCorrect = false,
                                ClinicalRationale = "Poisson noise in standard acquisition makes 0.5% technically unachievable within reasonable scan duration."
                            }
                        }
                    }
                }
            },
            new()
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Title = "NEMA NU 2 Standards & Performance",
                Description = "Master the evaluation of spatial resolution, system sensitivity, scatter fraction, and contrast recovery.",
                Category = "NEMA Standards",
                DifficultyLevel = "Advanced",
                EstimatedMinutes = 12,
                Questions = new List<QuizQuestion>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Order = 1,
                        QuestionText = "Why does radial spatial resolution degrade as the point source moves from scanner center (1 cm) toward peripheral radial positions (10 cm and 20 cm)?",
                        ReferenceProtocol = "NEMA-NU2-SR",
                        Options = new List<QuizOption>
                        {
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "Due to the parallax / Depth of Interaction (DOI) effect in scintillation crystals.",
                                IsCorrect = true,
                                ClinicalRationale = "Annihilation photons entering peripheral crystals obliquely penetrate across crystal boundaries before interacting, causing parallax blurring."
                            },
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "Because electronic noise increases at the edges of the detector ring.",
                                IsCorrect = false,
                                ClinicalRationale = "Electronic noise is uniform across identical front-end ASIC readouts."
                            },
                            new()
                            {
                                Id = Guid.NewGuid(),
                                OptionText = "Due to increased Compton scatter in the air inside the gantry bore.",
                                IsCorrect = false,
                                ClinicalRationale = "Air attenuation and scatter are negligible over standard gantry bore dimensions."
                            }
                        }
                    }
                }
            }
        };
    }

    private static void AddQuizTranslations(Quiz quiz)
    {
        // English
        quiz.Translations.Add(new QuizTranslation
        {
            Id = Guid.NewGuid(),
            QuizId = quiz.Id,
            Language = "en",
            Title = quiz.Title,
            Description = quiz.Description,
            Category = quiz.Category,
            DifficultyLevel = quiz.DifficultyLevel
        });

        // Persian
        quiz.Translations.Add(new QuizTranslation
        {
            Id = Guid.NewGuid(),
            QuizId = quiz.Id,
            Language = "fa",
            Title = quiz.Category == "Daily Routine" ? "کنترل کیفی روزانه و حفاظت پرتوی" : "استانداردها و ارزیابی عملکرد NEMA NU 2",
            Description = quiz.Category == "Daily Routine"
                ? "ارزیابی صلاحیت‌های بالینی در کنترل کیفی روزانه، تحلیل اسکن بلنک و عیب‌یابی رانش آشکارسازهای PMT/SiPM."
                : "تسلط بر ارزیابی رزولوشن فضایی، حساسیت سیستم، کسر پراکندگی و صحت بازیابی کنتراست.",
            Category = quiz.Category == "Daily Routine" ? "روال روزانه" : "استانداردهای NEMA",
            DifficultyLevel = quiz.DifficultyLevel == "Beginner" ? "مقدماتی" : "پیشرفته"
        });

        foreach (var q in quiz.Questions)
        {
            q.Translations.Add(new QuizQuestionTranslation
            {
                Id = Guid.NewGuid(),
                QuizQuestionId = q.Id,
                Language = "en",
                QuestionText = q.QuestionText,
                ReferenceProtocol = q.ReferenceProtocol
            });

            q.Translations.Add(new QuizQuestionTranslation
            {
                Id = Guid.NewGuid(),
                QuizQuestionId = q.Id,
                Language = "fa",
                QuestionText = q.QuestionText switch
                {
                    "What is the primary physical objective of running a morning Blank Scan without any phantom in the field of view?"
                        => "هدف فیزیکی اصلی از اجرای اسکن بلنک صبحگاهی بدون حضور فانتوم در میدان دید چیست؟",
                    "According to IAEA and AAPM guidelines, what is the maximum acceptable tolerance for Daily Integral Uniformity (IU)?"
                        => "بر اساس راهنماهای IAEA و AAPM، حداکثر تلورانس مجاز برای یکنواختی انتگرالی روزانه (IU) چقدر است؟",
                    "Why does radial spatial resolution degrade as the point source moves from scanner center (1 cm) toward peripheral radial positions (10 cm and 20 cm)?"
                        => "چرا با دور شدن چشمه نقطه‌ای از مرکز اسکنر به سمت موقعیت‌های شعاعی محیطی، رزولوشن فضایی شعاعی کاهش می‌یابد؟",
                    _ => q.QuestionText
                },
                ReferenceProtocol = q.ReferenceProtocol
            });

            foreach (var opt in q.Options)
            {
                opt.Translations.Add(new QuizOptionTranslation
                {
                    Id = Guid.NewGuid(),
                    QuizOptionId = opt.Id,
                    Language = "en",
                    OptionText = opt.OptionText,
                    ClinicalRationale = opt.ClinicalRationale
                });

                opt.Translations.Add(new QuizOptionTranslation
                {
                    Id = Guid.NewGuid(),
                    QuizOptionId = opt.Id,
                    Language = "fa",
                    OptionText = opt.OptionText switch
                    {
                        "To measure true patient coincidence lines of response (LORs)."
                            => "اندازه‌گیری خطوط پاسخ انطباق واقعی (LOR) بیمار.",
                        "To calibrate detector gain, coincidence timing baseline, and identify malfunctioning crystal blocks."
                            => "کالیبراسیون بهره آشکارساز، خط پایه زمانی انطباق و شناسایی بلوک‌های کریستال معیوب.",
                        "To measure the room background gamma radiation only."
                            => "صرفاً اندازه‌گیری تابش گامای زمینه اتاق.",
                        "<= 5.0%" => "<= ۵.۰٪",
                        "<= 15.0%" => "<= ۱۵.۰٪",
                        "<= 0.5%" => "<= ۰.۵٪",
                        "Due to the parallax / Depth of Interaction (DOI) effect in scintillation crystals."
                            => "به دلیل پدیده پارالاکس یا اثر عمق برهمکنش (DOI) در کریستال‌های سنتیلاتور.",
                        "Because electronic noise increases at the edges of the detector ring."
                            => "به دلیل افزایش نوفه الکترونیکی در لبه‌های رینگ آشکارساز.",
                        "Due to increased Compton scatter in the air inside the gantry bore."
                            => "به دلیل افزایش پراکندگی کامپتون در هوای داخل گانتری.",
                        _ => opt.OptionText
                    },
                    ClinicalRationale = opt.ClinicalRationale
                });
            }
        }
    }

    private static async Task SeedLabExperimentsAsync(DatabaseContext context)
    {
        if (await context.LabExperiments.AnyAsync()) return;

        var labs = new List<LabExperiment>
        {
            new()
            {
                Id = Guid.Parse("f1111111-1111-1111-1111-111111111111"),
                Slug = "spatial-resolution",
                Standard = "NEMA NU 2-2018",
                DefaultParametersJson = "{\"fwhmTargetMm\":4.5,\"fwtmTargetMm\":8.8,\"pointActivityMbq\":5.0}",
                Translations = new List<LabExperimentTranslation>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "en",
                        Title = "Spatial Resolution (FWHM) Workbench",
                        Subtitle = "Point source profile extraction and point spread function (PSF) evaluation",
                        Description = "Interactive point source simulation allowing translation across radial and tangential axes to observe Depth of Interaction (DOI) resolution degradation.",
                        Instructions = "Position the virtual point source, extract the 1D Gaussian response profile, and calculate Full Width at Half Maximum (FWHM)."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "fa",
                        Title = "میزکار رزولوشن فضایی (FWHM)",
                        Subtitle = "استخراج پروفایل چشمه نقطه‌ای و ارزیابی تابع گسترش نقطه (PSF)",
                        Description = "شبیه‌سازی تعاملی چشمه نقطه‌ای با قابلیت جابجایی در امتداد محورهای شعاعی و مماسی جهت مشاهده تضعیف رزولوشن ناشی از اثر عمق برهمکنش (DOI).",
                        Instructions = "چشمه نقطه‌ای مجازی را در میدان دید قرار دهید، پروفایل پاسخ ۱ بعدی را استخراج کرده و مقدار پهنا در نصف ماکزیمم (FWHM) را محاسبه کنید."
                    }
                }
            },
            new()
            {
                Id = Guid.Parse("f2222222-2222-2222-2222-222222222222"),
                Slug = "daily-uniformity",
                Standard = "IAEA / AAPM",
                DefaultParametersJson = "{\"targetIu\":5.0,\"targetDu\":3.5,\"baseCounts\":3200,\"defaultNoise\":0.12}",
                Translations = new List<LabExperimentTranslation>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "en",
                        Title = "Daily Uniformity (IU & DU) Workbench",
                        Subtitle = "Cylinder phantom slice inspection and crystal defect detection",
                        Description = "Calculate Integral Uniformity and Differential Uniformity across cylindrical phantom ROIs with live tolerance evaluation.",
                        Instructions = "Adjust Poisson noise or simulate detector block dropouts, then inspect ROI uniformity indices against IAEA thresholds."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "fa",
                        Title = "میزکار یکنواختی روزانه (IU و DU)",
                        Subtitle = "بررسی مقطع فانتوم استوانه‌ای و کشف نقایص بلوک کریستال",
                        Description = "محاسبه یکنواختی انتگرالی و دیفرانسیلی در نواحی مورد نظر فانتوم استوانه‌ای به همراه ارزیابی بلادرنگ با حدود استاندارد بالینی.",
                        Instructions = "نوفه پواسون را تنظیم کرده یا افت سیگنال در یک بلوک آشکارساز را شبیه‌سازی کنید؛ سپس شاخص‌های یکنواختی را با آستانه‌های IAEA مقایسه نمایید."
                    }
                }
            }
        };

        context.LabExperiments.AddRange(labs);
        await context.SaveChangesAsync();
    }

    private static async Task SeedAiScenariosAsync(DatabaseContext context)
    {
        if (await context.AiScenarios.AnyAsync()) return;

        var scenarios = new List<AiScenario>
        {
            new()
            {
                Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                Code = "PVC-RECOVERY",
                DefaultDoseReductionFactor = 4.0,
                DefaultLesionDiameterMm = 15.0,
                Translations = new List<AiScenarioTranslation>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "en",
                        Title = "Partial Volume Effect & Contrast Recovery",
                        ClinicalContext = "Small lesions smaller than 2-3x the system FWHM suffer from severe underestimation of SUVmax due to spill-out into adjacent soft tissue.",
                        MethodologyDescription = "Point Spread Function deconvolution and deep neural network priors recover genuine lesion activity concentrations.",
                        ExpectedOutcome = "Contrast Recovery increases from ~45% to >85% for sub-15mm hepatic and pulmonary nodules."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "fa",
                        Title = "اثر حجم جزئی و بازیابی کنتراست (PVC)",
                        ClinicalContext = "ضایعات کوچک‌تر از ۲ تا ۳ برابر FWHM سیستم به دلیل خروج فوتون‌ها به بافت‌های مجاور (Spill-out)، دچار کم‌تخمینی شدید مقدار SUVmax می‌شوند.",
                        MethodologyDescription = "استفاده از واپیچش تابع گسترش نقطه (PSF) و شبکه‌های عصبی عمیق جهت بازیابی غلظت واقعی رادیوداروی تجمع یافته در ضایعه.",
                        ExpectedOutcome = "افزایش ضریب بازیابی کنتراست از ۴۵٪ به بیش از ۸۵٪ برای گره‌های ریوی و کبدی کوچک‌تر از ۱۵ میلی‌متر."
                    }
                }
            },
            new()
            {
                Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                Code = "LOW-DOSE-DENOISING",
                DefaultDoseReductionFactor = 4.0,
                DefaultLesionDiameterMm = 15.0,
                Translations = new List<AiScenarioTranslation>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "en",
                        Title = "Ultra-Low-Dose PET Denoising via Deep Learning",
                        ClinicalContext = "Reducing patient injected radiopharmaceutical dose to 25% (4x dose reduction) introduces extreme Poisson noise, obscuring low-contrast lesions.",
                        MethodologyDescription = "Trained residual convolutional networks restore high-count diagnostic quality from noisy low-dose sinograms.",
                        ExpectedOutcome = "Recovers Peak Signal-to-Noise Ratio (PSNR) from 18 dB to 31 dB while preserving true lesion boundaries."
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Language = "fa",
                        Title = "حذف نویز در پت با دوز فوق‌العاده پایین با یادگیری عمیق",
                        ClinicalContext = "کاهش دوز تزریقی به بیمار به ۲۵٪ (کاهش دوز ۴ برابری) باعث ایجاد نوفه پواسون شدید و پنهان شدن ضایعات با کنتراست پایین می‌شود.",
                        MethodologyDescription = "شبکه‌های کانولوشنالی باقی‌مانده (ResNet) کیفیت تشخیصی معادل دوز استاندارد را از داده‌های نوفه‌دار بازسازی می‌کنند.",
                        ExpectedOutcome = "ارتقای نسبت سیگنال به نوفه (PSNR) از ۱۸ دسی‌بل به ۳۱ دسی‌بل همزمان با حفظ دقیق مرزهای آناتومیک ضایعه."
                    }
                }
            }
        };

        context.AiScenarios.AddRange(scenarios);
        await context.SaveChangesAsync();
    }
}
