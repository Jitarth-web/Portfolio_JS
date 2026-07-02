import studentManagement from "../assets/figma/student_management_system.png";
import paymentGateway from "../assets/figma/agrisort.png";
import blindStick from "../assets/figma/smart_waste_management.png";
import attendanceSystem from "../assets/figma/soundwave_ai.png";
import shagunFashions from "../assets/figma/shaun.png";
import domiqAi from "../assets/figma/domiq.png";
const thumbnails = [
  shagunFashions,
  studentManagement,
  paymentGateway,
  blindStick,
  attendanceSystem,
  domiqAi,
];

export default function ProjectVisual({ index }) {
  return (
    <div className="project-visual">
      <img
        src={thumbnails[index]}
        alt={`Project ${index + 1}`}
        className="project-thumbnail"
      />
    </div>
  );
}