import { motion } from 'framer-motion';
import LoginForm from '../components/LoginForm';
import { fadeInDown } from '../animations/framerMotion';

const Login = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
    <div className="max-w-md w-full">
      <motion.div
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
          <span className="text-white font-extrabold text-xl">CPT</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500">Sign in to your HealthBid account</p>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <LoginForm />
      </div>
    </div>
  </div>
);

export default Login;
