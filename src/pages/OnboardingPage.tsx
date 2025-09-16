import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/services/auth/queries";
import LoadingSpinner from "@atoms/LoadingSpinner";
import { AnimatePresence } from "framer-motion";
import { getPensum, getCareers, Career, Course } from "@/services/academic/api";
import { saveUserProfile, getUserProfile } from "@/services/firebase/profiles";
import OnboardingHeader from "@molecules/OnboardingHeader";
import ProgressBar from "@molecules/ProgressBar";
import CareerSelection from "@organisms/CareerSelection";
import AcademicConfiguration from "@organisms/AcademicConfiguration";
import CourseSelection from "@organisms/CourseSelection";

interface OnboardingData {
  career: string;
  startYear: number;
  semester: number;
  completedCourses: string[];
}

interface FirebaseUser {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser() as { data: FirebaseUser | null };
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableCareers, setAvailableCareers] = useState<Career[]>([]);
  const [pensum, setPensum] = useState<Course[]>([]);
  const [loadingPensum, setLoadingPensum] = useState(false);
  const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(
    new Set([1])
  );

  const [formData, setFormData] = useState<OnboardingData>({
    career: "",
    startYear: new Date().getFullYear(),
    semester: 1,
    completedCourses: [],
  });

  // Load available careers on mount
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.uid) return;

      try {
        const userProfile = await getUserProfile(user.uid);

        if (userProfile && userProfile.onboarding_completed) {
          navigate("/dashboard", { replace: true });
          return;
        }

        loadCareers();
      } catch (error) {
        console.error("Error verificando estado del onboarding:", error);
        loadCareers();
      }
    };

    const loadCareers = async () => {
      setInitialLoading(true);
      try {
        const careers = await getCareers();
        setAvailableCareers(careers);
      } catch (error) {
        console.error("Error loading careers:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (user) {
      checkOnboardingStatus();
    }
  }, [user, navigate]);

  // Load pensum when career is selected
  useEffect(() => {
    if (formData.career && formData.startYear) {
      loadPensum(formData.career, formData.startYear);
    }
  }, [formData.career, formData.startYear]);

  const loadPensum = async (careerId: string, startYear: number) => {
    setLoadingPensum(true);
    try {
      const pensumData = await getPensum(careerId, startYear);
      setPensum(pensumData);
    } catch (error) {
      console.error("Error loading pensum:", error);
    } finally {
      setLoadingPensum(false);
    }
  };

  const handleCareerSelect = (careerId: string) => {
    setFormData({
      ...formData,
      career: careerId,
      completedCourses: [],
    });
    setPensum([]);
    setCurrentStep(2);
  };

  const handleFormUpdate = (updates: Partial<OnboardingData>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);

    if (updates.startYear && newFormData.career) {
      loadPensum(newFormData.career, newFormData.startYear);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!user?.uid) {
        throw new Error("Usuario no autenticado");
      }

      const selectedCareer = availableCareers.find(
        (c) => c.id === formData.career
      );

      await saveUserProfile({
        uid: user.uid,
        career_id: formData.career,
        career_name: selectedCareer?.name || "",
        start_year: formData.startYear,
        completed_courses: formData.completedCourses,
        onboarding_completed: true,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error guardando configuración:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Selecciona tu carrera";
      case 2:
        return "Configura tu progreso";
      case 3:
        return "Materias completadas";
      default:
        return "";
    }
  };

  if (!user || initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Cargando tu información académica
          </h2>
          <p className="text-sm text-gray-500 max-w-md">
            Estamos preparando las carreras disponibles y configurando tu
            perfil. Esto solo tomará unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OnboardingHeader
        userName={user?.displayName?.split(" ")[0] || "Usuario"}
        stepTitle={getStepTitle()}
        userAvatar={user?.photoURL || undefined}
      />

      <ProgressBar
        currentStep={currentStep}
        totalSteps={3}
        onStepClick={(step) => {
          if (step <= currentStep || (step === 2 && formData.career)) {
            setCurrentStep(step);
          }
        }}
      />

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <CareerSelection
            careers={availableCareers}
            onCareerSelect={handleCareerSelect}
          />
        )}

        {currentStep === 2 && (
          <AcademicConfiguration
            formData={formData}
            availableCareers={availableCareers}
            onFormUpdate={handleFormUpdate}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <CourseSelection
            pensum={pensum}
            loadingPensum={loadingPensum}
            formData={formData}
            expandedSemesters={expandedSemesters}
            onExpandedSemestersChange={setExpandedSemesters}
            onFormUpdate={handleFormUpdate}
            onBack={() => setCurrentStep(2)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default OnboardingPage;
