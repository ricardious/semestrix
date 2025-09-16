import { motion } from "framer-motion";
import { slideInFromTop } from "@lib/helpers/motion";
import SvgIcon from "@components/atoms/SvgIcon";

const WelcomeBadge: React.FC = () => (
  <motion.div
    variants={slideInFromTop}
    className="welcome-box py-2 px-2 border border-[#7042f88b] opacity-[0.9] mx-auto flex items-center"
  >
    <SvgIcon name="sparkles" className="text-primary mr-2 size-4 sm:size-5" />
    <h1 className="welcome-text text-[13px] sm:text-sm md:text-base">
      Semestrix by Ricardious
    </h1>
  </motion.div>
);

export default WelcomeBadge;
