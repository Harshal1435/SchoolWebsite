import { motion } from 'framer-motion';
import useBanner from '../hooks/useBanner';

const PageBanner = ({ page, children }) => {
  const { banner, loading } = useBanner(page);

  return (
    <section className="relative text-white py-28 overflow-hidden">
      {/* Background Image */}
      {!loading && banner?.imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-primary-700" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* If custom children passed, render them; otherwise use banner data */}
          {children ? (
            children
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-5 font-heading drop-shadow-lg">
                {banner?.title}
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow">
                {banner?.subtitle}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageBanner;
