import { motion } from "framer-motion";
import { staggerContainer } from "@lib/helpers/motion";
import LegalPageHeader from "@molecules/LegalPageHeader";
import LegalIntroCard from "@molecules/LegalIntroCard";
import LegalSection from "@molecules/LegalSection";
import ContactSection from "@molecules/ContactSection";
import LegalFooterInfo from "@molecules/LegalFooterInfo";
import { TERMS_PAGE_INFO, TERMS_SECTIONS } from "@constants/terms";

const TermsPage = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 py-16 md:px-8 lg:px-20">
        <LegalPageHeader
          title={TERMS_PAGE_INFO.title}
          subtitle={TERMS_PAGE_INFO.subtitle}
          lastUpdated={TERMS_PAGE_INFO.lastUpdated}
          effectiveDate={TERMS_PAGE_INFO.effectiveDate}
        />

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <LegalIntroCard title={TERMS_PAGE_INFO.introTitle}>
            <p>{TERMS_PAGE_INFO.introText}</p>
          </LegalIntroCard>

          {TERMS_SECTIONS.map((section, sectionIndex) => (
            <LegalSection
              key={sectionIndex}
              title={section.title}
              content={section.content}
            />
          ))}

          <ContactSection
            title={TERMS_PAGE_INFO.contactTitle}
            subtitle={TERMS_PAGE_INFO.contactSubtitle}
            email={TERMS_PAGE_INFO.contactEmail}
            supportLink={TERMS_PAGE_INFO.supportLink}
          />

          <LegalFooterInfo
            lastUpdated={TERMS_PAGE_INFO.lastUpdated}
            effectiveDate={TERMS_PAGE_INFO.effectiveDate}
            version={TERMS_PAGE_INFO.version}
            description={TERMS_PAGE_INFO.footerDescription}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TermsPage;
