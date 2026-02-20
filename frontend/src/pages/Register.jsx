import { motion } from 'framer-motion';
import RegistrationForm from '../components/RegistrationForm';
import useSearch from '../hooks/useSearch';
import { fadeInDown } from '../animations/framerMotion';

const Register = () => {
  const { searchParams } = useSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div variants={fadeInDown} initial="hidden" animate="visible" className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-500">
            Join HealthBid to search CPT codes and place competitive bids.
          </p>
          {(searchParams.cpt || searchParams.zip) && (
            <div className="mt-3 inline-block bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full">
              🔍 Your search has been saved - register to see results
            </div>
          )}
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <RegistrationForm
            prefillCpt={searchParams.cpt}
            prefillZip={searchParams.zip}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
