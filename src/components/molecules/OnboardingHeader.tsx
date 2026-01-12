import SvgIcon from "@atoms/SvgIcon";

interface OnboardingHeaderProps {
  userName: string;
  stepTitle: string;
  userAvatar?: string;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  userName,
  stepTitle,
  userAvatar,
}) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={`Foto de perfil de ${userName}`}
              className="w-16 h-16 object-cover rounded-full"
              onError={(e) => {
                console.log("Error loading image:", userAvatar);
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <SvgIcon name="user" size="lg" className="text-white" />
            </div>
          )}
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        ¡Bienvenido, {userName}!
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg">{stepTitle}</p>
    </div>
  );
};

export default OnboardingHeader;
