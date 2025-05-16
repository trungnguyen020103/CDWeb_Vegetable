import { useState } from 'react';
import { AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        // Validate username
        if (!formData.username.trim()) {
            newErrors.username = 'Tên đăng nhập không được để trống';
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
            // Form is valid - would normally submit to server
            console.log('Login submitted:', formData);
            setIsSubmitted(true);

            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    username: '',
                    password: '',
                    rememberMe: false
                });
                setIsSubmitted(false);
            }, 3000);
        } else {
            setErrors(validationErrors);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Đăng Nhập</h2>

                {isSubmitted && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
                        <CheckCircle className="mr-2" size={20} />
                        <span>Đăng nhập thành công!</span>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đăng nhập <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Nhập tên đăng nhập hoặc email"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="mr-1" size={14} />
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                Quên mật khẩu?
              </span>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nhập mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertTriangle className="mr-1" size={14} />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            Ghi nhớ đăng nhập
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Đăng Nhập
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center text-sm text-gray-600 mt-4">
                        Chưa có tài khoản?{' '}
                        <span className="text-blue-600 hover:underline cursor-pointer">
              Đăng ký ngay
            </span>
                    </div>

                    {/* Social Login */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng nhập với
                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div>
                                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <svg
                                        className="h-5 w-5 text-blue-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        fill="currentColor"
                                    >
                                        <path d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4ZM30 18H28C26.896 18 26 18.896 26 20V22H30L29.4 26H26V36H22V26H18V22H22V19.6C22 17.12 23.84 14 28 14H30V18Z" />
                                    </svg>
                                    <span className="ml-2">Facebook</span>
                                </button>
                            </div>
                            <div>
                                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <svg
                                        className="h-5 w-5 text-red-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        fill="currentColor"
                                    >
                                        <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                    </svg>
                                    <span className="ml-2">Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}