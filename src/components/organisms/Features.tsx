import { FEATURES } from "@lib/constants/features";
import FeatureCard from "@molecules/FeatureCard";
import CTAButton from "@atoms/CTAButton";
import AnimatedText from "@atoms/AnimatedText";

const Features = () => {
  return (
    <section
      id="features"
      className="py-16 md:py-24 px-4 md:px-8 lg:px-20 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <AnimatedText
            tag="h2"
            text="Funciones que potencian tu éxito académico"
            delay={0.1}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            variant="title"
          />

          <AnimatedText
            tag="p"
            text="Descubre todas las herramientas que te ayudarán a planificar, organizar y optimizar tu experiencia universitaria de manera inteligente."
            delay={0.2}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            variant="description"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              iconName={feature.iconName}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <CTAButton label="Explorar Todas las Funciones" delay={0.8} />
        </div>
      </div>
    </section>
  );
};

export default Features;
