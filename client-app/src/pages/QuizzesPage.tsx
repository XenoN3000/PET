import React, { useState, useEffect } from 'react';
import type { QuizDto } from '../types/quiz';
import { apiService } from '../services/api';
import { QuizRunner } from '../components/quizzes/QuizRunner';
import { QcChecklistGenerator } from '../components/quizzes/QcChecklistGenerator';
import { 
  GraduationCap, 
  FileCheck2, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

// Fallback quizzes to guarantee instant interactive functionality even before DB connection
const FALLBACK_QUIZZES: QuizDto[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Daily QC & Detector Stability',
    description: 'Assess your clinical knowledge of morning blank scans, daily uniformity checks, and detector failure troubleshooting.',
    category: 'Daily Routine',
    difficultyLevel: 'Beginner',
    estimatedMinutes: 8,
    questionCount: 3,
    questions: [
      {
        id: 'q1-1',
        quizId: 'a1111111-1111-1111-1111-111111111111',
        order: 1,
        questionText: 'What is the primary purpose of performing a daily morning blank scan before patient acquisitions?',
        referenceProtocol: 'IAEA Human Health Series No. 1 / AAPM Report 108',
        options: [
          {
            id: 'o1-1-1',
            quizQuestionId: 'q1-1',
            optionText: 'Calibrate detector coincidence baseline and detect failed PMTs or crystal block drift.',
            isCorrect: true,
            clinicalRationale: 'Correct! The blank scan measures unattenuated coincidence events across all detector pairs to detect faulty channels, gain shifts, or bad PMTs before injecting patients.'
          },
          {
            id: 'o1-1-2',
            quizQuestionId: 'q1-1',
            optionText: 'Measure the spatial resolution at 20 cm radial offset.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Spatial resolution requires point sources placed at specific off-axis coordinates according to NEMA NU 2 Section 3.'
          },
          {
            id: 'o1-1-3',
            quizQuestionId: 'q1-1',
            optionText: 'Calculate the absolute scatter fraction of the patient population.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Scatter fraction is measured using a 70 cm line source inside a solid polyethylene cylinder (NEMA NU 2 Section 5).'
          },
          {
            id: 'o1-1-4',
            quizQuestionId: 'q1-1',
            optionText: 'Sterilize the detector ring gantry electronically.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Electronic sterilization is not a physical PET acquisition procedure.'
          }
        ]
      },
      {
        id: 'q1-2',
        quizId: 'a1111111-1111-1111-1111-111111111111',
        order: 2,
        questionText: 'What is the standard IAEA acceptance threshold for Daily Integral Uniformity (IU) in a uniform cylindrical phantom?',
        referenceProtocol: 'IAEA HHS No. 1 Section 3.2',
        options: [
          {
            id: 'o1-2-1',
            quizQuestionId: 'q1-2',
            optionText: 'IU <= 5.0%',
            isCorrect: true,
            clinicalRationale: 'Correct! IAEA guidelines specify that Integral Uniformity across the central reconstructed slice must not exceed 5.0%.'
          },
          {
            id: 'o1-2-2',
            quizQuestionId: 'q1-2',
            optionText: 'IU <= 1.0%',
            isCorrect: false,
            clinicalRationale: 'Incorrect. While higher uniformity is desirable, Poisson statistical noise in standard 10-minute scans typically keeps IU around 3-4%.'
          },
          {
            id: 'o1-2-3',
            quizQuestionId: 'q1-2',
            optionText: 'IU <= 15.0%',
            isCorrect: false,
            clinicalRationale: 'Incorrect. An IU of 15% indicates severe non-uniformity that would cause unacceptable diagnostic misinterpretation.'
          },
          {
            id: 'o1-2-4',
            quizQuestionId: 'q1-2',
            optionText: 'IU has no upper tolerance limit.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Daily uniformity has strict clinical upper tolerance limits to ensure quantitative SUV accuracy.'
          }
        ]
      },
      {
        id: 'q1-3',
        quizId: 'a1111111-1111-1111-1111-111111111111',
        order: 3,
        questionText: 'If a sharp concentric circular ring artifact appears in reconstructed cylinder images, what is the most likely root cause?',
        referenceProtocol: 'IAEA HHS No. 1 Section 3.3 (Troubleshooting)',
        options: [
          {
            id: 'o1-3-1',
            quizQuestionId: 'q1-3',
            optionText: 'A malfunctioning detector block or crystal PMT channel causing a sinogram zero-count strip.',
            isCorrect: true,
            clinicalRationale: 'Correct! When filtered backprojection or OSEM reconstructs a sinogram with a dead or corrupted crystal strip, it manifests as a circular ring artifact.'
          },
          {
            id: 'o1-3-2',
            quizQuestionId: 'q1-3',
            optionText: 'Patient bed elevation motor calibration error.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Bed motor errors cause axial slice shifts or registration mismatches, not concentric rings.'
          },
          {
            id: 'o1-3-3',
            quizQuestionId: 'q1-3',
            optionText: 'Normal radioactive decay of the Ge-68 isotope.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Ge-68 has a 271-day half-life; steady physical decay is corrected by software and does not cause ring artifacts.'
          },
          {
            id: 'o1-3-4',
            quizQuestionId: 'q1-3',
            optionText: 'Excessive ambient room humidity.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. While HVAC stability is required for electronics, humidity does not produce localized ring artifacts.'
          }
        ]
      }
    ]
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Spatial Resolution (NEMA NU 2)',
    description: 'Master the principles of Point Spread Function (PSF), FWHM/FWTM calculation, and parallax effect.',
    category: 'NEMA Standards',
    difficultyLevel: 'Intermediate',
    estimatedMinutes: 10,
    questionCount: 3,
    questions: [
      {
        id: 'q2-1',
        quizId: 'a2222222-2222-2222-2222-222222222222',
        order: 1,
        questionText: 'According to NEMA NU 2-2018 Section 3, what source geometry and radionuclide are specified for spatial resolution testing?',
        referenceProtocol: 'NEMA NU 2-2018 Section 3',
        options: [
          {
            id: 'o2-1-1',
            quizQuestionId: 'q2-1',
            optionText: 'A point source with active dimensions < 1.0 mm suspended in air with F-18.',
            isCorrect: true,
            clinicalRationale: 'Correct! NEMA NU 2 stipulates sub-millimeter point sources suspended in air to minimize photon scattering while assessing intrinsic scanner resolution.'
          },
          {
            id: 'o2-1-2',
            quizQuestionId: 'q2-1',
            optionText: 'A 20 cm diameter uniform water cylinder with Ga-68.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Uniform cylinders are used for daily uniformity or sensitivity, not point-spread resolution.'
          },
          {
            id: 'o2-1-3',
            quizQuestionId: 'q2-1',
            optionText: 'A solid aluminum bar with Co-57 transmission source.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Co-57 single-photon transmission was used in legacy scanners, not modern coincidence PET resolution testing.'
          },
          {
            id: 'o2-1-4',
            quizQuestionId: 'q2-1',
            optionText: 'An anthropomorphic lung torso phantom.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Anthropomorphic phantoms assess image quality, contrast recovery, and attenuation correction.'
          }
        ]
      },
      {
        id: 'q2-2',
        quizId: 'a2222222-2222-2222-2222-222222222222',
        order: 2,
        questionText: 'How is Full Width at Half Maximum (FWHM) calculated from an experimental line profile?',
        referenceProtocol: 'NEMA NU 2-2018 Section 3.4',
        options: [
          {
            id: 'o2-2-1',
            quizQuestionId: 'q2-2',
            optionText: 'Distance between profile coordinates where net intensity equals 50% of peak height via linear interpolation.',
            isCorrect: true,
            clinicalRationale: 'Correct! NEMA NU 2 requires linear interpolation between adjacent samples spanning 50% of the maximum peak value above background.'
          },
          {
            id: 'o2-2-2',
            quizQuestionId: 'q2-2',
            optionText: 'Physical width of a single detector crystal face in millimeters.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Crystal size influences resolution, but FWHM is measured from reconstructed image profile data.'
          },
          {
            id: 'o2-2-3',
            quizQuestionId: 'q2-2',
            optionText: 'Distance between points where profile drops to 10% of maximum.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. 10% of maximum defines the Full Width at Tenth Maximum (FWTM), measuring the profile tails.'
          },
          {
            id: 'o2-2-4',
            quizQuestionId: 'q2-2',
            optionText: 'Total area under the Gaussian curve divided by scan time.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Profile area reflects total counts or sensitivity, not spatial resolution width.'
          }
        ]
      },
      {
        id: 'q2-3',
        quizId: 'a2222222-2222-2222-2222-222222222222',
        order: 3,
        questionText: 'Why does radial spatial resolution degrade significantly as a point source moves from the scanner center to 10 cm or 20 cm off-axis?',
        referenceProtocol: 'NEMA NU 2-2018 & Cherry Physics',
        options: [
          {
            id: 'o2-3-1',
            quizQuestionId: 'q2-3',
            optionText: 'Parallax effect (Depth of Interaction ambiguity) causing oblique crystal penetration.',
            isCorrect: true,
            clinicalRationale: 'Correct! Photons striking off-center crystals enter obliquely and can deposit energy in adjacent crystals before interacting, widening the radial point spread function.'
          },
          {
            id: 'o2-3-2',
            quizQuestionId: 'q2-3',
            optionText: 'Increased positron range of Fluorine-18 at the detector edges.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Positron kinetic energy and range depend on isotope physics, not location in the scanner bore.'
          },
          {
            id: 'o2-3-3',
            quizQuestionId: 'q2-3',
            optionText: 'Slowing down of the electronic coincidence clock at radial edges.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Electronic clock frequency is uniform across all ASIC processing channels.'
          },
          {
            id: 'o2-3-4',
            quizQuestionId: 'q2-3',
            optionText: 'Earth\'s gravitational force on the 511 keV annihilation photons.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Gravitational deflection on gamma photons over 1 meter is completely negligible.'
          }
        ]
      }
    ]
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title: 'AI Denoising & Partial Volume Effect',
    description: 'Evaluate your understanding of convolutional networks, U-Net skip connections, low-dose restoration, and SUV recovery.',
    category: 'AI & Processing',
    difficultyLevel: 'Advanced',
    estimatedMinutes: 12,
    questionCount: 3,
    questions: [
      {
        id: 'q3-1',
        quizId: 'a3333333-3333-3333-3333-333333333333',
        order: 1,
        questionText: 'What essential function do skip connections perform in a U-Net architecture for low-dose PET denoising?',
        referenceProtocol: 'Ronneberger et al. / Academic Thesis Proposal',
        options: [
          {
            id: 'o3-1-1',
            quizQuestionId: 'q3-1',
            optionText: 'Transfer high-resolution spatial feature maps and lesion edges directly from encoder to decoder.',
            isCorrect: true,
            clinicalRationale: 'Correct! Max-pooling in the contracting path abstracts semantic features but loses fine spatial location; skip connections bypass downsampling to preserve sharp lesion boundaries.'
          },
          {
            id: 'o3-1-2',
            quizQuestionId: 'q3-1',
            optionText: 'Eliminate the need for backpropagation training.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Skip connections still require standard gradient backpropagation during deep network optimization.'
          },
          {
            id: 'o3-1-3',
            quizQuestionId: 'q3-1',
            optionText: 'Reduce the total number of convolutional layers to zero.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Skip connections connect convolutional layers; they do not replace them.'
          },
          {
            id: 'o3-1-4',
            quizQuestionId: 'q3-1',
            optionText: 'Automatically segment CT bones into Hounsfield units.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. CT segmentation is a separate pre-processing task; skip connections facilitate multi-scale feature propagation.'
          }
        ]
      },
      {
        id: 'q3-2',
        quizId: 'a3333333-3333-3333-3333-333333333333',
        order: 2,
        questionText: 'What is the primary physical cause of the Partial Volume Effect (PVE) in small lesions (< 2x scanner FWHM)?',
        referenceProtocol: 'NEMA NU 2 Section 7 (Image Quality) / IAEA HHS No. 1',
        options: [
          {
            id: 'o3-2-1',
            quizQuestionId: 'q3-2',
            optionText: 'Finite scanner spatial resolution causing spill-out of lesion counts into surrounding lower-activity tissue.',
            isCorrect: true,
            clinicalRationale: 'Correct! When a structure is smaller than roughly twice the system FWHM, blurring causes counts to "spill out", leading to significant underestimation of true SUV.'
          },
          {
            id: 'o3-2-2',
            quizQuestionId: 'q3-2',
            optionText: 'Biological resistance of tumor cells against F-18 FDG uptake.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. PVE is an imaging physics artifact caused by finite resolution, not biological uptake resistance.'
          },
          {
            id: 'o3-2-3',
            quizQuestionId: 'q3-2',
            optionText: 'Detector dead-time saturation inside the lesion area.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Dead-time affects high total event rates across entire detector blocks, not localized micro-lesions.'
          },
          {
            id: 'o3-2-4',
            quizQuestionId: 'q3-2',
            optionText: 'Failure to apply physical decay correction for Carbon-11.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Decay correction adjusts for elapsed time, not geometric resolution blurring.'
          }
        ]
      },
      {
        id: 'q3-3',
        quizId: 'a3333333-3333-3333-3333-333333333333',
        order: 3,
        questionText: 'Why is Structural Similarity Index (SSIM) clinically superior to Mean Squared Error (MSE) when assessing restored PET images?',
        referenceProtocol: 'Wang et al. SSIM / Medical Physics Literature',
        options: [
          {
            id: 'o3-3-1',
            quizQuestionId: 'q3-3',
            optionText: 'SSIM models human visual perception by independently comparing luminance, contrast, and structural texture.',
            isCorrect: true,
            clinicalRationale: 'Correct! MSE equally penalizes smooth low-frequency shifts and high-frequency structural edges, whereas SSIM specifically gauges diagnostic texture and anatomical fidelity.'
          },
          {
            id: 'o3-3-2',
            quizQuestionId: 'q3-3',
            optionText: 'SSIM values can only be negative decibel values.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. SSIM ranges between 0.0 and 1.0, where 1.0 represents perfect structural congruence.'
          },
          {
            id: 'o3-3-3',
            quizQuestionId: 'q3-3',
            optionText: 'SSIM does not require a ground-truth reference image.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. SSIM is a full-reference objective quality metric that compares target against gold standard.'
          },
          {
            id: 'o3-3-4',
            quizQuestionId: 'q3-3',
            optionText: 'SSIM only evaluates binary segmentation masks.',
            isCorrect: false,
            clinicalRationale: 'Incorrect. Binary segmentation masks are evaluated by Dice coefficient; SSIM evaluates continuous grayscale image textures.'
          }
        ]
      }
    ]
  }
];

export const QuizzesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assessments' | 'checklist'>('assessments');
  const [quizzes, setQuizzes] = useState<QuizDto[]>(FALLBACK_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState<QuizDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getQuizzes();
        if (data && data.length > 0) {
          // If questions are present in list
          if (data[0].questions && data[0].questions.length > 0) {
            setQuizzes(data);
          } else {
            // Fetch detailed first quiz or preserve fallback
            setQuizzes(data);
          }
        }
      } catch (err) {
        console.warn('Backend API quiz fetch fallback to preloaded clinical modules:', err);
        setError('Operating in offline mode with preloaded clinical assessment bank.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = async (quiz: QuizDto) => {
    // If questions already populated, launch runner directly
    if (quiz.questions && quiz.questions.length > 0) {
      setActiveQuiz(quiz);
      return;
    }

    // Try fetching full details with questions
    try {
      setLoading(true);
      setError(null);
      const detailed = await apiService.getQuizById(quiz.id);
      setActiveQuiz(detailed);
    } catch {
      // Find matching in fallback
      const fallback = FALLBACK_QUIZZES.find(f => f.id === quiz.id) || FALLBACK_QUIZZES[0];
      setActiveQuiz(fallback);
      setError('Loaded offline question module.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner (Hidden during Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            Clinical Training & Assessment Platform
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Quizzes & Clinical QC Routine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Reinforce clinical decision-making, international protocol tolerances (IAEA, NEMA, AAPM), and generate standardized daily QC checklists for hospital audit.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/60 shrink-0 self-start sm:self-center">
          <button
            onClick={() => { setActiveTab('assessments'); setActiveQuiz(null); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'assessments'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Test Bank ({quizzes.length})
          </button>
          <button
            onClick={() => { setActiveTab('checklist'); setActiveQuiz(null); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'checklist'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Hospital QC Checklist
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'assessments' ? (
        activeQuiz ? (
          <QuizRunner 
            quiz={activeQuiz} 
            onExit={() => setActiveQuiz(null)} 
          />
        ) : (
          <div className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center p-8 text-slate-500 text-sm gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                Loading quiz modules...
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Quiz Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        {quiz.category}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        quiz.difficultyLevel === 'Beginner' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                          : quiz.difficultyLevel === 'Intermediate'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                          : 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400'
                      }`}>
                        {quiz.difficultyLevel}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>{quiz.questionCount || quiz.questions?.length || 3} Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>~{quiz.estimatedMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10 transition-colors"
                  >
                    Start Assessment
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <QcChecklistGenerator />
      )}
    </div>
  );
};
