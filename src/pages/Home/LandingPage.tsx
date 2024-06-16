import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LandingPage.css";

interface Exam {
  id: number;
  title: string;
  expiry_date: string;
}

const LandingPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRequestExamList = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:8000/api/questionnaires/active",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setExams(data.data); // Assuming the API returns an object with a "data" field containing the array of exams
    } catch (error) {
      console.error("Error requesting exam list:", error);
      toast.error("Error requesting exam list. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExam = async (examId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/questionnaires/${examId}/send-invitations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        if (response.status === 400) {
          toast.error("Error submitting data. Please try again later.");
        }
        throw new Error("Network response was not ok");
      }

      toast.success("Exam requested successfully, Please check your email!");
    } catch (error) {
      console.error("Error requesting exam:", error);
      toast.error("Error requesting exam. Please try again later.");
    }
  };

  return (
    <div className="landing-page">
      <ToastContainer />
      <h1>Welcome to EduQuest!</h1>
      <button
        className="request-exam-button"
        onClick={handleRequestExamList}
        disabled={loading}
      >
        {loading ? "Loading Exams..." : "View Exam List"}
      </button>
      {exams.length > 0 && (
        <table className="exam-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.id}</td>
                <td>{exam.title}</td>
                <td>{exam.expiry_date}</td>
                <td>
                  <button
                    className="request-exam-item-button"
                    onClick={() => handleRequestExam(exam.id)}
                  >
                    Request For Exam
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LandingPage;
