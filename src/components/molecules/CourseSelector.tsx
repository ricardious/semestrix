import { useState, useCallback } from "react";
import SearchableSelect from "./SearchableSelect";
import { useSearchCourses } from "@services/courses/queries";
import { useDebounce } from "@hooks/useDebounce";
import type { Course } from "@lib/types/api";

interface CourseSelectorProps {
  value: Course | null;
  onChange: (course: Course) => void;
  className?: string;
  placeholder?: string;
}

export default function CourseSelector({
  value,
  onChange,
  className,
  placeholder = "Buscar curso...",
}: CourseSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data, isLoading } = useSearchCourses(debouncedQuery, true);

  const getLabel = useCallback(
    (c: Course) => `${c.course_code} - ${c.course_name}`,
    []
  );
  const getValue = useCallback((c: Course) => c.course_id, []);

  return (
    <SearchableSelect<Course>
      options={data?.items || []}
      value={value}
      onChange={onChange}
      getLabel={getLabel}
      getValue={getValue}
      onSearch={setSearchQuery}
      isLoading={isLoading}
      disableFiltering={true}
      placeholder={placeholder}
      className={className}
    />
  );
}
