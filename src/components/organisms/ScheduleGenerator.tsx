import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@atoms/LoadingSpinner';
import SvgIcon from '@atoms/SvgIcon';

interface ScheduleData {
  metadata: {
    semester: number;
    semester_name: string;
    scraped_at: string;
    total_courses: number;
  };
  courses: CourseSchedule[];
}

interface CourseSchedule {
  course_code: string;
  course_name: string;
  section: string;
  mode: string;
  building: string;
  classroom: string;
  start_time: string;
  end_time: string;
  days: string;
  professor: string;
  teaching_assistant: string;
  semester: number;
  restrictions: string[];
}

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  career_id: string;
  prerequisites: string[];
  type: 'Obligatorio' | 'Electivo';
  display_order: number;
}

interface ScheduleGeneratorProps {
  pensum: Course[];
  completedCourses: string[];
  currentSemester: number;
}

const ScheduleGenerator: React.FC<ScheduleGeneratorProps> = ({
  pensum,
  completedCourses,
  currentSemester,
}) => {
  const [availableSchedules, setAvailableSchedules] = useState<CourseSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [generatedSchedule, setGeneratedSchedule] = useState<CourseSchedule[]>([]);
  const [scheduleConflicts, setScheduleConflicts] = useState<string[]>([]);

  // Cargar horarios disponibles según el semestre actual
  useEffect(() => {
    const loadSchedules = async () => {
      setLoading(true);
      try {
        const scheduleFile = currentSemester === 1 
          ? 'schedules_semester1.json' 
          : 'schedules_semester2.json';
        
        const response = await fetch(`/data/${scheduleFile}`);
        const data: ScheduleData = await response.json();
        setAvailableSchedules(data.courses);
      } catch (error) {
        console.error('Error cargando horarios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [currentSemester]);

  // Obtener cursos disponibles para inscribir
  const getAvailableCourses = () => {
    return pensum.filter(course => {
      // No incluir cursos ya completados
      if (completedCourses.includes(course.code)) return false;
      
      // Verificar prerrequisitos
      const hasPrerequisites = course.prerequisites.length === 0 || 
        course.prerequisites.every(prereq => completedCourses.includes(prereq));
      
      if (!hasPrerequisites) return false;
      
      // Verificar que existan horarios disponibles para este curso
      const hasSchedule = availableSchedules.some(schedule => 
        schedule.course_code === course.code
      );
      
      return hasSchedule;
    });
  };

  // Generar horario automáticamente
  const generateSchedule = () => {
    const selectedSchedules: CourseSchedule[] = [];
    const conflicts: string[] = [];

    selectedCourses.forEach(courseCode => {
      const courseSchedules = availableSchedules.filter(s => s.course_code === courseCode);
      
      if (courseSchedules.length === 0) return;

      // Intentar encontrar una sección sin conflictos
      let selectedSchedule: CourseSchedule | null = null;
      
      for (const schedule of courseSchedules) {
        const hasConflict = selectedSchedules.some(existing => 
          hasTimeConflict(existing, schedule)
        );
        
        if (!hasConflict) {
          selectedSchedule = schedule;
          break;
        }
      }

      if (selectedSchedule) {
        selectedSchedules.push(selectedSchedule);
      } else {
        conflicts.push(courseCode);
      }
    });

    setGeneratedSchedule(selectedSchedules);
    setScheduleConflicts(conflicts);
  };

  // Verificar conflictos de horario
  const hasTimeConflict = (course1: CourseSchedule, course2: CourseSchedule): boolean => {
    // Verificar si hay días en común
    const days1 = course1.days.split(/\s+/).filter((d: string) => d.length > 0);
    const days2 = course2.days.split(/\s+/).filter((d: string) => d.length > 0);
    
    const hasCommonDays = days1.some((day: string) => days2.includes(day));
    if (!hasCommonDays) return false;
    
    // Verificar si hay conflicto de horario
    const start1 = parseTime(course1.start_time);
    const end1 = parseTime(course1.end_time);
    const start2 = parseTime(course2.start_time);
    const end2 = parseTime(course2.end_time);
    
    return (start1 < end2 && start2 < end1);
  };

  // Parsear tiempo HH:MM a minutos
  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Formatear horario para mostrar
  const formatSchedule = (course: CourseSchedule) => {
    return `${course.days} ${course.start_time}-${course.end_time}`;
  };

  const availableCourses = getAvailableCourses();

  const handleCourseToggle = (courseCode: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseCode)
        ? prev.filter(code => code !== courseCode)
        : [...prev, courseCode]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Generador de Horarios
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentSemester === 1 ? 'Primer' : 'Segundo'} Semestre 2025 
              ({currentSemester === 1 ? 'Enero - Junio' : 'Julio - Diciembre'})
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cursos disponibles
            </p>
            <p className="text-2xl font-bold text-primary">
              {availableCourses.length}
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selección de cursos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Selecciona tus cursos
          </h3>
          
          {availableCourses.length === 0 ? (
            <div className="text-center py-8">
              <SvgIcon name="book" size="lg" className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay cursos disponibles para inscribir en este momento.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Verifica que hayas completado los prerequisitos necesarios.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableCourses.map(course => {
                const isSelected = selectedCourses.includes(course.code);
                const availableSections = availableSchedules.filter(s => s.course_code === course.code).length;
                
                return (
                  <div
                    key={course.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => handleCourseToggle(course.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'border-primary bg-primary text-white' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && <SvgIcon name="check" size="xs" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {course.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-mono">{course.code}</span>
                            <span>•</span>
                            <span>{course.credits} créditos</span>
                            <span>•</span>
                            <span>{availableSections} secciones</span>
                            {course.type && (
                              <>
                                <span>•</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  course.type === 'Obligatorio' 
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                  {course.type}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedCourses.length > 0 && (
            <div className="mt-6">
              <button
                onClick={generateSchedule}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <SvgIcon name="calendar" size="sm" />
                <span>Generar Horario</span>
              </button>
            </div>
          )}
        </div>

        {/* Horario generado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tu horario generado
          </h3>

          {generatedSchedule.length === 0 ? (
            <div className="text-center py-8">
              <SvgIcon name="calendar" size="lg" className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Selecciona cursos y genera tu horario
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {schedule.course_name}
                    </h4>
                    <span className="text-sm bg-primary text-white px-2 py-1 rounded">
                      Sección {schedule.section}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Horario:</span> {formatSchedule(schedule)}
                    </div>
                    <div>
                      <span className="font-medium">Aula:</span> {schedule.building}-{schedule.classroom}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Profesor:</span> {schedule.professor}
                    </div>
                    {schedule.teaching_assistant && (
                      <div className="col-span-2">
                        <span className="font-medium">Auxiliar:</span> {schedule.teaching_assistant}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {scheduleConflicts.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    Conflictos detectados
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    No se pudo asignar horario para: {scheduleConflicts.join(', ')}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total de créditos:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {generatedSchedule.reduce((total, schedule) => {
                      const course = pensum.find(c => c.code === schedule.course_code);
                      return total + (course?.credits || 0);
                    }, 0)} créditos
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleGenerator;