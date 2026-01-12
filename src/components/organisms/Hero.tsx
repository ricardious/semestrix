import { motion } from "framer-motion";
import {
  fadeIn,
  slideInFromBottom,
  staggerContainer,
} from "@lib/helpers/motion";
import GradientTitle from "@atoms/GradientTitle";
import CTAButton from "@atoms/CTAButton";
import WelcomeBadge from "@molecules/WelcomeBadge";

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      id="home"
      className="h-screen flex flex-col items-center justify-center px-4 md:px-8 lg:px-20 pt-20 w-full z-[20] dark:bg-transparent bg-transparent"
    >
      {/* Text Content Section */}
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 justify-center m-auto text-center">
        {/* Welcome Badge */}
        <WelcomeBadge />

        {/* Main Title */}
        <motion.div
          variants={fadeIn(0.3)}
          className="flex flex-col gap-6 mt-6 max-w-[800px] w-auto h-auto mx-auto"
        >
          <GradientTitle
            preText="Planifica tu semestre y"
            gradientText="rastrea tu progreso académico"
          />
        </motion.div>

        <motion.p
          variants={slideInFromBottom}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 my-5 max-w-[600px] mx-auto"
        >
          La herramienta esencial para estudiantes de ingeniería. Organiza tu
          horario, controla tus créditos y descubre qué materias puedes cursar
          según tu progreso en el pensum.
        </motion.p>

        <CTAButton label="Comenzar Ahora" />
      </div>
    </motion.div>
  );
};

export default HeroContent;
