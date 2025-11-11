import { motion } from "framer-motion";
import { useState } from "react";
import { slideInFromBottom } from "@lib/helpers/motion";
import { HELP_CATEGORIES, FAQS } from "@lib/constants/help";
import SvgIcon from "@atoms/SvgIcon";
import AnimatedText from "@atoms/AnimatedText";
import HelpCategory from "@molecules/HelpCategory";
import FAQItem from "@molecules/FAQItem";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const filteredFAQs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      id="help"
      className="py-16 md:py-24 px-4 md:px-8 lg:px-20 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <AnimatedText
            tag="h2"
            text="Centro de ayuda y soporte"
            delay={0.1}
            variant="title"
          />

          <AnimatedText
            tag="p"
            text="Encuentra toda la información que necesitas para aprovechar al máximo esta plataforma de planificación académica."
            delay={0.2}
            variant="description"
          />
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {HELP_CATEGORIES.map((category, index) => (
            <HelpCategory
              key={index}
              iconName={category.iconName}
              title={category.title}
              description={category.description}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedText
              tag="h2"
              text="Preguntas Frecuentes"
              delay={0.3}
              variant="title"
            />
            <AnimatedText
              tag="p"
              text="Encuentra respuestas rápidas a las dudas más comunes"
              delay={0.4}
              variant="description"
            />
          </div>

          {/* Search Bar */}
          <motion.div variants={slideInFromBottom} className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <SvgIcon name="search" className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                delay={index * 0.1}
              />
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No se encontraron preguntas que coincidan con tu búsqueda.
              </p>
            </motion.div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Estoy aquí para ayudarte. Escríbeme y te responderé lo antes
              posible.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="button-primary text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
                <SvgIcon name="mail" />
                Enviar Email
              </button>

              <button className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/30 dark:hover:bg-gray-700/30 hover:border-primary/50 hover:scale-105 active:scale-95 transition-all duration-300">
                <SvgIcon name="message-circle" className="w-5 h-5" />
                Déjanos tu feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Help;
