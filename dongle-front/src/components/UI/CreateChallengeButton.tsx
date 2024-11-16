// components/CreateChallengeButton.jsx
export default function CreateChallengeButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
    >
      Create Challenge
    </button>
  )
}