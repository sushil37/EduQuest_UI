import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import { useParams, useNavigate } from "react-router-dom";
import "./QuestionPage.css";

interface Option {
  id: number;
  option_text: string;
  is_correct: number;
}

interface Question {
  id: number;
  question_text: string;
  options: Option[];
}

interface ExamData {
  title: string;
  expiry_date: string;
  questions: Question[];
}

const QuestionPage: React.FC = () => {
  const { userId, token } = useParams<{ userId: string; token: string }>();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [responses, setResponses] = useState<{ question_id: number; option_id: string }[]>([]); // State to store student responses

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/questionnaires/${userId}/access/${token}`
        );
      
        if (!response.ok) {
          if (response.status === 400) {
            toast.error("Invalid token or user ID. Redirecting to 404 page...");
            setTimeout(() => navigate("/404")); // Redirect after 3 seconds
          }
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setExamData(data.data); // Store fetched data in state
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Invalid token or user ID. Redirecting to 404 page...");
            setTimeout(() => navigate("/404"));
      }
    };

    fetchData();
  }, [userId, token, navigate]); // Fetch data whenever userId or token changes

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/questionnaires/${userId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: 1, // Replace with actual student ID
          responses: responses,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          toast.error("Error submitting data. Please try again later.");
          navigate("/404"); // Redirect immediately
        }
        throw new Error("Network response was not ok");
      }
      toast.success("Submission successful!");
      setResponses([]);

    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data. Please try again later.");
    }
  };

  const handleOptionChange = (questionId: number, optionId: string) => {
    const updatedResponses = [...responses];
    const index = updatedResponses.findIndex((response) => response.question_id === questionId);

    if (index !== -1) {
      updatedResponses[index].option_id = optionId;
    } else {
      updatedResponses.push({ question_id: questionId, option_id: optionId });
    }

    setResponses(updatedResponses);
  };

  if (!examData) {
    return <div>Loading...</div>;
  }

  if (!examData.questions || examData.questions.length === 0) {
    return <div>No questions found.</div>; // Handle case where questions array is empty or undefined
  }

  return (
    <div className="question-page">
      <ToastContainer /> {/* ToastContainer component for react-toastify */}
      <div className="content-container">
        <h2>{examData.title}</h2>
        <p>Expiry Date: {examData.expiry_date}</p>

        {examData.questions.map((question) => (
          <div key={question.id} className="question-container">
            <p>{question.question_text}</p>
            <ul className="options-list">
              {question.options.map((option) => (
                <li key={option.id}>
                  <label>
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={option.id.toString()}
                      onChange={() => handleOptionChange(question.id, option.id.toString())}
                    />
                    {option.option_text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;