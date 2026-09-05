import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/BackButton.css";

const BackButton = ({ fallback = "/dashboard" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      className="back-button"
      onClick={handleBack}
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;