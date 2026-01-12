import { useState } from "react";
import { User, AcademicProfile } from "@lib/types/api";
import SvgIcon from "@atoms/SvgIcon";
import { clsx } from "clsx";
import { signOut } from "@lib/helpers/authActions";
import { useNeonAuth } from "@lib/hooks/useNeonAuth";
import { authClient } from "@lib/helpers/auth";

interface UserProfileCardProps {
  user?: User;
  profile?: AcademicProfile;
  programName?: string;
  className?: string;
}

export default function UserProfileCard({
  user: initialUser,
  profile,
  programName,
  className,
}: UserProfileCardProps) {
  const { user: authUser } = useNeonAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Use authUser (from session) as primary source, fallback to initialUser (prop)
  const effectiveUser = authUser || initialUser;

  if (!effectiveUser && !profile) return null;

  const displayName =
    effectiveUser?.name || effectiveUser?.email?.split("@")[0] || "Estudiante";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setIsEditingName(false);
      return;
    }

    setIsUpdating(true);
    try {
      // @ts-ignore
      const { error } = await authClient.updateUser({
        name: newName,
      });

      if (error) {
        console.error("Error updating user:", error);
      } else {
        // Force refresh of the page to reflect changes since we can't easily invalidate the internal Neon hook
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={clsx(
        "relative flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-base-100 p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md dark:bg-base-dark md:flex-row md:gap-5 md:p-5",
        className
      )}
    >
      {/* Avatar Section */}
      <div className="relative group">
        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary/10 bg-base-200 shadow-sm transition-transform group-hover:scale-105 dark:border-white/5 dark:bg-white/5 md:h-24 md:w-24">
          {effectiveUser?.image ? (
            <img
              src={effectiveUser.image}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary/80 md:text-3xl">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
        {/* Verification Check */}
        {effectiveUser?.emailVerified && (
          <div
            className="absolute bottom-0 right-0 rounded-full bg-success p-1 text-white ring-2 ring-base-100 dark:ring-base-dark"
            title="Verificado"
          >
            <SvgIcon name="check" className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex w-full flex-1 flex-col items-center text-center md:items-start md:text-left">
        {/* Mobile Markers */}
        <div className="mb-1 flex w-full justify-between px-2 text-xs font-bold text-base-content/40 md:hidden">
          <span>{profile?.student_id || "ESTUDIANTE"}</span>
          <span>SEM {profile?.current_semester || "-"}</span>
        </div>

        {/* Name Editing Area */}
        {isEditingName ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateName();
            }}
            className="mb-1 flex w-full items-center justify-center gap-2 md:justify-start"
          >
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input input-sm input-bordered w-full max-w-[240px] text-lg font-bold"
              placeholder="Tu nombre"
              disabled={isUpdating}
            />
            <button
              type="submit"
              className="btn btn-square btn-ghost btn-sm text-success"
              disabled={isUpdating}
            >
              <SvgIcon name="check" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingName(false)}
              className="btn btn-square btn-ghost btn-sm text-error"
              disabled={isUpdating}
            >
              <SvgIcon name="x" className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <div className="group/name flex items-center gap-2">
            <h2 className="font-title text-2xl font-bold tracking-tight text-base-content dark:text-base-dark-content md:text-3xl">
              {displayName}
            </h2>
            <button
              onClick={() => {
                setNewName(effectiveUser?.name || "");
                setIsEditingName(true);
              }}
              className={clsx(
                "transition-all hover:text-primary",
                !effectiveUser?.name
                  ? "animate-pulse text-primary opacity-100"
                  : "text-base-content/20 opacity-0 group-hover/name:opacity-100"
              )}
              title="Editar nombre"
            >
              <SvgIcon name="edit" className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Program Name */}
        <p className="line-clamp-1 text-base font-medium text-primary/80 dark:text-primary-content/80">
          {programName ||
            (profile?.current_program_id
              ? `Programa #${profile.current_program_id}`
              : "Sin programa asignado")}
        </p>

        <div className="my-2 h-px w-full bg-base-content/5 md:w-3/4"></div>

        {/* Footer Info */}
        <div className="flex w-full flex-wrap items-center justify-center gap-3 text-sm md:justify-start">
          {profile?.student_id && (
            <div
              className="flex items-center gap-1.5 rounded-md bg-base-200/50 px-2 py-1 font-mono text-xs font-medium text-base-content dark:bg-white/10 dark:text-white"
              title="Carnet / ID Estudiante"
            >
              <SvgIcon name="user" className="h-3.5 w-3.5 opacity-70" />
              <span>{profile.student_id}</span>
            </div>
          )}
          {effectiveUser?.email && (
            <div className="flex items-center gap-1.5 px-2 text-base-content/70 transition-colors hover:text-primary dark:text-white/80">
              <SvgIcon name="mail" className="h-4 w-4 opacity-70" />
              <span>{effectiveUser.email}</span>
            </div>
          )}
          <div className="flex-1"></div> {/* Spacer */}
          <button
            onClick={handleSignOut}
            className="group flex items-center gap-2 rounded-lg border border-error/20 bg-error/5 px-3 py-1.5 text-xs font-medium text-error/80 transition-all hover:border-error/40 hover:bg-error/10 hover:text-error dark:border-error/30 dark:bg-error/10 dark:text-error/90 dark:hover:bg-error/20"
          >
            <SvgIcon
              name="logout"
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}
