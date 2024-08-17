import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";


const EmailVerificationPage = () => {

	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

    const { error, isLoading, verifyEmail } = useAuthStore();

    // It also handles pasting of the entire code, and moves focus accordingly.
	const handleChange = (index, value) => {
		const newCode = [...code];

        // If the user pastes more than one character, split it and fill the inputs.
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");  // Take the first 6 characters and split them into an array.
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";  // Assign the pasted values to the code array.
			}
			setCode(newCode);

            // Focus on the last non-empty input or the first empty one after pasting.
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
            // Update the current input value.
			newCode[index] = value;
			setCode(newCode);

            // Move focus to the next input field if a value is entered.
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

    // handleKeyDown manages the behavior when the user presses a key, like handling the backspace.
	const handleKeyDown = (index, e) => {
        // If Backspace is pressed on an empty field, move the focus to the previous field.
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

    // This function is triggered when the user submits the form or when all fields are filled.
	const handleSubmit = async (e) => {
		e.preventDefault();  
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/");
			toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
	};

    // useEffect hook triggers the submission automatically when all fields are filled.
	useEffect(() => {
        // If all fields are filled, trigger the handleSubmit function.
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);  // Dependency array ensures the effect runs whenever the 'code' state changes.

    // The component's UI.
	return (
		<div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: -50 }}  // Initial animation state.
				animate={{ opacity: 1, y: 0 }}  // Final animation state.
				transition={{ duration: 0.5 }}  // Animation duration.
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
			>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Verify Your Email
				</h2>
				<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>

                {/* The form containing the 6 input fields for the verification code. */}
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index}  // Unique key for each input field.
								ref={(el) => (inputRefs.current[index] = el)}  // Store the input reference.
								type='text'
								maxLength='1'  // Only allow a single digit per input field.
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}  // Handle input change.
								onKeyDown={(e) => handleKeyDown(index, e)}  // Handle keydown events.
								className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
							/>
						))}
					</div>
					{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
					<motion.button
						whileHover={{ scale: 1.05 }}  // Hover animation effect.
						whileTap={{ scale: 0.95 }}  // Tap animation effect.
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}  // Disable the button if loading or if any digit is missing.
						className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
					>
						{isLoading ? "Verifying..." : "Verify Email"}  
					</motion.button>
				</form>
			</motion.div>
		</div>
	);
};

export default EmailVerificationPage;
